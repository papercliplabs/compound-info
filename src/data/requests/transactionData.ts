// @ts-nocheck
import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

import { PROTOCOL_ID } from "common/constants";
import { Transaction } from "common/types";
import { Token, TransactionType } from "common/enums";

const PAGE_LENGTH = 1000; // Max of 1000

const mintsQuery = gql`
	query mintsQuery($skip: Int!, $pageLength: Int!, $dateGreaterThan: Int!) {
		mints(orderBy: date, orderDirection: asc, first: $pageLength, skip: $skip, where: { date_gt: $dateGreaterThan }) {
			id
			userMarket {
				market {
					underlyingSymbol
				}
				user {
					id
				}
			}
			underlyingAmount
			date
		}
	}
`;

const redeemsQuery = gql`
	query redeemsQuery($skip: Int!, $pageLength: Int!, $dateGreaterThan: Int!) {
		redeems(orderBy: date, orderDirection: asc, first: $pageLength, skip: $skip, where: { date_gt: $dateGreaterThan }) {
			id
			userMarket {
				market {
					underlyingSymbol
				}
				user {
					id
				}
			}
			underlyingAmount
			date
		}
	}
`;

const borrowsQuery = gql`
	query borrowsQuery($skip: Int!, $pageLength: Int!, $dateGreaterThan: Int!) {
		borrows(orderBy: date, orderDirection: asc, first: $pageLength, skip: $skip, where: { date_gt: $dateGreaterThan }) {
			id
			userMarket {
				market {
					underlyingSymbol
				}
				user {
					id
				}
			}
			underlyingAmount
			date
		}
	}
`;

const repayBorrowsQuery = gql`
	query repayBorrowsQuery($skip: Int!, $pageLength: Int!, $dateGreaterThan: Int!) {
		repayBorrows(
			orderBy: date
			orderDirection: asc
			first: $pageLength
			skip: $skip
			where: { date_gt: $dateGreaterThan }
		) {
			id
			userMarket {
				market {
					underlyingSymbol
				}
				user {
					id
				}
			}
			underlyingAmount
			date
		}
	}
`;

// Alias fields so the outputs follows that of the above
const liquidationsQuery = gql`
	query liquidationsQuery($skip: Int!, $pageLength: Int!, $dateGreaterThan: Int!) {
		liquidations(
			orderBy: date
			orderDirection: asc
			first: $pageLength
			skip: $skip
			where: { date_gt: $dateGreaterThan }
		) {
			id
			userMarket: borrowerUserLiquidationMarket {
				market {
					underlyingSymbol
				}
				user {
					id
				}
			}
			underlyingAmount: repayAmount
			date
		}
	}
`;

/**
 * Helper to perform
 * @param query the query to perform
 * @param key the key to use to get to the data (marketWeekDatas, marketDayDatas or marketHourDatas)
 * @param dateGreaterThan only take data with the date in seconds since unix epooch greater than this
 * @param transactionType the type of the transaction being paganated
 * @return the formatted query results, the last entry of the results is the most recent values
 */
async function performPagenationRequest(
	query: DocumentNode,
	key: string,
	dateGreaterThan: number,
	transactionType: TransactionType
): Transaction[] {
	const outputData: Transaction[] = [];

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

		console.log(data);

		const transactionData = data.data[key];

		const len = transactionData.length;

		for (let i = 0; i < len; i++) {
			const tokenSymbol = transactionData[i].userMarket.market.underlyingSymbol;

			if (tokenSymbol in Token) {
				const entry: Transaction = {
					type: transactionType,
					token: tokenSymbol,
					hash: transactionData[i].id,
					tokenAmount: transactionData[i].underlyingAmount,
					account: transactionData[i].userMarket.user.id,
					time: transactionData[i].date,
				};

				outputData.push(entry);
			}
		}

		// If less than PAGE_LENGTH results were returned we found everything
		allFound = len !== PAGE_LENGTH;
		skip += PAGE_LENGTH;
	}

	return outputData;
}

export type ProtocolSummaryRequestResult = {
	protocolWeekDatas: ProtocolHistoricalData[];
};

/**
 * Perform request for transaction data for all markets in the last 3 days
 * @returns list of all transactions in the last 3 days sorted with the newest transaction first
 */
export async function requestTransactionData(): Promise<Transaction[]> {
	console.log("Requesting transaction data");

	const now = Math.round(Date.now() / 1000); // Unix timestamp in seconds
	const dateGraterThan = now - 3 * 24 * 60 * 60; // Last 2 days

	const mints = await performPagenationRequest(mintsQuery, "mints", dateGraterThan, TransactionType.MINT);
	const redeems = await performPagenationRequest(redeemsQuery, "redeems", dateGraterThan, TransactionType.REDEEM);
	const borrows = await performPagenationRequest(borrowsQuery, "borrows", dateGraterThan, TransactionType.BORROW);
	const repayBorrows = await performPagenationRequest(
		repayBorrowsQuery,
		"repayBorrows",
		dateGraterThan,
		TransactionType.REPAY_BORROW
	);
	const liquidations = await performPagenationRequest(
		liquidationsQuery,
		"liquidations",
		dateGraterThan,
		TransactionType.LIQUIDATION
	);

	console.log(mints);
	console.log(redeems);
	console.log(borrows);
	console.log(repayBorrows);
	console.log(liquidations);

	const transactionData = [...mints, ...redeems, ...borrows, ...repayBorrows, ...liquidations];

	// Sort based on time
	transactionData.sort((a, b) => {
		return a.time < b.time;
	});

	return transactionData;
}
