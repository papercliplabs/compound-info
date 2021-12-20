// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { SHORT_TERM_DAYS, COIN_INFO } from "common/constants";

import { market_summary_data_S, time_series_data_S } from "common/interfaces";
import { coin_E, time_selector_E, time_series_data_selector_E } from "common/enums";
import { TIME_SELECTOR_INFO, TIME_SERIES_DATA_SELECTOR_INFO } from "../common/constants";

//// Queries used by hooks to return useful data from the store (reducers)

// dataSelectorKey is one of the keys from TIME_SERIES_DATA_SELECTORS
/**
 * Query time series data for the specified data and time selectors
 * @param timeSeriesData the time series data to be queried, this should be the data returned from the request (i.e unqueried full data)
 * @param dataSelector data selector to query on
 * @param timeSelector time selector to query on
 * @returns queried time series data, or null if there is none
 */
export function queryTimeSeriesData(
	timeSeriesData: time_series_data_S[],
	dataSelector: time_series_data_selector_E,
	timeSelector: time_selector_E
): time_series_data_S[] | null {
	const timeSelectorInfo = TIME_SELECTOR_INFO[timeSelector];
	const dataSelectorInfo = TIME_SERIES_DATA_SELECTOR_INFO[dataSelector];

	// Grab short term, or long term and create a copy
	let data;
	if (timeSelectorInfo.days !== null && timeSelectorInfo.days <= SHORT_TERM_DAYS) {
		data = timeSeriesData.shortTerm.slice();
	} else {
		data = timeSeriesData.longTerm.slice();
	}

	let startTime = new Date();
	if (timeSelectorInfo.days === null) {
		startTime = new Date(1700, 1, 1); // smallest date
	} else {
		startTime.setDate(startTime.getDate() - timeSelectorInfo.days);
	}

	// Filter on dataSelector
	data = data.map((entry) => entry[dataSelectorInfo.key]);

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
