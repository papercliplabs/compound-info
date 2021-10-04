export enum coin_E {
	BAT = 0,
	COMP,
	DAI,
	ETH,
	UNI,
	ZRX,
	USDC,
	USDT,
	WBTC,
	WBTC2,
	AAVE,
	MKR,
	SUSHI,
	TUSD,
	YFI,
	LINK,
}

export enum time_selector_E {
	ONE_DAY = 0,
	ONE_WEEK,
	ONE_MONTH,
	THREE_MONTHS,
	ONE_YEAR,
	ALL,
}

/**
 * All time series data selectors
 * The order here must be in the same order as produces from keys.sort(compareFn) in requests
 */
export enum time_series_data_selector_E {
	BORROW_APY = 0,
	BORROW_USD,
	RESERVES_USD,
	SUPPLY_APY,
	SUPPLY_USD,
	TOTAL_BORROW_APY,
	TOTAL_SUPPLY_APY,
	UTALIZATION,
}
