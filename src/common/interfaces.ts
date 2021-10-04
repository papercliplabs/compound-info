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
 * key: key of the data in a dictionary
 * name: name of the thing corresponding to the key, generally this is what is displayed on the front end
 * unit: if the type of data has a unit
 */
export interface market_summary_column_info_S {
	key: keyof market_summary_data_S;
	name: string;
	unit?: string;
}
