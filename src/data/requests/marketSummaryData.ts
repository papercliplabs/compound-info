import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { Token } from "common/enums";
import { MarketSummaryData } from "common/types";

const marketSummaryQuery = gql`
	query marketSummaryData {
		markets {
			id
			underlyingSymbol
			creationBlockNumber
			cTokenSymbol
			underlyingName
			underlyingAddress
			collateralFactor
			reserveFactor
			borrowCap
			cash
			utilization
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
	console.log("Performing request: market summary data");
	const { data } = await compoundInfoSubgraphClient.query<MarketSummaryRequestResult>({
		query: marketSummaryQuery,
	});

	return data.markets;
}
