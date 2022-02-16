import React, { useState, useMemo } from "react";
import styled, { useTheme } from "styled-components";

import { EtherscanLinkType, Length, Token, UserType } from "common/enums";
import Card from "components/Card";
import { useUserDominanceData } from "data/hooks";
import { OptionButton, OptionButtonVariantBackdrop } from "components/Button";
import TooltipText from "components/TooltipText";
import Column from "components/Column";
import { theme, Typography } from "theme";
import Row from "components/Row";
import { UserDominanceDataEntry } from "common/types";
import { formatNumber, getEtherscanLink, shortAddress } from "common/utils";
import { StyledExternalLink } from "components/Link";
import Skeleton from "components/Skeleton";

const RowNumberBackground = styled.div`
	display: flex;
	justify-content: center;
	background-color: ${({ theme }) => theme.color.bg0};
	width: 20px;
	height: 20px;
	border-radius: 10px;
`;

function UserDominaceRowEntry({ entry, num }: { entry: UserDominanceDataEntry; num: number }): JSX.Element {
	const theme = useTheme();

	const accountLink = getEtherscanLink(entry.account, EtherscanLinkType.WALLET);

	return (
		<Row justify="space-between">
			<RowNumberBackground>
				<Typography.caption color={theme.color.text2} fontWeight={600}>
					{num}
				</Typography.caption>
			</RowNumberBackground>
			<StyledExternalLink href={accountLink}>{shortAddress(entry.account, Length.SHORT)}</StyledExternalLink>
			<Row justify="flex-end">
				<Typography.header>{formatNumber(entry.underlyingAmount)}</Typography.header>
				<Typography.header color={theme.color.text2}>({formatNumber(entry.percentDominance, "%")})</Typography.header>
			</Row>
		</Row>
	);
}

export default function UserDominace({ token }: { token: Token }): JSX.Element {
	const theme = useTheme();
	const [selection, setSelection] = useState<UserType>(UserType.SUPPLIER);

	const userDominanceData = useUserDominanceData(token);

	const selectionButtons = useMemo(() => {
		const selectors = [UserType.SUPPLIER, UserType.BORROWER];

		return selectors.map((selector, i) => {
			return (
				<OptionButton
					key={i}
					buttonContent={selector + "s"}
					active={selection === selector}
					onClick={() => {
						setSelection(selector);
					}}
					flex={1}
					variant
				/>
			);
		});
	}, [setSelection, selection]);

	const rows = useMemo(() => {
		if (userDominanceData[selection].length > 0) {
			return userDominanceData[selection].map((entry, i) => {
				return <UserDominaceRowEntry entry={entry} num={i + 1} key={i} />;
			});
		} else {
			return <Skeleton count={10} height="25px" />;
		}
	}, [userDominanceData, selection]);

	const topTenDominance = useMemo(() => {
		return userDominanceData[selection].reduce((sum, entry) => {
			return sum + entry.percentDominance;
		}, 0);
	}, [userDominanceData, selection]);

	return (
		<>
			<Card>
				<Column align="flex-start">
					<OptionButtonVariantBackdrop width="100%">{selectionButtons}</OptionButtonVariantBackdrop>
					<Row justify="space-between">
						<TooltipText
							baseText={<Typography.header color={theme.color.bg4}>Top 10 dominance</Typography.header>}
							tooltipContent={`The top 10 ${
								selection == UserType.SUPPLIER ? "suppliers" : "borrowers"
							} make up this percentage of the total ${selection == UserType.SUPPLIER ? "suppy" : "borrowed"}`}
						/>
						<Typography.header>
							{userDominanceData[selection].length > 0 ? formatNumber(topTenDominance, "%") : <Skeleton width="40px" />}
						</Typography.header>
					</Row>
					{rows}
				</Column>
			</Card>
		</>
	);
}
