import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { PROTOCOL_ID } from "common/constants";
import { ProtocolData } from "common/types";

/// New
const protocolHistoricalDataQuery = gql`
	query protocolHistoricalData($id: Int!) {
		protocol(id: $id) {
			historicalWeekData {
				totalSupplyUsd
				totalBorrowUsd
				totalReservesUsd
				utalization
			}
		}
	}
`;

export type ProtocolSummaryRequestResult = {
	protocol: {
		historicalWeekData: ProtocolData[];
	};
};

export async function requestProtocolHistoricalData(): Promise<ProtocolData[]> {
	const { data, loading } = await compoundInfoSubgraphClient.query<ProtocolSummaryRequestResult>({
		query: protocolHistoricalDataQuery,
		variables: {
			id: PROTOCOL_ID,
		},
	});

	return data.protocol.historicalWeekData;
}
