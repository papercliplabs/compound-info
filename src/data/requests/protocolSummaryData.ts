import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { PROTOCOL_ID } from "common/constants";
import { ProtocolData } from "common/types";

/// New
const protocolSummaryQuery = gql`
	query protocolSummaryData($id: Int!) {
		protocol(id: $id) {
			totalSupplyUsd
			totalBorrowUsd
			totalReservesUsd
			utalization
		}
	}
`;

export type ProtocolSummaryRequestResult = {
	protocol: ProtocolData;
};

export async function requestProtocolSummaryData(): Promise<ProtocolData> {
	const { data, loading } = await compoundInfoSubgraphClient.query<ProtocolSummaryRequestResult>({
		query: protocolSummaryQuery,
		variables: {
			id: PROTOCOL_ID,
		},
	});

	return data.protocol;
}
