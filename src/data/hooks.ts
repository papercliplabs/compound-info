// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from "react";

import {
	DataResolution,
	DataType,
	MarketDataSelector,
	ProtocolDataSelector,
	TimeSelector,
	Token,
	UserType,
} from "common/enums";
import { useGlobalStore } from "data/store";

import {
	MarketSummaryData,
	MarketSummaryDataDict,
	ProtocolSummaryData,
	ProtocolHistoricalData,
	MarketHistoricalData,
	MarketHistoricalDataEntry,
	UserDominanceData,
} from "common/types";
import { requestProtocolSummaryData } from "data/requests/protocolSummaryData";
import { requestProtocolHistoricalData } from "data/requests/protocolHistoricalData";
import { requestMarketSummaryData } from "data/requests/marketSummaryData";
import { requestMarketHistoricalData } from "data/requests/marketHistoricalData";
import { DATA_BEHIND_TIME_THRESHOLD_S, TIME_SELECTOR_INFO } from "common/constants";
import { requestTransactionData } from "./requests/transactionData";
import { requestUserDominanceData } from "./requests/userDominanceData";

const protocolSummaryDataKey = "protocolSummaryData";
const protocolHistoricalDataKey = "protocolHistoricalData";
const marketSummaryDataKey = "marketSummaryData";
const marketHistoricalDataKey = "marketHistoricalData";
const transactionDataKey = "transactionData";
const userDominanceDataBaseKey = "userDominanceData";

export function useProtocolSummaryData(): ProtocolSummaryData {
	const [store, { updateStore }] = useGlobalStore();
	const data = store[protocolSummaryDataKey];

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already
			if (!data) {
				const data = await requestProtocolSummaryData();
				updateStore(protocolSummaryDataKey, data);
			}
		}

		checkForData();
	}, [data, updateStore]);

	return data;
}

/**
 * Hook to get protocol historical data, the resolution is fixed to weekly
 * @param dataSelector data type to get the data for
 * @returns protocol historical data, [{date: number, value: number}]
 */
function useProtocolHistoricalData(dataSelector: ProtocolDataSelector): ProtocolHistoricalData[] {
	const [store, { updateStore }] = useGlobalStore();
	const data = store[protocolHistoricalDataKey];

	console.log(data);

	const protocolSummaryData = useProtocolSummaryData();

	console.log(protocolSummaryData);

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already
			if (!data && protocolSummaryData) {
				const data = await requestProtocolHistoricalData();

				const now = Math.round(Date.now() / 1000); // Unix timestamp in seconds
				const lastEntey = {
					date: now,
					totalSupplyUsd: Number(protocolSummaryData.totalSupplyUsd),
					totalBorrowUsd: Number(protocolSummaryData.totalBorrowUsd),
					totalReservesUsd: Number(protocolSummaryData.totalReservesUsd),
					utilization: Number(protocolSummaryData.utilization),
				};

				data.push(lastEntey); // Tack on most recent data

				updateStore(protocolHistoricalDataKey, data);
			}
		}

		checkForData();
	}, [data, updateStore, protocolSummaryData]);

	let queriedData = [];
	if (data) {
		// Get the correct data type
		queriedData = data.map((entry) => {
			return { date: entry.date, value: entry[dataSelector] };
		});
	}

	return queriedData;
}

/**
 * Hook to get market summary data for a token, or all tokens if no underlyingToken is passed
 * @param token the underlying token of the market the summary data is wanted for
 * @returns summary data for the market with the underlyingToken or undefined if there is not data for that token
 * 			if no underlyingToken is specified, a list of all marketSummaryData is returned
 */
export function useMarketSummaryData(underlyingToken?: Token): MarketSummaryData | undefined | MarketSummaryData[] {
	const [store, { updateStore }] = useGlobalStore();
	let data = store[marketSummaryDataKey];

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already
			if (!data) {
				const allSummaryData = await requestMarketSummaryData();
				updateStore(marketSummaryDataKey, allSummaryData);
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

/**
 * Hook to get historical market data for the time and data selected
 * @param timeSelector time frame to get the data for, the resolution is derived from this
 * @param dataSelector data type to get the data for
 * @returns market historical data for the time frame (and corresponding resoltuion), and data type selected
 */
function useMarketHistoricalData(
	timeSelector: TimeSelector,
	dataSelector: MarketDataSelector
): Record<Token, number>[] {
	const [store, { updateStore }] = useGlobalStore();
	const data = store[marketHistoricalDataKey];

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already
			if (!data) {
				const data = await requestMarketHistoricalData();
				updateStore(marketHistoricalDataKey, data);
			}
		}

		checkForData();
	}, [data, updateStore]);

	let queriedData = [];
	if (data) {
		// Get the correct resolution
		const resolution = TIME_SELECTOR_INFO[timeSelector].resolution;
		queriedData = data[resolution];

		// Get the correct data type
		queriedData = queriedData.map((entry) => entry[dataSelector]);

		// Filter on time
		const days = TIME_SELECTOR_INFO[timeSelector].days;

		// undefined if ALL so don't filter if thats the case
		if (days) {
			const filterSecs = days * 24 * 60 * 60;
			const nowSec = parseInt(new Date() / 1000);
			const cutoffSecs = nowSec - filterSecs;
			queriedData = queriedData.filter((entry) => {
				return entry.date > cutoffSecs;
			});
		}
	}

	return queriedData;
}

/**
 * General hook to use market or protocol historical data bsed on the data selector type
 * @param historicalDataType type of the data selector, this determines the source to use
 * @param timeSelector time frame to get the data for, the resolution is derived from this, currently ignored if the type is protocol
 * @param dataSelector data type to get the data for, this must match the data type
 * @returns market or protocol historical data for the time frame (and corresponding resoltuion), and data type selected
 */
export function useHistoricalData(
	dataType: DataType,
	timeSelector: TimeSelector,
	dataSelector: MarketDataSelector
): Record<string, number>[] {
	const protocolHistoricalData = useProtocolHistoricalData(dataSelector);
	const marketHistoricalData = useMarketHistoricalData(timeSelector, dataSelector);

	return DataType.PROTOCOL === dataType ? protocolHistoricalData : marketHistoricalData;
}

/**
 * Hook to get transaction data
 * @param token the token market the transactiond data is wanted for
 * @param transactionType the type of transaction to filter for, all types will be returned if none is specified
 * @returns list of transactions for the specified market
 */
export function useTransactionData(token: Token, transactionType?: TransactionType): Transaction[] {
	const [store, { updateStore }] = useGlobalStore();
	const data = store[transactionDataKey];

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already
			if (!data) {
				const data = await requestTransactionData();
				updateStore(transactionDataKey, data);
			}
		}

		checkForData();
	}, [data, updateStore]);

	let queriedData = [];
	if (data) {
		// Get the correct data type
		queriedData = data.filter((transaction: Transaction) => {
			{
				const correctToken = transaction.token === token; // Filter for token
				const correctTransactionType = transactionType ? transaction.type === transactionType : true; // Filter for transaction type
				return correctToken && correctTransactionType;
			}
		});
	}

	return queriedData;
}

/**
 * Hook to get user dominance data
 * @param token the token to get the data for
 * @returns user dominance data for the token
 */
export function useUserDominanceData(token: Token): UserDominanceData {
	const [store, { updateStore }] = useGlobalStore();
	const key = userDominanceDataBaseKey + token;
	const data = store[key];

	const marketSummaryData = useMarketSummaryData(token);
	let marketTotalSupply = undefined;
	let marketTotalBorrow = undefined;

	if (marketSummaryData && !Array.isArray(marketSummaryData)) {
		marketTotalSupply = marketSummaryData.totalSupply;
		marketTotalBorrow = marketSummaryData.totalBorrow;
	}

	useEffect(() => {
		async function checkForData() {
			// Fetch the data if it hasn't been fetched already
			if (!data && marketTotalSupply !== undefined && marketTotalBorrow !== undefined) {
				const data = await requestUserDominanceData(token);

				// Compute percent dominances
				for (let i = 0; i < data[UserType.SUPPLIER].length; i++) {
					data[UserType.SUPPLIER][i].percentDominance = data[UserType.SUPPLIER][i].underlyingAmount / marketTotalSupply;
				}

				for (let i = 0; i < data[UserType.BORROWER].length; i++) {
					data[UserType.BORROWER][i].percentDominance = data[UserType.BORROWER][i].underlyingAmount / marketTotalBorrow;
				}

				updateStore(key, data);
			}
		}

		checkForData();
	}, [data, updateStore, token, marketTotalBorrow, marketTotalSupply]);

	return data ?? { [UserType.SUPPLIER]: [], [UserType.BORROWER]: [] };
}

export function useDataStatus(): { dataError: boolean; lastSyncedDate: number } {
	const [store, { _ }] = useGlobalStore();
	const marketHistoricalDataKey = "marketHistoricalData";
	const marketHistoricalData = store[marketHistoricalDataKey];
	let dataMissing = false;
	let dataBehind = false;
	let lastSyncedDate = 0;

	if (!!marketHistoricalData) {
		const weekData = marketHistoricalData[DataResolution.WEEK];
		const dayData = marketHistoricalData[DataResolution.DAY];
		const hourData = marketHistoricalData[DataResolution.HOUR];

		dataMissing = weekData.length === 0 || dayData.length === 0 || hourData.length === 0;

		const weekLatestDate = weekData.length > 0 ? weekData[weekData.length - 1].supplyApy.date : 0;
		const dayLatestDate = dayData.length > 0 ? dayData[dayData.length - 1].supplyApy.date : 0;
		const hourLatestDate = hourData.length > 0 ? hourData[hourData.length - 1].supplyApy.date : 0;

		lastSyncedDate = Math.max(weekLatestDate, dayLatestDate, hourLatestDate);

		const now = new Date() / 1000; // in sec since unix epoche
		if (DATA_BEHIND_TIME_THRESHOLD_S < now - lastSyncedDate) {
			dataBehind = true;
		}
	}

	return { dataError: dataMissing || dataBehind, lastSyncedDate: lastSyncedDate };
}

/**
 * Trigger all fetches the first time this is called
 */
export function usePrefetchData() {
	const [_, { updateStore }] = useGlobalStore();

	useEffect(() => {
		async function fetchData() {
			// Fetch the data if it hasn't been fetched already
			const protocolSummaryData = await requestProtocolSummaryData();
			updateStore(protocolSummaryDataKey, protocolSummaryData);

			const protocolHistoricalData = await requestProtocolHistoricalData();
			const now = Math.round(Date.now() / 1000); // Unix timestamp in seconds
			const lastEntey = {
				date: now,
				totalSupplyUsd: Number(protocolSummaryData.totalSupplyUsd),
				totalBorrowUsd: Number(protocolSummaryData.totalBorrowUsd),
				totalReservesUsd: Number(protocolSummaryData.totalReservesUsd),
				utilization: Number(protocolSummaryData.utilization),
			};
			protocolHistoricalData.push(lastEntey); // Tack on most recent data
			updateStore(protocolHistoricalDataKey, protocolHistoricalData);

			const marketSummaryData = await requestMarketSummaryData();
			updateStore(marketSummaryDataKey, marketSummaryData);

			const marketHistoricalData = await requestMarketHistoricalData();
			updateStore(marketHistoricalDataKey, marketHistoricalData);
		}

		fetchData();
	}, []);
}
