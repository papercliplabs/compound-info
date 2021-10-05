import { URLS, TIME_SERIES_DATA_SELECTOR_INFO } from "common/constants";
import { getCoinNameList, getCoinForCoinName } from "common/utils";

import { market_summary_data_S, protocol_summary_data_S, time_series_data_S } from "common/interfaces";

//// API requests, manipulates responses in a nice way to save in store and render later

/**
 * Fetch time series data and transform it into nice to use format
 * @returns short and long term time series data
 */
export async function requestTimeSeriesData(): Promise<{
	shortTerm: time_series_data_S[];
	longTerm: time_series_data_S[];
} | null> {
	console.log("fetching coin data");
	const shortTimeSeriesUrl = URLS.SHORT_TIME_SERIES_DATA;
	const longTimeSeriesUrl = URLS.LONG_TIME_SERIES_DATA;
	let ret: any = {};

	const coinNames = getCoinNameList();

	// Sending parallel api requests, and transforming the data into desired format
	await Promise.all(
		[
			["shortTerm", shortTimeSeriesUrl],
			["longTerm", longTimeSeriesUrl],
		].map(([type, url]) =>
			fetch(url)
				.then((response) => response.json())
				.then((data) => {
					const transformedData: time_series_data_S[] = [];

					// For each row (time step) in data
					for (let i = 0; i < data.length; i++) {
						const transformedRow: any = {};

						// For each data selector
						for (let j = 0; j < TIME_SERIES_DATA_SELECTOR_INFO.length; j++) {
							const dataSelectorInfo = TIME_SERIES_DATA_SELECTOR_INFO[j];
							const dataSelectorData: any = {};

							// For each coin name
							for (let k = 0; k < coinNames.length; k++) {
								const coinName = coinNames[k];
								const fullQueryKey = coinName + "_" + dataSelectorInfo.sqlKey;

								dataSelectorData[coinName] = data[i][fullQueryKey];
							}

							dataSelectorData["blockTime"] = data[i]["BLOCK_TIME"]; // Grab the block time
							transformedRow[dataSelectorInfo.key] = dataSelectorData;
						}
						transformedData.push(transformedRow as time_series_data_S);
					}

					ret[type] = transformedData;
				})
				.catch((error) => {
					console.log(error);
					ret = null;
				})
		)
	).catch((error) => {
		console.log(error);
		ret = null;
	});

	if (ret && ret.shortTerm.length === 0 && ret.longTerm.length === 0) {
		return null;
	} else {
		return ret;
	}
}

/**
 * Http request to get market and protocol summary data, and eth to use conversion factor
 * @returns null if there is an error, otherwise a list of 3 things where:
 * 		* First element: list of market summary data for each coin with the indicies being the corresponding coin_E value
 * 		* Second element: protocol level summary data
 * 		* Third element: eth to usd price conversion
 */
export async function requestSummaryData(): Promise<[market_summary_data_S[], protocol_summary_data_S, number] | null> {
	console.log("fetching summary data");
	const url = URLS.SUMMARY_DATA;

	const params = {
		addresses: [""], // All addresses
		block_timestamp: 0, // Most current timestamp
		meta: true,
	};

	const response = await fetch(url, {
		method: "POST",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify(params),
	});

	if (!response.ok) {
		const error = await response.text();
		console.log("Error requesting summary Data:" + error);
		return null;
	}

	let data = await response.json();
	const metaData = data.meta; // Holds unique suppliers and borrowers for all markets
	data = data.cToken;

	// Conversion factor using price of USD = USDC
	const usdcData = data.filter((obj: any) => obj.underlying_symbol === "USDC")[0];
	const ethToUsd = 1 / parseFloat(usdcData.underlying_price.value);

	const totals: any = {
		totalSupply: 0,
		totalBorrow: 0,
		totalReserves: 0,
		maxBorrow: 0,
	};

	const marketSummaryList = [];

	for (let i = 0; i < data.length; i++) {
		const coinData = data[i];
		const coinName = coinData.symbol.slice(1); // Remove the leading c
		const coin = getCoinForCoinName(coinName);

		if (!coin) {
			// Coin doesn't exist in our list of coins, so lets ignore it
			continue;
		}

		const underlyingToUsd = parseFloat(coinData.underlying_price.value) * ethToUsd;
		const cTokenToUnderlying = parseFloat(coinData.exchange_rate.value);
		const cTokenToUsd = cTokenToUnderlying * underlyingToUsd;

		const newData: any = {
			name: coinData.symbol.slice(1), // Remove the leading c
			cTokenAddress: coinData.token_address,
			underlyingPrice: underlyingToUsd,
			numberOfSuppliers: coinData.number_of_suppliers,
			numberOfBorrowers: coinData.number_of_borrowers,

			totalSupply: parseFloat(coinData.total_supply.value) * cTokenToUsd,
			totalBorrow: parseFloat(coinData.total_borrows.value) * underlyingToUsd,
			totalReserves: parseFloat(coinData.reserves.value) * underlyingToUsd,
			borrowCap: parseFloat(coinData.borrow_cap.value) * underlyingToUsd,

			distributionSupplyApy: parseFloat(coinData.comp_supply_apy.value) / 100,
			distributionBorrowApy: parseFloat(coinData.comp_borrow_apy.value) / 100,
			collateralFactor: parseFloat(coinData.collateral_factor.value),
			reserveFactor: parseFloat(coinData.reserve_factor.value),

			supplyApy: parseFloat(coinData.supply_rate.value),
			borrowApy: parseFloat(coinData.borrow_rate.value),
		};

		// Derived data
		newData["marketSize"] = newData.totalSupply * newData.collateralFactor;
		newData["maxBorrow"] = newData.borrowCap ? Math.min(newData.borrowCap, newData.marketSize) : newData.marketSize; // borrow cap of 0 means no cap
		newData["utilization"] = newData.totalBorrow / newData.totalSupply;
		newData["availableLiquidity"] = Math.max(0, newData.maxBorrow - newData.totalBorrow);
		newData["totalValueLocked"] = newData.totalSupply - newData.totalBorrow;

		newData["totalSupplyApy"] = newData.supplyApy + newData.distributionSupplyApy;
		newData["totalBorrowApy"] = newData.borrowApy - newData.distributionBorrowApy;

		totals.totalSupply += newData.totalSupply;
		totals.totalBorrow += newData.totalBorrow;
		totals.totalReserves += newData.totalReserves;
		totals.maxBorrow += newData.maxBorrow;

		marketSummaryList[coin] = newData;
	}

	totals["numberOfUniqueSuppliers"] = metaData.unique_suppliers;
	totals["numberOfUniqueBorrowers"] = metaData.unique_borrowers;
	totals["utilization"] = totals.totalBorrow / totals.maxBorrow;

	return [marketSummaryList, totals, ethToUsd];
}

export async function requestGasData() {
	console.log("fetching gas data");
	const response = await fetch(URLS.GAS_NOW);

	if (!response.ok) {
		const error = await response.text();
		console.log("Error requesting gas Data:" + error);
		return null;
	}

	let data = await response.json();
	data = data.data;

	return data;
}
