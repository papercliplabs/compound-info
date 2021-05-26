import { SHORT_TERM_DAYS } from 'constants/index';

//// Queries used by hooks to return useful data from the store (reducers)

export function queryApyData(rawData, dataSelectorKey, timeSelector) {
	if (!rawData) return null;

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

	return data;
}

// coinName: name of underlying asset (ex: USDC), coinName = ALL returns protocol summary data
export function querySummaryData(summaryData, coinName) {
	let data = summaryData;
	if (coinName) {
		data = summaryData.filter((obj) => obj.name === coinName)[0];
	}

	return data;
}
