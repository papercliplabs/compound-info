// @ts-nocheck
import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { DataResolution } from "common/enums";

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
			utalization
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
			utalization
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
			utalization
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
 * @return the formatted query results
 */
async function performPagenationRequest(query: DocumentNode, key: string, dateGreaterThan: number): any {
	console.log("Performing request: " + key);

	const outputData = [];

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
	let utalizationEntry = {};
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
			if (historicalData[i].date !== currentDate) {
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
						utalization: utalizationEntry,
						usdcPerUnderlying: usdcPerUnderlyingEntry,
					};

					// Add full entry
					outputData.push(entry);
				}

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
				utalizationEntry = { date: currentDate };
				usdcPerUnderlyingEntry = { date: currentDate };

				// Update date
				currentDate = historicalData[i].date;
			}

			const tokenSymbol = historicalData[i].market.underlyingSymbol;

			// Load accumulators
			supplyApyEntry[tokenSymbol] = Number(historicalData[i].supplyApy).toFixed(4);
			borrowApyEntry[tokenSymbol] = Number(historicalData[i].borrowApy).toFixed(4);
			totalSupplyApyEntry[tokenSymbol] = Number(historicalData[i].totalSupplyApy).toFixed(4);
			totalBorrowApyEntry[tokenSymbol] = Number(historicalData[i].totalBorrowApy).toFixed(4);
			totalSupplyEntry[tokenSymbol] = Number(historicalData[i].totalSupply).toFixed(4);
			totalSupplyUsdEntry[tokenSymbol] = Number(historicalData[i].totalSupplyUsd).toFixed(2);
			totalBorrowEntry[tokenSymbol] = Number(historicalData[i].totalBorrow).toFixed(4);
			totalBorrowUsdEntry[tokenSymbol] = Number(historicalData[i].totalBorrowUsd).toFixed(2);
			totalReservesEntry[tokenSymbol] = Number(historicalData[i].totalReserves).toFixed(4);
			totalReservesUsdEntry[tokenSymbol] = Number(historicalData[i].totalReservesUsd).toFixed(4);
			utalizationEntry[tokenSymbol] = Number(historicalData[i].utalization).toFixed(4);
			usdcPerUnderlyingEntry[tokenSymbol] = Number(historicalData[i].usdcPerUnderlying).toFixed(2);
		}

		console.log(skip);
		// If less than 1000 results were returned we found everything
		allFound = len !== PAGE_LENGTH;
		skip += PAGE_LENGTH;
	}

	return outputData;
}

export async function requestMarketHistoricalData() {
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

// uni: markets(where: { underlyingSymbol: "UNI" }) {
// 	id
// 	historicalHourData(frist: 1000) {
// 		supplyApy
// 		totalSupplyApy
// 		totalSupply
// 		date
// 	}
// }
// dai: markets(where: { underlyingSymbol: "DAI" }) {
// 	id
// 	historicalHourData(first: 1000) {
// 		supplyApy
// 		totalSupplyApy
// 		totalSupply
// 		date
// 	}
// }
