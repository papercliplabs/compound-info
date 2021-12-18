// @ts-nocheck
import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { PROTOCOL_ID } from "common/constants";
import { ProtocolHistoricalData } from "common/types";

const PAGE_LENGTH = 1000; // Max of 1000

/// New
const protocolHistoricalDataQuery = gql`
	query protocolHistoricalData($skip: Int!, $pageLength: Int!, $dateGreaterThan: Int!) {
		protocolWeekDatas(
			orderBy: date
			orderDirection: asc
			first: $pageLength
			skip: $skip
			where: { date_gt: $dateGreaterThan }
		) {
			totalSupplyUsd
			totalBorrowUsd
			totalReservesUsd
			utalization
			date
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
async function performPagenationRequest(query: DocumentNode, key: string, dateGreaterThan: number): any {
	const outputData = [];

	let allFound = false;
	let skip = 0;

	// Pagenation of requests
	while (!allFound) {
		const data = await compoundInfoSubgraphClient.query({
			query: query,
			variables: {
				id: PROTOCOL_ID,
				skip: skip,
				pageLength: PAGE_LENGTH,
				dateGreaterThan: dateGreaterThan,
			},
		});

		const historicalData = data.data[key];

		const len = historicalData.length;

		for (let i = 0; i < len; i++) {
			const entry = {
				date: Number(historicalData[i].date),
				totalSupplyUsd: Number(Number(historicalData[i].totalSupplyUsd).toFixed(2)),
				totalBorrowUsd: Number(Number(historicalData[i].totalBorrowUsd).toFixed(2)),
				totalReservesUsd: Number(Number(historicalData[i].totalReservesUsd).toFixed(4)),
				utalization: Number(Number(historicalData[i].utalization).toFixed(4)),
			};

			outputData.push(entry);
		}

		// If less than 1000 results were returned we found everything
		allFound = len !== PAGE_LENGTH;
		skip += PAGE_LENGTH;
	}

	return outputData;
}

export type ProtocolSummaryRequestResult = {
	protocolWeekDatas: ProtocolHistoricalData[];
};

export async function requestProtocolHistoricalData(): Promise<ProtocolHistoricalData[]> {
	console.log("Requesting protocol historical data");

	const weekData = await performPagenationRequest(protocolHistoricalDataQuery, "protocolWeekDatas", 0);

	return weekData;
}
