// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { URLS, TIME_SERIES_DATA_SELECTORS } from "common/constants";
import { getCoinList, getCoinForCoinName } from "common/utils";

import { market_summary_data_S, protocol_summary_data_S } from "common/interfaces";

//// API requests, manipulates responses in a nice way to save in store and render later

// Fetch the data using the URL's pointing to flipside queries
export async function requestTimeSeriesData() {
	console.log("fetching coin data");
	const shortTimeSeriesUrl = URLS.SHORT_TIME_SERIES_DATA;
	const longTimeSeriesUrl = URLS.LONG_TIME_SERIES_DATA;
	const ret = {};

	// Custom compare function for sorting to handle the case where one is a substring of the other, this is for WBTC and WBTC2
	function compareFn(a, b) {
		if (a.includes(b)) {
			return -1;
		} else if (b.includes(a)) {
			return 1;
		} else {
			return [a, b].sort()[0] === a ? -1 : 1; // default sort
		}
	}

	const coins = getCoinList().sort(compareFn);

	// List of all the data types, in order
	const timeSeriesDataTypes = Object.keys(TIME_SERIES_DATA_SELECTORS).map(
		(objName) => TIME_SERIES_DATA_SELECTORS[objName].key
	);

	// Sending parallel api requests, and manipulating it in an easy to consume manor
	await Promise.all(
		[
			["shortTerm", shortTimeSeriesUrl],
			["longTerm", longTimeSeriesUrl],
		].map(([type, url]) =>
			fetch(url)
				.then((response) => response.json())
				.then((data) => {
					const keys = Object.keys(data[0]).filter((key) => key !== "BLOCK_TIME"); // Table keys without block time
					keys.sort(compareFn); // 0|i => borrow, 1|i => supply, 2|i => total borrow, 3|i => total supply
					const max = keys.length + 1; // len: keys.len + 1
					const numDataTypes = timeSeriesDataTypes.length;

					// TIME_SERIES_DATA_SELECTORS_KEYS must be in the same order as the keys here

					data = data.map((entry) => {
						const newEntry = {
							blockTime: entry.BLOCK_TIME,
							values: {},
						};

						// Initialize values to the datatypes and an empty object
						for (let i = 0; i < numDataTypes; i++) {
							newEntry.values[timeSeriesDataTypes[i]] = {};
						}

						for (let i = 0; i < max / numDataTypes - 1; i++) {
							for (let j = 0; j < numDataTypes; j++) {
								newEntry.values[timeSeriesDataTypes[j]][coins[i]] = entry[keys[numDataTypes * i + j]];
							}
						}

						return newEntry;
					});

					ret[type] = data;
				})
				.catch((error) => console.log(error))
		)
	).catch((error) => console.log(error));

	// {shortTerm: Array<blockTime, values{borrowApy: {AAVE, BAT, COMP, DAI, ... (all coins)}, borrowUsd: {AAVE, BAT, ... }, ... (all data types)}>,
	//  longTerm: Array<blockTime, values{borrowApy: {AAVE, BAT, ...}, borrowUsd: { AAVE, BAT, ... }, ... (all data types)}>}

	console.log(ret);

	return ret;
}

/**
 * Http request to get market and protocol summary data, and eth to use conversion factor
 * @returns null if there is an error, otherwise a list of 3 things where:
 * 		* First element: list of market summary data for each coin with the indicies being the corresponding coin_E value
 * 		* Second element: protocol level summary data
 * 		* Third element: eth to usd price conversion
 */
export async function requestSummaryData(): [market_summary_data_S[], protocol_summary_data_S, number] | null {
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
		return {};
	}

	let data = await response.json();
	const metaData = data.meta; // Holds unique suppliers and borrowers for all markets
	data = data.cToken;

	// Conversion factor using price of USD = USDC
	const usdcData = data.filter((obj) => obj.underlying_symbol === "USDC")[0];
	const ethToUsd = 1 / parseFloat(usdcData.underlying_price.value);

	const totals = {
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

		const newData = {
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
