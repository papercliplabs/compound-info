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

/**
 * String literal of coin names, these are used in coin_info_S and timer_series_data_S
 */
export type coin_name_L =
	| "BAT"
	| "COMP"
	| "DAI"
	| "ETH"
	| "UNI"
	| "ZRX"
	| "USDC"
	| "USDT"
	| "WBTC"
	| "WBTC2"
	| "AAVE"
	| "LINK"
	| "MKR"
	| "SUSHI"
	| "TUSD"
	| "YFI";

/**
 * String literals of data selector keys, these are used in time_series_data_selector_info_S and timer_series_data_S
 */
export type time_series_data_selector_key_L =
	| "borrowApy"
	| "borrowUsd"
	| "reservesUsd"
	| "supplyApy"
	| "supplyUsd"
	| "totalBorrowApy"
	| "totalSupplyApy"
	| "utalization";
