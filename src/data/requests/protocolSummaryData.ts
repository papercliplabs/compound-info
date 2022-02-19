import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { PROTOCOL_ID } from "common/constants";
import { ProtocolSummaryData } from "common/types";

/// New
const protocolSummaryQuery = gql`
	query protocolSummaryData($id: Int!) {
		protocol(id: $id) {
			totalSupplyUsd
			totalBorrowUsd
			totalReservesUsd
			utilization
		}
	}
`;

export type ProtocolSummaryRequestResult = {
	protocol: ProtocolSummaryData;
};

export async function requestProtocolSummaryData(): Promise<ProtocolSummaryData> {
	console.log("Performing request: protocol summary data");

	const { data, loading } = await compoundInfoSubgraphClient.query<ProtocolSummaryRequestResult>({
		query: protocolSummaryQuery,
		variables: {
			id: PROTOCOL_ID,
		},
	});

	return data.protocol;
}
