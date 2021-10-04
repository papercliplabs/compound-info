// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { SHORT_TERM_DAYS, COIN_INFO } from "common/constants";

import { market_summary_data_S } from "common/interfaces";
import { coin_E } from "common/enums";

//// Queries used by hooks to return useful data from the store (reducers)

// dataSelectorKey is one of the keys from TIME_SERIES_DATA_SELECTORS
export function queryTimeSeriesData(rawData, dataSelectorKey, timeSelector) {
	if (!rawData) return null;

	console.log(rawData);

	// Grab short term, or long term and create a copy
	let data;
	if (timeSelector.days !== null && timeSelector.days <= SHORT_TERM_DAYS) {
		data = rawData.shortTerm.slice();
	} else {
		data = rawData.longTerm.slice();
	}

	let startTime = new Date();
	if (timeSelector.days === null) {
		startTime = new Date(1700, 1, 1); // smallest date
	} else {
		startTime.setDate(startTime.getDate() - timeSelector.days);
	}

	// Filter on dataSelector
	data = data.map((entry) => {
		return Object.assign(entry.values[dataSelectorKey], { blockTime: entry.blockTime });
	});

	// Filter on timeSelector
	data = data.filter((entry) => {
		const blockStartTime = new Date(entry.blockTime);
		return blockStartTime >= startTime;
	});

	if (data && data.length > 0) {
		return data;
	} else {
		return null;
	}
}

/**
 * Query the list of summary data for the data of the specified coin
 * @param summaryDataList list of all the summary data to be queried
 * @param coin coin that you want to extract the data for
 * @returns summary data for the specific coin, or null if there is none available
 */
export function querySummaryData(summaryDataList: market_summary_data_S[], coin: coin_E): market_summary_data_S | null {
	let queriedData = summaryDataList.filter((data) => data.name === COIN_INFO[coin].name);
	queriedData = queriedData.length === 1 ? queriedData[0] : null;

	return queriedData;
}
