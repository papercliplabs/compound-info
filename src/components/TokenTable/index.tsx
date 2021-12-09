import React, { useState, useMemo } from "react";
import styled from "styled-components";

import Row from "components/Row";
import Column from "components/Column";
import { Link } from "react-router-dom";
import { Typography } from "theme";
import { formatNumber, getTokenForUnderlyingSymbol } from "common/utils";
import { TokenLogo } from "components/Logo";
import { SortButton } from "components/Button";

import { MarketSummaryData, MarketSummaryDataSelectorInfo } from "common/types";
import { MarketDataSelector, Unit, Token } from "common/enums";
import { MARKET_DATA_SELECTOR_INFO } from "common/constants";

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
function TableRow({
	marketData,
	columnInfoList,
}: {
	marketData: MarketSummaryData;
	columnInfoList: MarketSummaryDataSelectorInfo[];
}): JSX.Element | null {
	const token = getTokenForUnderlyingSymbol(marketData.underlyingSymbol);

	if (!token) {
		return null;
	}

	// Left align the first column, and put the coin logo beside it
	const rowData = columnInfoList.map((columnInfo, i) => {
		return (
			<RowEntry key={i} left={i === 0}>
				{i === 0 && !!token && <TokenLogo token={token} />}
				{formatNumber(marketData[columnInfo.key] ?? 0, columnInfo.unit)}
			</RowEntry>
		);
	});

	return <LinkWrapper to={"/" + token}>{<StyledTableRow>{rowData}</StyledTableRow>}</LinkWrapper>;
}

/**
 * Displays CoinTable react component with each row in the table being a rows of the data, and columns from the columnInfo list
 * @param data market summary data list
 * @param dataSelectors the fields from the data to display in the table, they will be displayed in the order they are passed
 */
export default function TokenTable({
	data,
	dataSelectors,
}: {
	data: MarketSummaryData[];
	dataSelectors: MarketDataSelector[];
}): JSX.Element | null {
	const [sortKey, setSortKey] = useState<keyof MarketSummaryData>(dataSelectors[0]);
	const [isAsc, setIsAsc] = useState<boolean>(false);

	const sortedData = sortData(data, sortKey, isAsc);
	console.log(sortedData);

	// List of dataSelectorInfo, which is used for each column in the table
	const columnInfoList: MarketSummaryDataSelectorInfo[] = useMemo(() => {
		let infoList = dataSelectors.map(
			(selector) => MARKET_DATA_SELECTOR_INFO[selector] as MarketSummaryDataSelectorInfo
		);
		const tokenSelectorInfo: MarketSummaryDataSelectorInfo = {
			key: "underlyingSymbol",
			name: "Asset",
			description: "",
			unit: Unit.UNITLESS,
		};
		infoList = [tokenSelectorInfo, ...infoList];
		return infoList;
	}, [dataSelectors, data]);

	const sortButtons = useMemo(() => {
		const buttons = columnInfoList.map((columnInfo, i) => {
			return (
				<RowEntry key={i} left={i === 0}>
					<SortButton
						name={columnInfo.name}
						isActive={columnInfo.key === sortKey}
						handleClick={() => {
							if (sortKey === columnInfo.key) {
								setIsAsc(!isAsc);
							} else {
								setIsAsc(false);
								setSortKey(columnInfo.key);
							}
						}}
						isAsc={isAsc}
					/>
				</RowEntry>
			);
		});

		return buttons;
	}, [columnInfoList, sortKey, isAsc]);

	const rows = sortedData.map((marketData, i) => {
		return <TableRow key={i} marketData={marketData} columnInfoList={columnInfoList} />;
	});

	return (
		<Column>
			<StyledTableHeader>{sortButtons}</StyledTableHeader>
			{rows}
		</Column>
	);
}

/**
 * Sort the data with the key ascending or decending
 * @param data list of data to be sorted
 * @param key key to sort the data on, this is a column in the data
 * @param asc sorts assending if true, decending if false
 * @returns sorted list of data
 */
function sortData(data: MarketSummaryData[], key: keyof MarketSummaryData, asc: boolean): MarketSummaryData[] {
	// TODO: this is doing a string sort, for some reason the numbers are string
	const sortedData = [...data].sort((a, b) => {
		const compVala = isNaN(Number(a[key])) ? a[key] : Number(a[key]);
		const compValb = isNaN(Number(b[key])) ? b[key] : Number(b[key]);
		const val = compVala > compValb ? 1 : -1;
		return asc ? val : -val;
	});
	return sortedData;
}
