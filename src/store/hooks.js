import { useState, useEffect, useRef } from 'react';
import { useGlobalStore } from './index';
import { requestGasData, requestApyData, requestSummaryData } from './requests';
import { queryApyData, querySummaryData } from './queries';

// Custom hooks which are used by the app to interface with the store
const retryTime = 2000; // Retry in 1000ms if there was an error
const ethToUsdKey = 'ethToUsd';

export function useApyData(dataSelectorKey, timeSelector, includeComp = false) {
	const [store, { updateStore }] = useGlobalStore();
	const [queriedData, setQueriedData] = useState(null); // Store most recent queried data to avoid updates if query doesn't change
	const key = 'apyData';
	const apyData = store[key];

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already:
			if (!apyData) {
				const data = await requestApyData();
				updateStore(key, data);
			}
		}

		checkForData();
	}, [apyData, updateStore]);

	let selectorKey = dataSelectorKey;
	if (includeComp) {
		if (selectorKey === 'borrow') {
			selectorKey = 'totalBorrow';
		} else if (selectorKey === 'supply') {
			selectorKey = 'totalSupply';
		}
	}

	useEffect(() => {
		if (apyData) {
			const newQueriedData = queryApyData(apyData, selectorKey, timeSelector);
			setQueriedData(newQueriedData);
		}
	}, [selectorKey, timeSelector, apyData, setQueriedData, includeComp]);

	return queriedData;
}

export function useSummaryData(coinName) {
	const [store, { updateStore }] = useGlobalStore();
	const [queriedData, setQueriedData] = useState(null); // Store most recent queried data to avoid updates if query doesn't change
	const summaryDataKey = 'summaryData';
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
	const key = 'gasData';
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
