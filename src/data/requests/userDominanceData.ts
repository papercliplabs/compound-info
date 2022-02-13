// @ts-nocheck
import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { UserDominanceData } from "common/types";
import { Token, TransactionType, UserType } from "common/enums";

const PAGE_LENGTH = 1000;
const NUM_OF_TOP_ACCOUNTS = 10; // Number of top accounts to get

const userDominanceSingleMarketQuery = gql`
	query userDominanceSingleMarketQuery($skip: Int!, $pageLength: Int!, $numTop: Int!, $marketSymbol: String!) {
		markets(where: { underlyingSymbol: $marketSymbol }, first: $pageLength, skip: $skip) {
			underlyingSymbol
			topSupplierUserMarkets: userMarkets(orderBy: totalSupply, orderDirection: desc, first: $numTop) {
				user {
					id
				}
				totalSupply
			}
			topBorrowerUserMarkets: userMarkets(orderBy: totalBorrow, orderDirection: desc, first: $numTop) {
				user {
					id
				}
				totalBorrow
			}
		}
	}
`;

/**
 * Helper to perform
 * @param query the query to perform
 * @param key the key to use to get to the data (marketWeekDatas, marketDayDatas or marketHourDatas)
 * @param token the token to get the user dominance info for
 * @return the formatted query results, the last entry of the results is the most recent values
 */
async function performPagenationRequest(query: DocumentNode, key: string, token: Token): UserDominanceData {
	const outputData: UserDominanceData = {
		[UserType.SUPPLIER]: [],
		[UserType.BORROWER]: [],
	};

	let allFound = false;
	let skip = 0;

	// Pagenation of requests
	while (!allFound) {
		let data = await compoundInfoSubgraphClient.query({
			query: query,
			variables: {
				skip: skip,
				pageLength: PAGE_LENGTH,
				numTop: NUM_OF_TOP_ACCOUNTS,
				marketSymbol: token,
			},
		});

		data = data.data[key][0];
		const topSupplierUserMarkets = data.topSupplierUserMarkets;
		const topBorrowerUserMarkets = data.topBorrowerUserMarkets;
		const len = Math.max(topSupplierUserMarkets.length, topBorrowerUserMarkets.length);

		for (let i = 0; i < topSupplierUserMarkets.length; i++) {
			const entry: UserDominanceDataEntry = {
				account: topSupplierUserMarkets[i].user.id,
				underlyingAmount: topSupplierUserMarkets[i].totalSupply,
				percentDominance: 0, // Not populated in this request
			};
			outputData[UserType.SUPPLIER].push(entry);
		}

		for (let i = 0; i < topBorrowerUserMarkets.length; i++) {
			const entry: UserDominanceDataEntry = {
				account: topBorrowerUserMarkets[i].user.id,
				underlyingAmount: topBorrowerUserMarkets[i].totalBorrow,
				percentDominance: 0, // Not populated in this request
			};
			outputData[UserType.BORROWER].push(entry);
		}

		// If less than PAGE_LENGTH results were returned we found everything
		allFound = len !== PAGE_LENGTH;
		skip += PAGE_LENGTH;
	}

	return outputData;
}

/**
 * Perform request for user dominance data for all markets
 * @param token the token to get the dominance data for
 * @returns user dominance data for the token market
 */
export async function requestUserDominanceData(token: Token): Promise<UserDominanceData> {
	console.log("Performing request: user dominance data");

	const userDominanceData = await performPagenationRequest(userDominanceSingleMarketQuery, "markets", token);

	return userDominanceData;
}
