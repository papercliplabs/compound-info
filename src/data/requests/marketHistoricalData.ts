// @ts-nocheck
import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { DataResolution, MarketDataSelector, Token } from "common/enums";
import { MarketHistoricalDataEntry } from "common/types";

import { dummyMarketHistoricalData } from "data/requests/dummyData";
import { working } from "data/requests/test";
import { saturate } from "common/utils";

const PAGE_LENGTH = 1000; // Max of 1000

const marketHistoricalWeekQuery = gql`
	query weekQuery($skip: Int!, $pageLength: Int!, $dateGreaterThan: Int!) {
		marketWeekDatas(
			orderBy: date
			orderDirection: asc
			first: $pageLength
			skip: $skip
			where: { date_gt: $dateGreaterThan }
		) {
			id
			market {
				underlyingSymbol
				creationBlockNumber
			}
			date
			supplyApy
			borrowApy
			totalSupplyApy
			totalBorrowApy
			totalSupply
			totalSupplyUsd
			totalBorrow
			totalBorrowUsd
			totalReserves
			totalReservesUsd
			utilization
			usdcPerUnderlying
			usdcPerEth
		}
	}
`;

const marketHistoricalDayQuery = gql`
	query dayQuery($skip: Int!, $pageLength: Int!, $dateGreaterThan: Int!) {
		marketDayDatas(
			orderBy: date
			orderDirection: asc
			first: $pageLength
			skip: $skip
			where: { date_gt: $dateGreaterThan }
		) {
			id
			market {
				underlyingSymbol
				creationBlockNumber
			}
			date
			supplyApy
			borrowApy
			totalSupplyApy
			totalBorrowApy
			totalSupply
			totalSupplyUsd
			totalBorrow
			totalBorrowUsd
			totalReserves
			totalReservesUsd
			utilization
			usdcPerUnderlying
			usdcPerEth
		}
	}
`;

const marketHistoricalHourQuery = gql`
	query hourQuery($skip: Int!, $pageLength: Int!, $dateGreaterThan: Int!) {
		marketHourDatas(
			orderBy: date
			orderDirection: asc
			first: $pageLength
			skip: $skip
			where: { date_gt: $dateGreaterThan }
		) {
			id
			market {
				underlyingSymbol
				creationBlockNumber
			}
			date
			supplyApy
			borrowApy
			totalSupplyApy
			totalBorrowApy
			totalSupply
			totalSupplyUsd
			totalBorrow
			totalBorrowUsd
			totalReserves
			totalReservesUsd
			utilization
			usdcPerUnderlying
			usdcPerEth
		}
	}
`;

/**
 * Helper to perform
 * @param query the query to perform
 * @param key the key to use to get to the data (marketWeekDatas, marketDayDatas or marketHourDatas)
 * @param dateGreaterThan only take data with the date in seconds since unix epooch greater than this
 * @return the formatted query results, the last entry of the results is the most recent values
 */
async function performPagenationRequest(
	query: DocumentNode,
	key: string,
	dateGreaterThan: number
): Promise<MarketHistoricalDataEntry> {
	console.log("Performing request: " + key);

	const outputData = [];
	let currentDate = 0;
	const entry = {
		supplyApy: {},
		borrowApy: {},
		totalSupplyApy: {},
		totalBorrowApy: {},
		totalSupply: {},
		totalSupplyUsd: {},
		totalBorrow: {},
		totalBorrowUsd: {},
		totalReserves: {},
		totalReservesUsd: {},
		utilization: {},
		usdcPerUnderlying: {},
	};

	let allFound = false;
	let skip = 0;

	// Pagenation of requests
	while (!allFound) {
		const data = await compoundInfoSubgraphClient.query({
			query: query,
			variables: {
				skip: skip,
				pageLength: PAGE_LENGTH,
				dateGreaterThan: dateGreaterThan,
			},
		});

		const historicalData = data.data[key];

		const len = historicalData.length;

		for (let i = 0; i < len; i++) {
			// Finished gathering all data for that date
			if (Number(historicalData[i].date) !== currentDate) {
				// On the first run through, date will be 0, so lets not load anything
				if (currentDate != 0) {
					const entryDeepCopy = JSON.parse(JSON.stringify(entry));
					outputData.push(entryDeepCopy);
				}

				// Update date
				currentDate = Number(historicalData[i].date);
				for (const key of Object.keys(entry)) {
					entry[key]["date"] = currentDate;
				}
			}

			const tokenSymbol = historicalData[i].market.underlyingSymbol;

			// Load accumulators
			if (tokenSymbol in Token) {
				// TOOD: this type casting is inefficient
				entry.supplyApy[tokenSymbol] = Number(Number(historicalData[i].supplyApy).toFixed(4));
				entry.borrowApy[tokenSymbol] = Number(Number(historicalData[i].borrowApy).toFixed(4));
				entry.totalSupplyApy[tokenSymbol] = Number(Number(historicalData[i].totalSupplyApy).toFixed(4));
				entry.totalBorrowApy[tokenSymbol] = Number(Number(historicalData[i].totalBorrowApy).toFixed(4));
				entry.totalSupply[tokenSymbol] = Number(Number(historicalData[i].totalSupply).toFixed(4));
				entry.totalSupplyUsd[tokenSymbol] = Number(Number(historicalData[i].totalSupplyUsd).toFixed(2));
				entry.totalBorrow[tokenSymbol] = Number(Number(historicalData[i].totalBorrow).toFixed(4));
				entry.totalBorrowUsd[tokenSymbol] = Number(Number(historicalData[i].totalBorrowUsd).toFixed(2));
				entry.totalReserves[tokenSymbol] = Number(Number(historicalData[i].totalReserves).toFixed(4));
				entry.totalReservesUsd[tokenSymbol] = Number(Number(historicalData[i].totalReservesUsd).toFixed(4));
				entry.utilization[tokenSymbol] = Number(Number(historicalData[i].utilization).toFixed(4));
				entry.usdcPerUnderlying[tokenSymbol] = Number(Number(historicalData[i].usdcPerUnderlying).toFixed(2));

				// COMP and LINK both were dumb numbers on first data point, so apply saturation
				entry.totalSupplyApy[tokenSymbol] = saturate(entry.totalSupplyApy[tokenSymbol], -2, 2);
				entry.totalBorrowApy[tokenSymbol] = saturate(entry.totalBorrowApy[tokenSymbol], -2, 2);
			}
		}

		// If less than 1000 results were returned we found everything
		allFound = len !== PAGE_LENGTH;
		skip += PAGE_LENGTH;
	}

	// // Latest values
	// const nowSec = parseInt(new Date() / 1000);
	// for (const key of Object.keys(entry)) {
	// 	entry[key]["date"] = nowSec;
	// }
	// const entryDeepCopy = JSON.parse(JSON.stringify(entry));
	// outputData.push(entryDeepCopy);

	return outputData;
}

/**
 * Request for market historical data
 * @returns market historical data for each data resoltion
 * 			the values are records with token names as keys
 */
export async function requestMarketHistoricalData(): Record<keyof MarketDataSelector, MarketHistoricalDataEntry[]> {
	console.log("Performing request: historical market data");

	const now = parseInt(Date.now() / 1000); // Unix timestamp in seconds

	const dayDataGreateThanDate = now - 90 * 24 * 60 * 60; // Last 90 days
	const hourDataGreaterThanDate = now - 7 * 24 * 60 * 60; // Last 7 days

	const weekData = await performPagenationRequest(marketHistoricalWeekQuery, "marketWeekDatas", 0);
	const dayData = await performPagenationRequest(marketHistoricalDayQuery, "marketDayDatas", dayDataGreateThanDate);
	const hourData = await performPagenationRequest(
		marketHistoricalHourQuery,
		"marketHourDatas",
		hourDataGreaterThanDate
	);

	// Add on the last entry in hour data to week and day data so the last point is the most recent
	if (hourData.length > 0) {
		const lastEntry = JSON.parse(JSON.stringify(weekData.slice(-1)[0]));
		const lastDayDataEntry = JSON.parse(JSON.stringify(dayData.slice(-1)[0]));
		const lastHourDataEntry = JSON.parse(JSON.stringify(hourData.slice(-1)[0]));

		// Update with newest day data
		for (const subEntry of Object.keys(lastDayDataEntry)) {
			for (const subSubEntry of Object.keys(lastDayDataEntry[subEntry])) {
				lastEntry[subEntry][subSubEntry] = lastDayDataEntry[subEntry][subSubEntry];
			}
		}

		// Update with newest hour data
		for (const subEntry of Object.keys(lastHourDataEntry)) {
			for (const subSubEntry of Object.keys(lastHourDataEntry[subEntry])) {
				lastEntry[subEntry][subSubEntry] = lastHourDataEntry[subEntry][subSubEntry];
			}
		}

		weekData.push(lastEntry);
		dayData.push(lastEntry);
		hourData.push(lastEntry);
	}

	// Remove the first point from each as comp speeds is weird here
	weekData.shift();

	// console.log("WEEK");
	// console.log(weekData);
	// console.log("DAY");
	// console.log(dayData);
	// console.log("HOUR");
	// console.log(hourData);

	return {
		[DataResolution.WEEK]: weekData,
		[DataResolution.DAY]: dayData,
		[DataResolution.HOUR]: hourData,
	};
}
