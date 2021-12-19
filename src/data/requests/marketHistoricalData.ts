// @ts-nocheck
import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { DataResolution, MarketDataSelector, Token } from "common/enums";
import { MarketHistoricalDataEntry } from "common/types";

import { dummyMarketHistoricalData } from "data/requests/dummyData";
import { working } from "data/requests/test";

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

	// Latest values, this is used to stick onto the end of hour data
	const nowSec = parseInt(new Date() / 1000);
	const supplyApyLatestEntry = { date: nowSec };
	const borrowApyLatestEntry = { date: nowSec };
	const totalSupplyApyLatestEntry = { date: nowSec };
	const totalBorrowApyLatestEntry = { date: nowSec };
	const totalSupplyLatestEntry = { date: nowSec };
	const totalSupplyUsdLatestEntry = { date: nowSec };
	const totalBorrowLatestEntry = { date: nowSec };
	const totalBorrowUsdLatestEntry = { date: nowSec };
	const totalReservesLatestEntry = { date: nowSec };
	const totalReservesUsdLatestEntry = { date: nowSec };
	const utilizationLatestEntry = { date: nowSec };
	const usdcPerUnderlyingLatestEntry = { date: nowSec };

	// Accumulators
	let supplyApyEntry = {};
	let borrowApyEntry = {};
	let totalSupplyApyEntry = {};
	let totalBorrowApyEntry = {};
	let totalSupplyEntry = {};
	let totalSupplyUsdEntry = {};
	let totalBorrowEntry = {};
	let totalBorrowUsdEntry = {};
	let totalReservesEntry = {};
	let totalReservesUsdEntry = {};
	let utilizationEntry = {};
	let usdcPerUnderlyingEntry = {};

	let allFound = false;
	let skip = 0;

	let currentDate = 0;

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
				// On the first run through, currentDate will be 0, so lets not load anything
				if (currentDate != 0) {
					// Load accumulated values
					const entry = {
						supplyApy: supplyApyEntry,
						borrowApy: borrowApyEntry,
						totalSupplyApy: totalSupplyApyEntry,
						totalBorrowApy: totalBorrowApyEntry,
						totalSupply: totalSupplyEntry,
						totalSupplyUsd: totalSupplyUsdEntry,
						totalBorrow: totalBorrowEntry,
						totalBorrowUsd: totalBorrowUsdEntry,
						totalReserves: totalReservesEntry,
						totalReservesUsd: totalReservesUsdEntry,
						utilization: utilizationEntry,
						usdcPerUnderlying: usdcPerUnderlyingEntry,
					};

					// Add full entry
					outputData.push(entry);
				}

				// Update date
				currentDate = Number(historicalData[i].date);

				// Reset accumulators
				supplyApyEntry = { date: currentDate };
				borrowApyEntry = { date: currentDate };
				totalSupplyApyEntry = { date: currentDate };
				totalBorrowApyEntry = { date: currentDate };
				totalSupplyEntry = { date: currentDate };
				totalSupplyUsdEntry = { date: currentDate };
				totalBorrowEntry = { date: currentDate };
				totalBorrowUsdEntry = { date: currentDate };
				totalReservesEntry = { date: currentDate };
				totalReservesUsdEntry = { date: currentDate };
				utilizationEntry = { date: currentDate };
				usdcPerUnderlyingEntry = { date: currentDate };
			}

			const tokenSymbol = historicalData[i].market.underlyingSymbol;

			// Load accumulators
			if (tokenSymbol in Token) {
				// TOOD: this type casting is inefficient
				supplyApyEntry[tokenSymbol] = Number(Number(historicalData[i].supplyApy).toFixed(4));
				borrowApyEntry[tokenSymbol] = Number(Number(historicalData[i].borrowApy).toFixed(4));
				totalSupplyApyEntry[tokenSymbol] = Number(Number(historicalData[i].totalSupplyApy).toFixed(4));
				totalBorrowApyEntry[tokenSymbol] = Number(Number(historicalData[i].totalBorrowApy).toFixed(4));
				totalSupplyEntry[tokenSymbol] = Number(Number(historicalData[i].totalSupply).toFixed(4));
				totalSupplyUsdEntry[tokenSymbol] = Number(Number(historicalData[i].totalSupplyUsd).toFixed(2));
				totalBorrowEntry[tokenSymbol] = Number(Number(historicalData[i].totalBorrow).toFixed(4));
				totalBorrowUsdEntry[tokenSymbol] = Number(Number(historicalData[i].totalBorrowUsd).toFixed(2));
				totalReservesEntry[tokenSymbol] = Number(Number(historicalData[i].totalReserves).toFixed(4));
				totalReservesUsdEntry[tokenSymbol] = Number(Number(historicalData[i].totalReservesUsd).toFixed(4));
				utilizationEntry[tokenSymbol] = Number(Number(historicalData[i].utilization).toFixed(4));
				usdcPerUnderlyingEntry[tokenSymbol] = Number(Number(historicalData[i].usdcPerUnderlying).toFixed(2));

				// Update the latest values for this symbol
				supplyApyLatestEntry[tokenSymbol] = supplyApyEntry[tokenSymbol];
				borrowApyLatestEntry[tokenSymbol] = borrowApyEntry[tokenSymbol];
				totalSupplyApyLatestEntry[tokenSymbol] = totalSupplyApyEntry[tokenSymbol];
				totalBorrowApyLatestEntry[tokenSymbol] = totalBorrowApyEntry[tokenSymbol];
				totalSupplyLatestEntry[tokenSymbol] = totalSupplyEntry[tokenSymbol];
				totalSupplyUsdLatestEntry[tokenSymbol] = totalSupplyUsdEntry[tokenSymbol];
				totalBorrowLatestEntry[tokenSymbol] = totalBorrowEntry[tokenSymbol];
				totalBorrowUsdLatestEntry[tokenSymbol] = totalReservesUsdEntry[tokenSymbol];
				totalReservesLatestEntry[tokenSymbol] = totalReservesEntry[tokenSymbol];
				totalReservesUsdLatestEntry[tokenSymbol] = totalReservesUsdEntry[tokenSymbol];
				utilizationLatestEntry[tokenSymbol] = utilizationEntry[tokenSymbol];
				usdcPerUnderlyingLatestEntry[tokenSymbol] = usdcPerUnderlyingEntry[tokenSymbol];
			}
		}

		// If less than 1000 results were returned we found everything
		allFound = len !== PAGE_LENGTH;
		skip += PAGE_LENGTH;
	}

	const finalEntry = {
		supplyApy: supplyApyLatestEntry,
		borrowApy: borrowApyLatestEntry,
		totalSupplyApy: totalSupplyApyLatestEntry,
		totalBorrowApy: totalBorrowApyLatestEntry,
		totalSupply: totalSupplyLatestEntry,
		totalSupplyUsd: totalSupplyUsdLatestEntry,
		totalBorrow: totalBorrowLatestEntry,
		totalBorrowUsd: totalBorrowUsdLatestEntry,
		totalReserves: totalReservesLatestEntry,
		totalReservesUsd: totalReservesUsdLatestEntry,
		utilization: utilizationLatestEntry,
		usdcPerUnderlying: usdcPerUnderlyingLatestEntry,
	};

	if (key === "marketHourDatas" && outputData.length > 0) {
		outputData.push(finalEntry);
	}

	return outputData;
}

/**
 * Request for market historical data
 * @returns market historical data for each data resoltion
 * 			the values are records with token names as keys
 */
export async function requestMarketHistoricalData(): Record<keyof MarketDataSelector, MarketHistoricalDataEntry[]> {
	console.log("Requesting historical market data");

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
		weekData.push(hourData.slice(-1)[0]);
		dayData.push(hourData.slice(-1)[0]);
	}

	console.log("WEEK");
	console.log(weekData);
	console.log("DAY");
	console.log(dayData);
	console.log("HOUR");
	console.log(hourData);

	return {
		[DataResolution.WEEK]: weekData,
		[DataResolution.DAY]: dayData,
		[DataResolution.HOUR]: hourData,
	};
}
