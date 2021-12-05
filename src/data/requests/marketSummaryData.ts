import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { Token } from "common/enums";
import { MarketSummaryData } from "common/types";
import { PROTOCOL_ID } from "common/constants";

/// New
const marketSummaryQuery = gql`
	query marketSummaryData($underlyingSymbol: String!) {
		markets(where: { underlyingSymbol: $underlyingSymbol }) {
			creationBlockNumber
			cTokenSymbol
			underlyingName
			underlyingAddress
			collatoralFactor
			reserveFactor
			cash
			usdcPerUnderlying
			usdcPerEth
			utalization
			supplyApy
			borrowApy
			totalSupplyApy
			totalBorrowApy
			totalSupply
			totalBorrow
			totalReserves
			usdcPerUnderlying
			usdcPerEth
		}
	}
`;

export type MarketSummaryRequestResult = {
	markets: MarketSummaryData[];
};

export async function requestMarketSummaryData(underlyingSymbol: Token): Promise<MarketSummaryData> {
	const { data, loading } = await compoundInfoSubgraphClient.query<MarketSummaryRequestResult>({
		query: marketSummaryQuery,
		variables: {
			underlyingSymbol: underlyingSymbol,
		},
	});

	return data.markets[0];
}
