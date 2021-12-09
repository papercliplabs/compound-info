// @ts-nocheck

import { compoundInfoSubgraphClient } from "data/apollo";
import { gql } from "@apollo/client";

// TODO: will need pagnation here
const marketHistoricalQuery = gql`
	query uni {
		marketWeekDatas(orderBy: date, orderDirection: asc, first: 1000) {
			id
			market {
				underlyingSymbol
			}
			date
			supplyApy
			borrowApy
			totalSupplyApy
		}
	}
`;

const defaultValueEntry = {
	DAI: undefined,
	UNI: undefined,
};

export async function requestMarketHistoricalData() {
	console.log("HER ");

	const data = await compoundInfoSubgraphClient.query({
		query: marketHistoricalQuery,
	});

	console.log("HERE");
	console.log(data);

	const marketWeekDatas = data.data.marketWeekDatas;
	const len = marketWeekDatas.length;

	let currentDate = marketWeekDatas[0].date;
	const outputData = [];
	let supplyApyEntry = {};
	for (let i = 0; i < len; i++) {
		if (marketWeekDatas[i].date !== currentDate) {
			const entry = {
				supplyApy: supplyApyEntry,
			};

			outputData.push(entry);

			currentDate = marketWeekDatas[i].date;
			supplyApyEntry = {};
		}

		const tokenSymbol = marketWeekDatas[i].market.underlyingSymbol;
		supplyApyEntry[tokenSymbol] = marketWeekDatas[i].supplyApy;
	}

	console.log(marketWeekDatas);

	console.log(outputData);

	// const uni = data.data.uni[0].historicalHourData;
	// const dai = data.data.dai[0].historicalHourData;

	return [];
}

// uni: markets(where: { underlyingSymbol: "UNI" }) {
// 	id
// 	historicalHourData(frist: 1000) {
// 		supplyApy
// 		totalSupplyApy
// 		totalSupply
// 		date
// 	}
// }
// dai: markets(where: { underlyingSymbol: "DAI" }) {
// 	id
// 	historicalHourData(first: 1000) {
// 		supplyApy
// 		totalSupplyApy
// 		totalSupply
// 		date
// 	}
// }
