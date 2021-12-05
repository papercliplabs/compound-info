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
 * Holds metadata for market or protocol data selectors
 */
export interface DataSelectorInfo {
	key: string;
	name: string;
	description: string;
	unit: Unit;
}

/**
 * List of protocol data selector info, one for each data selector
 */
export type ProtocolDataSelectorInfoList = {
	[selector in ProtocolDataSelector]: DataSelectorInfo;
};

/**
 * List of market data selector info, one for each data selector
 */
export type MarketDataSelectorInfoList = {
	[selector in MarketDataSelector]: DataSelectorInfo;
};

/**
 * Format of protocol data
 */
export type ProtocolData = {
	[selector in ProtocolDataSelector]: number;
};

/**
 * Format of market data from the subgraph
 */
export type MarketData = {
	[selector in MarketDataSelector]: number;
};

/**
 * Format of market summary data from the subgraph
 */
export interface MarketSummaryData extends MarketData {
	creationBlockNumber: number;
	cTokenSymbol: string;
	underlyingName: string;
	underlyingAddress: string;
	collatoralFactor: number;
	reserveFactor: number;
	cash: number;
	usdcPerUnderlying: number;
	usdcPerEth: number;
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
	token: Token | "ALL"; // Allow ALL which will get the aggregate of the data
	color: string;
}
