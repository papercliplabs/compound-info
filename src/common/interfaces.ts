import { coin_E } from "common/enums";

/**
 * Structure which holds information about a coin
 */
export interface coin_info_S {
	name: string;
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
 * Structure which holds data entries for time series data
 */
export interface time_series_data_entry_S {
	borrowUsd: number | null;
	borrowApy: number | null;
	supplyUsd: number | null;
	supplyApy: number | null;
	totalBorrowApy: number | null;
	totalSupplyApy: number | null;
	utalization: number | null;
}

/**
 * Structure object with keys that are coins, and values which are arrays of time series data entries
 */
export type time_series_data_S = {
	[key in keyof typeof coin_E]: time_series_data_entry_S[];
};

/**
 * Structure which holds data about a time series data selector
 * key: key of the data in the time_series_data
 * name: name of the thing corresponding to the key, generally this is what is displayed on the front end
 */
export interface time_series_data_selector_info_S {
	// key: keyof time_series_data_S;
	key: string;
	name: string;
}
