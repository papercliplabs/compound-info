import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { Token } from "common/enums";
import { MarketSummaryData } from "common/types";
import { PROTOCOL_ID } from "common/constants";

const marketSummaryQuery = gql`
	query marketSummaryData {
		markets {
			id
			underlyingSymbol
			creationBlockNumber
			cTokenSymbol
			underlyingName
			underlyingAddress
			collatoralFactor
			reserveFactor
			borrowCap
			cash
			utalization
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
			availableLiquidity
			availableLiquidityUsd
			usdcPerUnderlying
			usdcPerEth
		}
	}
`;

export type MarketSummaryRequestResult = {
	markets: MarketSummaryData[];
};

export async function requestMarketSummaryData(): Promise<MarketSummaryData[]> {
	console.log("Requesting market summary data");
	const { data, loading } = await compoundInfoSubgraphClient.query<MarketSummaryRequestResult>({
		query: marketSummaryQuery,
	});

	return data.markets;
}
