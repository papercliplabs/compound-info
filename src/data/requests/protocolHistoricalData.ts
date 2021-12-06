import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { PROTOCOL_ID } from "common/constants";
import { ProtocolHistoricalData } from "common/types";

/// New
const protocolHistoricalDataQuery = gql`
	query protocolHistoricalData {
		protocolWeekDatas(first: 1000) {
			totalSupplyUsd
			totalBorrowUsd
			totalReservesUsd
			utalization
			date
		}
	}
`;

export type ProtocolSummaryRequestResult = {
	protocolWeekDatas: ProtocolHistoricalData[];
};

export async function requestProtocolHistoricalData(): Promise<ProtocolHistoricalData[]> {
	console.log("Requesting protocol historical data");

	const { data, loading } = await compoundInfoSubgraphClient.query<ProtocolSummaryRequestResult>({
		query: protocolHistoricalDataQuery,
		variables: {
			id: PROTOCOL_ID,
		},
	});

	return data.protocolWeekDatas;
}
