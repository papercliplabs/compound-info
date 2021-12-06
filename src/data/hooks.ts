// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from "react";

import { useGlobalStore } from "data/store";
import { requestGasData, requestTimeSeriesData, requestSummaryData, requestTestData } from "data/requests";
import { queryTimeSeriesData, querySummaryData } from "data/queries";

import { MarketSummaryData, MarketSummaryDataDict, ProtocolSummaryData, ProtocolHistoricalData } from "common/types";
import { requestProtocolSummaryData } from "data/requests/protocolSummaryData";
import { requestProtocolHistoricalData } from "data/requests/protocolHistoricalData";
import { requestMarketSummaryData } from "data/requests/marketSummaryData";

// Custom hooks which are used by the app to interface with the store

/**
 * Hook to get time series data for the specified data and time selector
 * @param dataSelector data selector to get the data for
 * @param timeSelector time selector to get the data for
 * @returns time series data for the specified data and time selector, or null if none is available
 */
// export function useTimeSeriesData(
// 	dataSelector: time_series_data_selector_E,
// 	timeSelector: time_selector_E
// ): timer_series_data_S[] | null {
// 	const [store, { updateStore }] = useGlobalStore();
// 	const [queriedData, setQueriedData] = useState(null); // Store most recent queried data to avoid updates if query doesn't change
// 	const timeSeriesDataKey = "timeSeriesData";
// 	const timeSeriesData = store[timeSeriesDataKey];

// 	useEffect(() => {
// 		async function checkForData() {
// 			// Fetch the time series data if it hasn't been fetched already:
// 			if (!timeSeriesData) {
// 				const data = await requestTimeSeriesData();
// 				updateStore(timeSeriesDataKey, data);
// 			}
// 		}

// 		checkForData();
// 	}, [timeSeriesData, updateStore]);

// 	useEffect(() => {
// 		if (timeSeriesData) {
// 			const newQueriedData = queryTimeSeriesData(timeSeriesData, dataSelector, timeSelector);
// 			setQueriedData(newQueriedData);
// 		}
// 	}, [dataSelector, timeSelector, timeSeriesData, setQueriedData]);

// 	return queriedData;
// }

/**
 * Hook to get market summary data about a coin(s)
 * @param coin the coin the summary data is wanted for, if not provided a list of all the summary data will be returned
 * @returns summary data for the specified coin if the data exists for it, otherwise null, or a list of all summary data is no coin is specified
 */
// export function useMarketSummaryData(coin?: coin_E): market_summary_data_S | market_summary_data_S[] | null {
// 	const [store, { updateStore }] = useGlobalStore();
// 	const [queriedData, setQueriedData] = useState(null); // Store most recent queried data to avoid updates if query doesn't change
// 	const marketSummaryDataList = store[marketSummaryDataKey];

// 	useEffect(() => {
// 		async function checkForData() {
// 			// Fetch the data if it hasn't been fetched already:
// 			if (!marketSummaryDataList) {
// 				const response = await requestSummaryData();

// 				// Store all the data returned by the request
// 				if (response) {
// 					updateStore(marketSummaryDataKey, response[0]);
// 					updateStore(protocolSummaryDataKey, response[1]);
// 					updateStore(ethToUsdKey, response[2]);
// 				} else {
// 					updateStore(marketSummaryDataKey, null);
// 					updateStore(protocolSummaryDataKey, null);
// 					updateStore(ethToUsdKey, null);
// 				}
// 			}
// 		}

// 		checkForData();
// 	}, [marketSummaryDataList, updateStore]);

// 	useEffect(() => {
// 		if (marketSummaryDataList) {
// 			let queriedData = marketSummaryDataList;
// 			if (coin !== null && coin !== undefined) {
// 				queriedData = querySummaryData(queriedData, coin);
// 			}
// 			setQueriedData(queriedData);
// 		}
// 	}, [coin, marketSummaryDataList]);

// 	return queriedData;
// }

/**
 * Hook to get protocol summary data
 * @returns protocol summary data, or null if it is not available
 */
// export function useProtocolSummaryData(): protocol_summary_data_S | null {
// 	// const [store, { updateStore }] = useGlobalStore();
// 	// const protocolSummaryData = store[protocolSummaryDataKey];

// 	// useEffect(() => {
// 	// 	async function checkForData() {
// 	// 		// Fetch the data if it hasn't been fetched already:
// 	// 		if (!protocolSummaryData) {
// 	// 			const response = await requestSummaryData();

// 	// 			// Store all the data returned by the request
// 	// 			if (response) {
// 	// 				updateStore(marketSummaryDataKey, response[0]);
// 	// 				updateStore(protocolSummaryDataKey, response[1]);
// 	// 				updateStore(ethToUsdKey, response[2]);
// 	// 			} else {
// 	// 				updateStore(marketSummaryDataKey, null);
// 	// 				updateStore(protocolSummaryDataKey, null);
// 	// 				updateStore(ethToUsdKey, null);
// 	// 			}
// 	// 		}
// 	// 	}

// 	// 	checkForData();
// 	// }, [protocolSummaryData, updateStore]);

// 	return protocolSummaryData;
// }

// export function useProtocolSummaryData():

/**
 * Hook to get the eth to usd conversion
 * @returns eth to usd converion, or null if unavailable
 */
// export function useEthToUsd(): number | null {
// 	const [store, { updateStore }] = useGlobalStore();
// 	const ethToUsd = store[ethToUsdKey];

// 	useEffect(() => {
// 		async function checkForData() {
// 			// Fetch the data if it hasn't been fetched already:
// 			if (!ethToUsd) {
// 				const response = await requestSummaryData();

// 				// Store all the data returned by the request
// 				if (response) {
// 					updateStore(marketSummaryDataKey, response[0]);
// 					updateStore(protocolSummaryDataKey, response[1]);
// 					updateStore(ethToUsdKey, response[2]);
// 				} else {
// 					updateStore(marketSummaryDataKey, null);
// 					updateStore(protocolSummaryDataKey, null);
// 					updateStore(ethToUsdKey, null);
// 				}
// 			}
// 		}

// 		checkForData();
// 	}, [ethToUsd, updateStore]);

// 	return ethToUsd;
// }

// export function useGasData() {
// 	const [store, { updateStore }] = useGlobalStore();
// 	const key = "gasData";
// 	const gasData = store[key];

// 	useEffect(() => {
// 		async function checkForData() {
// 			// Fetch the data if it hasn't been fetched already:
// 			if (!gasData) {
// 				const data = await requestGasData();
// 				updateStore(key, data);
// 			}
// 		}

// 		checkForData();
// 	}, [gasData, updateStore]);

// 	return gasData;
// }

// export function useTestData(): any {
// 	const [store, { updateStore }] = useGlobalStore();
// 	const testDataKey = "testKey";
// 	const testData = store[testDataKey];

// 	useEffect(() => {
// 		async function checkForData() {
// 			// Fetch the time series data if it hasn't been fetched already:
// 			if (!testData) {
// 				const data = await requestTestData();
// 				console.log(data);
// 				updateStore(testDataKey, data);
// 			}
// 		}

// 		checkForData();
// 	}, [testData, updateStore]);
// 	return testData;
// }

export function useProtocolSummaryData(): ProtocolSummaryData {
	const [store, { updateStore }] = useGlobalStore();
	const key = "protocolSummaryData";
	const data = store[key];

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already
			if (!data) {
				const data = await requestProtocolSummaryData();
				console.log(data);
				updateStore(key, data);
			}
		}

		checkForData();
	}, [data, updateStore]);

	return data;
}

export function useProtocolHistoricalData(): ProtocolHistoricalData[] {
	const [store, { updateStore }] = useGlobalStore();
	const key = "protocolHistoricalData";
	const data = store[key];

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already
			if (!data) {
				const data = await requestProtocolHistoricalData();
				console.log(data);
				updateStore(key, data);
			}
		}

		checkForData();
	}, [data, updateStore]);

	return data;
}

/**
 * Hook to get market summary data for a token, or all tokens if no underlyingToken is passed
 * @param token the underlying token of the market the summary data is wanted for
 * @returns summary data for the market with the underlyingToken or undefined if there is not data for that token
 * 			if no underlyingToken is specified, a list of all marketSummaryData is returned
 */
export function useMarketSummaryData(underlyingToken?: Token): MarketSummaryData | undefined | MarketSummaryData[] {
	const [store, { updateStore }] = useGlobalStore();
	const key = "marketSummaryData";
	let data = store[key];

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already
			if (!data) {
				const allSummaryData = await requestMarketSummaryData();
				updateStore(key, allSummaryData);
			}
		}

		checkForData();
	}, [data, updateStore]);

	if (data && !!underlyingToken) {
		data = data.filter((entry) => entry.underlyingSymbol == underlyingToken);
		if (data.length === 0) {
			return undefined;
		} else {
			return data[0];
		}
	}

	return data;
}
