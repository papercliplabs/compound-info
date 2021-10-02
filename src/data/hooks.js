import { useState, useEffect, useRef } from "react";

import { useGlobalStore } from "data/store";
import { requestGasData, requestTimeSeriesData, requestSummaryData } from "data/requests";
import { queryTimeSeriesData, querySummaryData } from "data/queries";

// Custom hooks which are used by the app to interface with the store
const ethToUsdKey = "ethToUsd";

// dataSelectorKey is one of the keys from TIME_SERIES_DATA_SELECTORS, timeSelector is one of the time selector from TIME_SELECTORS
export function useTimeSeriesData(dataSelectorKey, timeSelector) {
	const [store, { updateStore }] = useGlobalStore();
	const [queriedData, setQueriedData] = useState(null); // Store most recent queried data to avoid updates if query doesn't change
	const timeSeriesDataKey = "timeSeriesData";
	const timeSeriesData = store[timeSeriesDataKey];

	useEffect(() => {
		async function checkForData() {
			// Fetch the time series data if it hasn't been fetched already:
			if (!timeSeriesData) {
				const data = await requestTimeSeriesData();
				updateStore(timeSeriesDataKey, data);
			}
		}

		checkForData();
	}, [timeSeriesData, updateStore]);

	useEffect(() => {
		if (timeSeriesData) {
			const newQueriedData = queryTimeSeriesData(timeSeriesData, dataSelectorKey, timeSelector);
			setQueriedData(newQueriedData);
		}
	}, [dataSelectorKey, timeSelector, timeSeriesData, setQueriedData]);

	return queriedData;
}

export function useSummaryData(coinName) {
	const [store, { updateStore }] = useGlobalStore();
	const [queriedData, setQueriedData] = useState(null); // Store most recent queried data to avoid updates if query doesn't change
	const summaryDataKey = "summaryData";
	const summaryData = store[summaryDataKey];

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already:
			if (!summaryData) {
				const [data, ethToUsd] = await requestSummaryData();
				updateStore(summaryDataKey, data);
				updateStore(ethToUsdKey, ethToUsd);
			}
		}

		checkForData();
	}, [summaryData, updateStore]);

	useEffect(() => {
		if (summaryData) {
			const newSummaryData = querySummaryData(summaryData, coinName);
			setQueriedData(newSummaryData);
		}
	}, [coinName, summaryData]);

	return queriedData;
}

export function useEthToUsd() {
	const [store, { updateStore }] = useGlobalStore();
	const ethToUsd = store[ethToUsdKey];

	return ethToUsd;
}

export function useGasData() {
	const [store, { updateStore }] = useGlobalStore();
	const key = "gasData";
	const gasData = store[key];

	useEffect(() => {
		let interval = null;
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already:
			if (!gasData) {
				const data = await requestGasData();
				updateStore(key, data);
			}
		}

		checkForData();
	}, [gasData, updateStore]);

	return gasData;
}
