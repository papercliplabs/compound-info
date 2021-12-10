import { Token, TimeSelector, MarketDataSelector, ProtocolDataSelector, Unit, DataResolution } from "common/enums";

/**
 * Holds metadata information about a token
 */
export interface TokenInfo {
	readonly symbol: string;
	readonly imgSrc: string;
	readonly desc: string;
	readonly whitepaper: string;
	readonly website: string;
	readonly twitter: string;
	readonly coinGecko: string;
}

/**
 * List of all token info, one entry of the underlying token for each market
 */
export type TokenInfoList = {
	[token in Token]: TokenInfo;
};

/**
 * Mapping of time selector onto the number of days
 */
export interface TimeSelectorInfo {
	readonly name: TimeSelector;
	readonly days: number | undefined; // undefined for inifinite number of days
	readonly resolution: DataResolution;
}

/**
 * List of time selector info, one for each TimeSelector
 */
export type TimeSelectorInfoList = {
	[selector in TimeSelector]: TimeSelectorInfo;
};

/**
 * Format of protocol data
 */
export type ProtocolSummaryData = {
	[selector in ProtocolDataSelector]: string;
};

/**
 * Format of historical protocol data
 */
export interface ProtocolHistoricalData extends ProtocolSummaryData {
	date: number;
}

/**
 * Holds metadata for protocol data selectors
 */
export interface ProtocolDataSelectorInfo {
	key: keyof ProtocolSummaryData;
	name: string;
	description: string;
	unit: Unit;
}

/**
 * List of protocol data selector info, one for each data selector
 */
export type ProtocolDataSelectorInfoList = {
	[selector in ProtocolDataSelector]: ProtocolDataSelectorInfo;
};

/**
 * Format of shared market data from the subgraph
 */
type MarketCoreData = {
	[selector in MarketDataSelector]: string;
};

/**
 * Format of market summary data from the subgraph
 */
export interface MarketSummaryData extends MarketCoreData {
	id: string; // cToken address
	underlyingSymbol: string;
	creationBlockNumber: string;
	cTokenSymbol: string;
	underlyingName: string;
	underlyingAddress: string;
	collateralFactor: string;
	reserveFactor: string;
	cash: string;
	usdcPerUnderlying: string;
	usdcPerEth: string;
}
// TODO: change all numbers from the graph to strings!

/**
 * Format of historical market data
 */
export interface MarketHistoricalData extends MarketCoreData {
	date: string;
}

/**
 * Holds metadata for market data selectors
 */
export interface MarketDataSelectorInfo {
	key: keyof MarketCoreData;
	name: string;
	description: string;
	unit: Unit;
}

/**
 * List of market data selector info, one for each data selector
 */
export type MarketDataSelectorInfoList = {
	[selector in MarketDataSelector]: MarketDataSelectorInfo;
};

/**
 * Holds metadata for market summary data selectors
 */
export interface MarketSummaryDataSelectorInfo {
	key: keyof MarketSummaryData;
	name: string;
	description: string;
	unit: Unit;
}

/**
 * Chart configuration
 */
export interface ChartConfig {
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

/**
 * Line info for lines on time series charts
 */
export interface LineInfo {
	key: string;
	color: string;
}

/**
 * All possible data selectors for time series
 */
export type DataSelector = ProtocolDataSelector | MarketDataSelector;

/**
 * Data entry for market historical data
 */
export type MarketHistoricalDataEntry = {
	[selector in MarketDataSelector]: Record<Token, number>;
};
