import { URLS } from 'constants/index';
import { getCoinList } from 'utils';

//// API requests, manipulates responses in a nice way to save in store and render later

// Fetch the data using the URL's pointing to flipside queries
export async function requestApyData() {
	console.log('fetching apy data');
	const shortTermUrl = URLS.APY_SHORT;
	const longTermUrl = URLS.APY_LONG;
	let ret = {};

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

	// Sending parallel api requests, and manipulating it in an easy to consume manor
	await Promise.all(
		[
			['shortTerm', shortTermUrl],
			['longTerm', longTermUrl],
		].map(([type, url]) =>
			fetch(url)
				.then((response) => response.json())
				.then((data) => {
					let keys = Object.keys(data[0]).filter((key) => key !== 'BLOCK_TIME'); // Table keys without block time
					keys.sort(compareFn); // 0|i => borrow, 1|i => supply, 2|i => total borrow, 3|i => total supply
					const max = keys.length + 1; // len: keys.len + 1

					data = data.map((entry) => {
						let newEntry = {
							blockTime: entry.BLOCK_TIME,
							values: {
								borrow: {},
								supply: {},
								totalBorrow: {},
								totalSupply: {},
							},
						};

						for (let i = 0; i < max / 4 - 1; i++) {
							newEntry.values['borrow'][coins[i]] = entry[keys[4 * i]];
							newEntry.values['supply'][coins[i]] = entry[keys[4 * i + 1]];
							newEntry.values['totalBorrow'][coins[i]] = entry[keys[4 * i + 2]];
							newEntry.values['totalSupply'][coins[i]] = entry[keys[4 * i + 3]];
						}

						return newEntry;
					});
					ret[type] = data;
				})
				.catch((error) => console.log(error))
		)
	).catch((error) => console.log(error));

	return ret;
}

export async function requestSummaryData() {
	console.log('fetching summary data');
	const url = URLS.SUMMARY_DATA;
	const coinList = getCoinList();

	const params = {
		addresses: [''], // All addresses
		block_timestamp: 0, // Most current timestamp
		meta: true,
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(params),
	});

	if (!response.ok) {
		const error = await response.text();
		console.log('Error requesting summary Data:' + error);
		return {};
	}

	let data = await response.json();
	const metaData = data.meta; // Holds unique suppliers and borrowers for all markets
	data = data.cToken;

	// Conversion factor using price of USD = USDC
	const usdcData = data.filter((obj) => obj.underlying_symbol === 'USDC')[0];
	const ethToUsd = 1 / parseFloat(usdcData.underlying_price.value);

	const totals = {
		totalSupply: 0,
		totalBorrow: 0,
		totalReserves: 0,
		maxBorrow: 0,
	};

	// Transform into more useful form
	data = data.map((coinData) => {
		const underlyingToUsd = parseFloat(coinData.underlying_price.value) * ethToUsd;
		const cTokenToUnderlying = parseFloat(coinData.exchange_rate.value);
		const cTokenToUsd = cTokenToUnderlying * underlyingToUsd;

		const newData = {
			name: coinData.symbol.slice(1), // Remove the leading c
			cTokenAddress: coinData.token_address,
			underlyingAddress: coinData.underlying_address,
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
		newData['marketSize'] = newData.totalSupply * newData.collateralFactor;
		newData['maxBorrow'] = newData.borrowCap ? Math.min(newData.borrowCap, newData.marketSize) : newData.marketSize; // borrow cap of 0 means no cap
		newData['utilization'] = newData.totalBorrow / newData.totalSupply;
		newData['availableLiquidity'] = Math.max(0, newData.maxBorrow - newData.totalBorrow);
		newData['totalValueLocked'] = newData.totalSupply - newData.totalBorrow;

		totals.totalSupply += newData.totalSupply;
		totals.totalBorrow += newData.totalBorrow;
		totals.totalReserves += newData.totalReserves;
		totals.maxBorrow += newData.maxBorrow;

		return newData;
	});

	// Filter out the unused coins
	data = data.filter((coinData) => {
		return coinList.includes(coinData.name);
	});

	totals['numberOfUniqueSuppliers'] = metaData.unique_suppliers;
	totals['numberOfUniqueBorrowers'] = metaData.unique_borrowers;
	totals['utilization'] = totals.totalBorrow / totals.maxBorrow;

	data['ALL'] = totals;

	return [data, ethToUsd];
}

// Example of response data on a single coin: (https://compound.finance/docs/api#CTokenService)
// {
// 		borrow_cap: {value: "90750.00000000000000000"} -> In number of this asset
//		borrow_rate: {value: "0.073069347550420829539998625"}
//		cash: {value: "398302.984529048648843283"}
//		collateral_factor: {value: "0.60000000000000000"}
//		comp_borrow_apy: {value: "14.121370424434954"}
//		comp_supply_apy: {value: "2.4867830322301776"}
//		exchange_rate: {value: "0.020281861414402391"}
//		interest_rate_model_address: "0xd956188795ca6f4a74092ddca33e0ea4ca3a1395"
//		name: "Compound Collateral"
//		number_of_borrowers: 98
//		number_of_suppliers: 3931
//		reserve_factor: {value: "0.25000000000000000"}
//		reserves: {value: "945.0536197237982647850500000"}
//		supply_rate: {value: "0.009883654153405490432620127"}
//		symbol: "cCOMP"
//		token_address: "0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4"
//		total_borrows: {value: "90755.298189666935054184"}
//		total_supply: {value: "24066490.69953593"}
//		underlying_address: "0xc00e94cb662c3520282e6f5717214004a7f26888"
//		underlying_name: "Compound Governance Token"
//		underlying_price: {value: "0.207669553249863714"}
//		underlying_symbol: "COMP"
//	}

export async function requestGasData() {
	console.log('fetching gas data');
	const response = await fetch(URLS.GAS_NOW);

	if (!response.ok) {
		const error = await response.text();
		console.log('Error requesting gas Data:' + error);
		return null;
	}

	let data = await response.json();
	data = data.data;

	return data;
}
