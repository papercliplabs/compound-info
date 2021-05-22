import { useState, useEffect } from 'react'
import { useGlobalStore } from './index'
import { requestApyData, requestSummaryData } from './requests'
import { queryApyData, querySummaryData } from './queries'

// Custom hooks which are used by the app to interface with the store

export function useApyData(dataSelector, timeSelector) {
	const [store, { updateStore }] = useGlobalStore();
	const [queriedData, setQueriedData] = useState(null); // Store most recent queried data to avoid updates if query doesn't change
	const key = 'apyData';
	const apyData = store[key];

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already:
			if(!apyData) {
				const data = await requestApyData();
				updateStore(key, data);
			}
		}

		checkForData();
	}, [apyData, updateStore]);

	useEffect(() => {
		if(apyData) {
			const newQueriedData = queryApyData(apyData, dataSelector, timeSelector);
			setQueriedData(newQueriedData);
		}
	}, [dataSelector, timeSelector, apyData, setQueriedData]);

	return queriedData;
}


export function useSummaryData(coinName) {
	const [store, { updateStore }] = useGlobalStore();
	const [queriedData, setQueriedData] = useState(null); // Store most recent queried data to avoid updates if query doesn't change
	const key = 'summaryData';
	const summaryData = store[key];

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already:
			if(!summaryData) {
				const data = await requestSummaryData();
				updateStore(key, data);
			}
		}

		checkForData();
	}, [summaryData, updateStore]);

	useEffect(() => {
		if(summaryData) {
			const newSummaryData = querySummaryData(summaryData, coinName);
			setQueriedData(newSummaryData);
		}
	}, [coinName, summaryData]);

	return queriedData;
}
