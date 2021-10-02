import { coin_name_L, time_series_data_selector_key_L } from "common/enums";
import { coin_E, time_series_data_selector_E } from "common/enums";

/**
 * Structure which holds information about a coin
 */
export interface coin_info_S {
	name: coin_name_L;
	imgSrc: string;
	desc: string;
	whitepaper: string;
	website: string;
	twitter: string;
	coingecko: string;
}

/**
 * Structure which holds summary data for each coin market
 */
export interface market_summary_data_S {
	name: string;
	availableLiquidityUsd: number;
	borrowApy: number;
	borrowCapUsd: number;
	cTokenAddress: string;
	collateralFactor: number;
	distributionBorrowApy: number;
	distributionSupplyApy: number;
	marketSizeUsd: number;
	maxBorrowUsd: number;
	numberOfBorrowers: number;
	numberOfSuppliers: number;
	reserveFactor: number;
	supplyApy: number;
	totalBorrowUsd: number;
	totalBorrowApy: number;
	totalReservesUsd: number;
	totalSupplyUsd: number;
	totalSupplyApy: number;
	totalValueLockedUsd: number;
	underlyingPriceUsd: number;
	utilization: number;
}

/**
 * Strucutre which holds summary data for the entire protocol
 */
export interface protocol_summary_data_S {
	maxBorrowUsd: number;
	numberOfUniqueBorrowers: number;
	numberOfUniqueSuppliers: number;
	totalBorrowUsd: number;
	totalReservesUsd: number;
	totalSupplyUsd: number;
	totalUtilization: number;
}

/**
 * Structure which holds a mapping from a dictionary key of market_summary_data_S, to the name of the data at that key
 * key: key of the data in the market summary data
 * name: name of the thing corresponding to the key, generally this is what is displayed on the front end
 * unit: unit for the data if it has a unit
 */
export interface market_summary_column_info_S {
	key: keyof market_summary_data_S;
	name: string;
	unit?: string;
}

/**
 * Structure which holds data about a time selector
 */
export interface time_selector_info_S {
	name: string;
	days: number | null;
}

/**
 * Structure which holds data about a time series data selector
 * key: key used to store the time series data in the app
 * sqlKey: data selector part of the sql column name (full name is <coin name>_<sqlKey>)
 * displayName: name of the thing corresponding to the key for use displaying within the app
 */
export interface time_series_data_selector_info_S {
	key: time_series_data_selector_key_L;
	sqlKey: string;
	displayName: string;
	description: string;
	unit: string | null;
}

export type time_series_data_entry_S = {
	[key in coin_name_L]: number | null;
} & {
	ALL: number | null; // For aggregate of data, for some fields this doesn't make sense tho
	blockTime: Date;
};

/**
 * Structure to hold time series data
 */
export type time_series_data_S = {
	[key in time_series_data_selector_key_L]: time_series_data_entry_S;
};

/**
 * Structure to hold info about a line on a time series chart
 */
export interface line_info_S {
	coin: coin_E | "ALL"; // Allow ALL which will get the aggregate of the data
	color: string;
}

/**
 * Structure to hold the configuration of a chart
 */
export interface chart_config_S {
	showAvg: boolean;
	showXAxis: boolean;
	showYAxis: boolean;
	showXTick: boolean;
	showYTick: boolean;
	showHorizontalGrid: boolean;
	showVerticalGrid: boolean;
	showAreaGradient: boolean; // Only will show is only 1 line is on the chart
	numberOfXAxisTicks: number; // Only relevent when showXAxis is true
	showCurrentValue: boolean; // The big number in the corner above the graph, if false the data selector buttons will span the entire row
	animate: boolean;
	showValueInTooltip: boolean;
}
