import React, { useState } from "react";
import styled from "styled-components";

import Row from "components/Row";
import Column from "components/Column";
import { Link } from "react-router-dom";
import { Typography } from "theme";
import { formatNumber } from "common/utils";
import { CoinLogo } from "components/Logo";
import { SortButton } from "components/Button";

// import { market_summary_data_S, market_summary_column_info_S } from "common/interfaces";
// import { getCoinForCoinName } from "common/utils";

const StyledTableRow = styled(Row)`
	padding: ${({ theme }) => theme.spacing.md};
	background-color: ${({ theme }) => theme.color.bg2};
	border-radius: ${({ theme }) => theme.radius.md};
	box-shadow: ${({ theme }) => theme.shadow.card};
	:hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.color.bg3};
	}

	${({ theme }) => theme.mediaWidth.small`
		padding: ${theme.spacing.md} ${theme.spacing.sm};
		> *:nth-child(2n) {
			display: none;
		}
	`}
`;

const StyledTableHeader = styled(Row)`
	justify-content: space-between;
	padding: ${({ theme }) => theme.spacing.md};
	background-color: ${({ theme }) => theme.color.bg1};
	${({ theme }) => theme.mediaWidth.small`
		justify-content: space-between;
		font-size: 14px !important;
		padding: ${theme.spacing.sm};
		background-color: ${theme.color.bg1};
			> *:nth-child(2n) {
				display: none;
				font-size: 14px;
			}
	`}
`;

const LinkWrapper = styled(Link)`
	text-decoration: none;
	display: flex;
	width: 100%;
	:hover {
		cursor: pointer;
	}
`;

const RowEntry = styled(Typography.body)<{
	left: boolean;
}>`
	display: flex;
	flex-direction: row;
	justify-content: ${({ left }) => (left ? "flex-begin" : "flex-end")};
	align-items: center;
	width: 100%;
`;

/**
 * Display the table row react component
 * @param marketData the market data the row is going to display
 * @param columnInfoList list of data info to select which column from the data to display
 */
// function TableRow({
// 	marketData,
// 	columnInfoList,
// }: {
// 	marketData: market_summary_data_S;
// 	columnInfoList: market_summary_column_info_S[];
// }): JSX.Element {
// 	const coinName = marketData.name;
// 	const coin = getCoinForCoinName(coinName);

// 	// Left align the first column, and put the coin logo beside it
// 	const rowData = columnInfoList.map((columnInfo, i) => {
// 		return (
// 			<RowEntry key={i} left={i === 0}>
// 				{i === 0 && coin !== null && coin !== undefined && <CoinLogo coin={coin} />}
// 				{formatNumber(marketData[columnInfo.key], columnInfo.unit)}
// 			</RowEntry>
// 		);
// 	});

// 	return (
// 		<LinkWrapper to={"/" + coinName}>
// 			<StyledTableRow>{rowData}</StyledTableRow>
// 		</LinkWrapper>
// 	);
// }
//
/**
 * Displays CoinTable react component with each row in the table being a rows of the data, and columns from the columnInfo list
 * @param data list of data to be used to generate the table, each row will become a row in the table
 * @param columnInfoList 	List of data info that is used to select and display the columns.
 * 							The keys determine which columns from the data will be displayed on the table.
 * 							The order determines the order in which the columns are displayed. The first item is left alligned and the rest are right aligned.
 */
export default function CoinTable({ data, columnInfoList }: { data: any; columnInfoList: any }): JSX.Element | null {
	// const columnKeys = columnInfoList.map((columnInfo) => columnInfo.key);
	// const [sortKey, setSortKey] = useState(columnKeys[1]); // Used to allow sorting the table rows by different keys
	// const [isAsc, setIsAsc] = useState(false); // If the sort is asc of desc

	// const sortedData = sortData(data, sortKey, isAsc);

	// const sortButtons = columnInfoList.map((columnInfo, i) => {
	// 	return (
	// 		<RowEntry key={i} left={i === 0}>
	// 			<SortButton
	// 				name={columnInfo.name}
	// 				isActive={columnInfo.key === sortKey}
	// 				handleClick={() => {
	// 					if (sortKey === columnInfo.key) {
	// 						setIsAsc(!isAsc);
	// 					} else {
	// 						setIsAsc(false);
	// 						setSortKey(columnInfo.key);
	// 					}
	// 				}}
	// 				isAsc={isAsc}
	// 			/>
	// 		</RowEntry>
	// 	);
	// });

	// const rows = sortedData.map((marketData, i) => {
	// 	return <TableRow key={i} marketData={marketData} columnInfoList={columnInfoList} />;
	// });

	return null;
	// <Column>
	// 	<StyledTableHeader>{sortButtons}</StyledTableHeader>
	// 	{rows}
	// </Column>
}

/**
 * Sort the data with the key ascending or decending
 * @param data list of data to be sorted
 * @param key key to sort the data on, this is a column in the data
 * @param asc sorts assending if true, decending if false
 * @returns sorted list of data
 */
// function sortData(
// 	data: any,
// 	key: any,
// 	asc: boolean
// ): market_summary_data_S[] {
// 	const sortedData = data.sort((a, b) => {
// 		const val = a[key] > b[key] ? 1 : -1;
// 		return asc ? val : -val;
// 	});
// 	return sortedData;
// }
