// @ts-nocheck

import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

/// New
const testQuery = gql`
	query markets {
		markets(where: { underlyingSymbol: "UNI" }) {
			id
			historicalHourData {
				supplyApy
				totalSupplyApy
				totalSupply
				date
			}
		}
	}
`;

export async function requestMarketChartData() {
	return compoundInfoSubgraphClient
		.query({
			query: testQuery,
		})
		.then((data) => {
			console.log("Subgraph data: ", data);
			return data;
		})
		.catch((err) => {
			console.log("Error fetching data: ", err);
		});
}
