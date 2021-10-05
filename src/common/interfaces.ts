import { coin_name_L, time_series_data_selector_key_L } from "common/enums";

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
	availableLiquidity: number;
	borrowApy: number;
	borrowCap: number;
	cTokenAddress: string;
	collateralFactor: number;
	distributionBorrowApy: number;
	distributionSupplyApy: number;
	marketSize: number;
	maxBorrow: number;
	numberOfBorrowers: number;
	numberOfSuppliers: number;
	reserveFactor: number;
	supplyApy: number;
	totalBorrow: number;
	totalBorrowApy: number;
	totalReserves: number;
	totalSupply: number;
	totalSupplyApy: number;
	totalValueLocked: number;
	underlyingPrice: number;
	utilization: number;
}

/**
 * Strucutre which holds summary data for the entire protocol
 */
export interface protocol_summary_data_S {
	maxBorrow: number;
	numberOfUniqueBorrowers: number;
	numberOfUniqueSuppliers: number;
	totalBorrow: number;
	totalReserves: number;
	totalSupply: number;
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
}

/**
 * Structure to hold time series data
 */
export type time_series_data_S = {
	[key in time_series_data_selector_key_L]: {
		[key in coin_name_L]: number | null;
	} & {
		blockTime: Date;
	};
};
