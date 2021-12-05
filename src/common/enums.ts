/**
 * Underlying token symbol of each market in Compound
 */
export enum Token {
	BAT = "BAT",
	COMP = "COMP",
	DAI = "DAI",
	ETH = "ETH",
	UNI = "UNI",
	ZRX = "ZRX",
	USDC = "USDC",
	USDT = "USDT",
	WBTC = "WBTC",
	AAVE = "AAVE",
	MKR = "MKR",
	SUSHI = "SUSHI",
	TUSD = "TUSD",
	YFI = "YFI",
	LINK = "LINK",
}

/**
 * Time selector options for historical data
 */
export enum TimeSelector {
	ONE_DAY = "1D",
	ONE_WEEK = "1W",
	ONE_MONTH = "1M",
	THREE_MONTHS = "3M",
	ONE_YEAR = "1Y",
	ALL = "ALL",
}

/**
 * Resolution of time series data, this corresponds to MarketHourData, MarketDayData, and MarketWeekData respectively
 */
export enum DataResolution {
	HOUR = 0,
	DAY,
	WEEK,
}

/**
 * Available data selectors for protocol data (historical and current), values are the keys in the Graph schema
 */
export enum ProtocolDataSelector {
	TOTAL_SUPPLY_USD = "totalSupplyUsd",
	TOTAL_BORROW_USD = "totalBorrowUsd",
	TOTAL_RESERVES_USD = "totalReservesUsd",
	UTALIZATION = "utalization",
}

/**
 * Available data selectors for market data (historical and current), values are the keys in the Graph schema
 */
export enum MarketDataSelector {
	SUPPLY_APY = "supplyApy",
	BORROW_APY = "borrowApy",
	TOTAL_SUPPLY_APY = "totalSupplyApy",
	TOTAL_BORROW_APY = "totalBorrowApy",
	TOTAL_SUPPLY = "totalSupply",
	TOTAL_BORROW = "totalBorrow",
	TOTAL_RESERVES = "totalReserves",
	UTALIZATION = "utalization",
	USDC_PER_UNDERLYING = "usdcPerUnderlying",
	USDC_PER_ETH = "usdcPerEth",
}

/**
 * Units for data used within the app
 */
export enum Unit {
	PERCENT = "%",
	USD = "$",
	UNITLESS = "",
}
