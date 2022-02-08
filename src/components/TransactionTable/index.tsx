import React, { useState, useMemo } from "react";
import styled, { useTheme } from "styled-components";

import { DateFormat, EtherscanLinkType, Length, Token, TransactionType } from "common/enums";
import { useTransactionData } from "data/hooks";
import Card from "components/Card";
import { Transaction } from "common/types";
import Row from "components/Row";
import { Typography } from "theme";
import Column from "components/Column";
import { formatDate, formatNumber, getEtherscanLink, shortAddress } from "common/utils";
import { StyledExternalLink, StyledInternalLink } from "components/Link";
import Button from "components/Button";
import { Break } from "components/shared";
import DropdownButton from "components/Button/dropdownButton";

const transactionsPerPage = 10;

const RowEntry = styled(Typography.body)<{
	left: boolean;
}>`
	display: flex;
	flex-direction: row;
	justify-content: ${({ left }) => (left ? "flex-begin" : "flex-end")};
	align-items: center;
	width: 100%;
`;

const ResponsiveHideRow = styled(Row)`
	${({ theme }) => theme.mediaWidth.extraSmall`
		> *:nth-child(2) {
			display: none;
		}
		> *:nth-child(3) {
			display: none;
		}
	`}
`;

const ButtonBackground = styled(Button)<{
	active: boolean;
}>`
	background-color: ${({ theme }) => theme.color.bg3};
	border-radius: 24px;
	width: 24px;
	height: 24px;
	font-size: 14px;
	color: ${({ theme }) => theme.color.text1};
	opacity: ${({ active }) => (active ? 1.0 : 0.5)};
	:hover {
		opacity: ${({ active }) => (active ? 0.8 : 0.5)};
		cursor: ${({ active }) => (active ? "pointer" : "not-allowed")};
	}
`;

function TransactionTableEntry({ transaction }: { transaction: Transaction }): JSX.Element {
	const addressLink = getEtherscanLink(transaction.account, EtherscanLinkType.WALLET);
	const transactionLink = getEtherscanLink(transaction.hash, EtherscanLinkType.TRANSACTION);
	return (
		<ResponsiveHideRow>
			<RowEntry left={true}>
				<StyledExternalLink href={transactionLink}>{transaction.type}</StyledExternalLink>
			</RowEntry>
			<RowEntry>
				{formatNumber(transaction.tokenAmount)} {transaction.token}
			</RowEntry>
			<RowEntry>
				<StyledExternalLink href={addressLink}>{shortAddress(transaction.account, Length.SHORT)}</StyledExternalLink>
			</RowEntry>
			<RowEntry>{formatDate(transaction.time, DateFormat.SINCE_NOW)}</RowEntry>
		</ResponsiveHideRow>
	);
}

export default function TransactionTable({ token }: { token: Token }): JSX.Element {
	const theme = useTheme();
	const [page, setPage] = useState<number>(0);
	const [filterType, setFilterType] = useState<TransactionType | undefined>(undefined);

	const transactionData = useTransactionData(token, filterType);
	const transactionCount = transactionData.length;
	const maxPage = Math.floor(transactionCount / transactionsPerPage);
	const startIndex = page * transactionsPerPage;
	const endIndex = Math.min(startIndex + transactionsPerPage, transactionCount);
	const pageTransactions = transactionData.slice(startIndex, endIndex);

	const tableEntries = pageTransactions.map((transaction: Transaction, i) => (
		<TransactionTableEntry transaction={transaction} key={i} />
	));

	const dropdownSelections = [
		"All",
		TransactionType.MINT,
		TransactionType.REDEEM,
		TransactionType.BORROW,
		TransactionType.REPAY_BORROW,
		TransactionType.LIQUIDATION,
	];

	function setSelectionCallback(selection: any) {
		console.log(selection);
		if (Object.values(TransactionType).includes(selection as TransactionType)) {
			setFilterType(selection);
		} else {
			setFilterType(undefined);
		}

		// Reset page to 0 on change
		if (selection !== filterType) {
			setPage(0);
		}
	}

	return (
		<Card>
			<Column gap={theme.spacing.md}>
				<ResponsiveHideRow>
					<RowEntry left={true}>
						<DropdownButton
							selectionList={dropdownSelections}
							setSelectionCallback={(selection) => setSelectionCallback(selection)}
						>
							<Typography.header color={theme.color.text2}>Type: {filterType ?? "All"}</Typography.header>
						</DropdownButton>
					</RowEntry>
					<RowEntry>
						<Typography.header color={theme.color.text2}>Token Amount</Typography.header>
					</RowEntry>
					<RowEntry>
						<Typography.header color={theme.color.text2}>Account</Typography.header>
					</RowEntry>
					<RowEntry>
						<Typography.header color={theme.color.text2}>Time</Typography.header>
					</RowEntry>
				</ResponsiveHideRow>
				<Break />
				{tableEntries}
				<Row justify="center" padding={theme.spacing.sm + " 0"}>
					<ButtonBackground onClick={() => setPage(Math.max(0, page - 1))} active={page != 0}>
						←
					</ButtonBackground>
					Page {page + 1} of {maxPage + 1}
					<ButtonBackground onClick={() => setPage(Math.min(maxPage, page + 1))} active={page != maxPage}>
						→
					</ButtonBackground>
				</Row>
			</Column>
		</Card>
	);
}
