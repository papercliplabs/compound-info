// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Redirect } from "react-router-dom";
import styled, { useTheme } from "styled-components";

import { TOKEN_INFO } from "common/constants";

import { formatNumber, getEtherscanLink, getTokenForUnderlyingSymbol, shortAddress } from "common/utils";
import ApyChartContainer from "components/ApyChartContainer";
import {
	useMarketSummaryData,
	useTestData,
	useTimeSeriesData,
	useTransactionData,
	useUserDominanceData,
} from "data/hooks";
import Card, { StatCard, ProgressCard, CoinInfoCard } from "components/Card";
import Row, { ResponsiveJustifyRow, ResponsiveRow } from "components/Row";
import Column from "components/Column";
import { mediaQuerySizes, Typography } from "theme";
import { StyledInternalLink, StyledExternalLink } from "components/Link";
import { SectionTitle, StyledDisclaimer } from "components/SpecialText";
import { TokenLogo } from "components/Logo";
import TooltipText from "components/TooltipText";
import { ToggleButton } from "components/Button";
import TimeSeriesChart from "components/Chart/TimeSeriesChart";
import TokenSelectorTimeSeriesChart from "components/Chart/TokenSelectorTimeSeriesChart";
import MultilineChart from "components/Chart/MultilineChart";

import { ChartConfig } from "common/types";
import { DataType, EtherscanLinkType, Length, MarketDataSelector, TimeSelector } from "common/enums";
import TransactionTable from "components/TransactionTable";
import UserDominace from "components/UserDominance";
import Skeleton from "components/Skeleton";

function StatRow({ title, value, unit, tooltipContent, loading }) {
	const theme = useTheme();
	const formattedValue = formatNumber(value, unit);
	return (
		<Row justify="space-between">
			<TooltipText
				baseText={<Typography.header color={theme.color.text2}>{title}</Typography.header>}
				tooltipContent={tooltipContent}
			></TooltipText>
			{loading ? <Skeleton width="70px" height="25px" /> : <Typography.header>{formattedValue}</Typography.header>}
		</Row>
	);
}

// Main content of the market page
export default function Market({ match }): JSX.Element | null {
	const theme = useTheme();
	const gap = theme.spacing.lg;
	const [includeComp, setIncludeComp] = useState<boolean>(false);
	const [showInUsd, setShowInUsd] = useState<boolean>(false);

	const underlyingSymbol = match.params.token; // From url
	const token = getTokenForUnderlyingSymbol(underlyingSymbol);

	// Scroll to the top of the page
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [match.params.token]);

	const summaryData = useMarketSummaryData(token);

	if (!token) {
		return <Redirect to={"/"} />;
	}

	if (Array.isArray(summaryData)) {
		// Won't ever get her
		return null;
	}

	const loadingSummaryData = !summaryData;

	const tokenInfo = TOKEN_INFO[token];
	const cTokenAddress = summaryData ? summaryData.id : "";
	const etherscanLink = getEtherscanLink(cTokenAddress, EtherscanLinkType.TOKEN);

	const extraSmallScreen = window.innerWidth < mediaQuerySizes.extraSmall;
	const singleColumn = window.innerWidth < mediaQuerySizes.small;

	const tokenSelectorChartConfig: ChartConfig = {
		showAvg: !extraSmallScreen,
		showXAxis: false,
		showYAxis: false,
		showXTick: true,
		showYTick: !extraSmallScreen,
		showHorizontalGrid: !extraSmallScreen,
		showVerticalGrid: false,
		showAreaGradient: true,
		numberOfXAxisTicks: 3,
		animate: true,
		showValueInTooltip: extraSmallScreen,
		baseChartHeightPx: 300,
	};

	const apyChartDataSelectors = includeComp
		? [MarketDataSelector.TOTAL_SUPPLY_APY, MarketDataSelector.TOTAL_BORROW_APY]
		: [MarketDataSelector.SUPPLY_APY, MarketDataSelector.BORROW_APY];

	const supplyBorrowReservesChartDataSelectors = showInUsd
		? [MarketDataSelector.TOTAL_SUPPLY_USD, MarketDataSelector.TOTAL_BORROW_USD, MarketDataSelector.TOTAL_RESERVES_USD]
		: [MarketDataSelector.TOTAL_SUPPLY, MarketDataSelector.TOTAL_BORROW, MarketDataSelector.TOTAL_RESERVES];

	const tokenPriceDataSelectors = [MarketDataSelector.USDC_PER_UNDERLYING];

	const lowerChartsConfig: ChartConfig = {
		showAvg: false,
		showXAxis: false,
		showYAxis: false,
		showXTick: true,
		showYTick: false,
		showHorizontalGrid: false,
		showVerticalGrid: false,
		showAreaGradient: true,
		numberOfXAxisTicks: 3,
		animate: true,
		showValueInTooltip: true,
		baseChartHeightPx: 200,
	};

	const timeSelectorOptions = [
		TimeSelector.ONE_DAY,
		TimeSelector.ONE_WEEK,
		TimeSelector.ONE_MONTH,
		TimeSelector.THREE_MONTHS,
		TimeSelector.ONE_YEAR,
		TimeSelector.ALL,
	];

	return (
		<>
			<Row>
				<Typography.body color="text2">
					<StyledInternalLink to={"/"}>Market</StyledInternalLink>
					{" / "}
					<StyledExternalLink href={etherscanLink} variant="secondary">
						c{token} ({shortAddress(cTokenAddress, Length.MEDIUM)})
					</StyledExternalLink>
				</Typography.body>
			</Row>
			<Row height="40px" margin={"20px 0"}>
				<TokenLogo token={token} size="40px" />
				<Typography.displayXL>{token}</Typography.displayXL>
			</Row>
			<ResponsiveRow align="flex-start" gapSmall={gap} gap={theme.spacing.xl}>
				<Column flex={2} gap={gap}>
					<Column>
						<ResponsiveRow xs={true}>
							<Row>
								<Typography.displayS>APY Performance</Typography.displayS>
							</Row>
							<ResponsiveJustifyRow justifyLarge="flex-end" justifySmall="flex-end" justifyExtraSmall="flex-start">
								<TooltipText
									baseText={<Typography.body color={theme.color.text2}>Include COMP</Typography.body>}
									tooltipContent="Toggle to include the COMP token distribution in the APY chart data. Note that a negative borrow rate means that the Compound protocol pays you."
								/>
								<ToggleButton active={includeComp} onClick={() => setIncludeComp(!includeComp)} />
							</ResponsiveJustifyRow>
						</ResponsiveRow>
						<Card>
							<TokenSelectorTimeSeriesChart
								chartConfig={tokenSelectorChartConfig}
								dataSelectorOptions={apyChartDataSelectors}
								timeSelectorOptions={timeSelectorOptions}
								mainToken={token}
							/>
						</Card>
					</Column>

					<Column>
						<ResponsiveRow xs={true}>
							<Row>
								<Typography.displayS>Supply, Borrow and Reserves</Typography.displayS>
							</Row>
							<ResponsiveJustifyRow justifyLarge="flex-end" justifySmall="flex-end" justifyExtraSmall="flex-start">
								<TooltipText
									baseText={<Typography.body color={theme.color.text2}>Show in USD</Typography.body>}
									tooltipContent="Toggle to convert to total number of tokens supplied, borrowed and in reserves to the USD equivilent values. That is, the number of tokens, times the token value at that time."
								/>
								<ToggleButton active={showInUsd} onClick={() => setShowInUsd(!showInUsd)} />
							</ResponsiveJustifyRow>
						</ResponsiveRow>
						<Card>
							<TimeSeriesChart
								chartConfig={lowerChartsConfig}
								lineInfoList={[{ key: token, color: theme.color.lineChartColors[1] }]}
								dataType={DataType.MARKET}
								dataSelectorOptions={supplyBorrowReservesChartDataSelectors}
								token={token}
								timeSelectorOptions={timeSelectorOptions}
							/>
						</Card>
					</Column>

					{!singleColumn && (
						<Column>
							<Row>
								<Typography.displayS>Transactions</Typography.displayS>
							</Row>
							<TransactionTable token={underlyingSymbol} />
						</Column>
					)}
				</Column>
				<Column gap={gap}>
					<Column>
						<Row>
							<Typography.displayS>Key Statistics</Typography.displayS>
						</Row>
						<Card>
							<Column gap={theme.spacing.lg}>
								<StatRow
									title={"Token price"}
									tooltipContent="The current price of the asset."
									value={summaryData ? summaryData.usdcPerUnderlying : 0}
									unit="$"
									loading={loadingSummaryData}
								/>
								<StatRow
									title={"Total supplied"}
									tooltipContent="The total value (USD) of tokens supplied to the market."
									value={summaryData ? summaryData.totalSupply * summaryData.usdcPerUnderlying : 0}
									unit="$"
									loading={loadingSummaryData}
								/>
								<StatRow
									title={"Total borrow"}
									tooltipContent="The total amount of funds borrowed from the market. (USD)"
									value={summaryData ? summaryData.totalBorrow * summaryData.usdcPerUnderlying : 0}
									unit="$"
									loading={loadingSummaryData}
								/>
								<StatRow
									title={"Utilization"}
									tooltipContent="How much of the total supply is in use at a given time. If there's $100 in the pool and no one borrows anything, the utilization rate is 0%. If someone borrows $10, it's 10%, and so on. If an asset is 100% utilized, there's nothing in the pool right now - suppliers can't withdraw their original cash, and borrowers can't take out loans."
									value={summaryData ? summaryData.utilization : 0}
									unit="%"
									loading={loadingSummaryData}
								/>
								<StatRow
									title={"Reverses"}
									tooltipContent="Compound takes a portion of all the interest paid by borrowers and stores it in a pool that acts as  insurance for lenders against borrower default and liquidation. The reserve pool is controlled by COMP token holders."
									value={summaryData ? summaryData.totalReserves * summaryData.usdcPerUnderlying : 0}
									unit="$"
									loading={loadingSummaryData}
								/>
								<StatRow
									title={"Reserve factor"}
									tooltipContent="The percentage of a given asset's accrued interest that gets put into a reserve pool. A 5% reserve factor = 5% of the interest paid by borrowers gets put into the pool (which provides a safety net for lenders against borrower default and liquidation)."
									value={summaryData ? summaryData.reserveFactor : 0}
									unit="%"
									loading={loadingSummaryData}
								/>
								<StatRow
									title={"Collateral factor"}
									tooltipContent="Each asset has a unique collateral factor that determines the maximum amount a user can borrow from the pool, relative to how much of that asset they supplied. If the collateral factor for ETH is 50%, a user who supplied 100 ETH can borrow a maximum of 50 ETH worth of other assets at a given time."
									value={summaryData ? summaryData.collateralFactor : 0}
									unit="%"
									loading={loadingSummaryData}
								/>

								<StatRow
									title={"Borrow cap"}
									tooltipContent="The maximum amount of an asset that can be borrowed from the market. The borrow cap is controlled by COMP token holders."
									value={summaryData ? (summaryData.borrowCap !== "0" ? summaryData.borrowCap : "No limit") : 0}
									loading={loadingSummaryData}
								/>
								<StatRow
									title={"Available liquidity"}
									tooltipContent="The amount of assets that are currently available to be borrowed from the market. "
									value={summaryData ? summaryData.availableLiquidityUsd : 0}
									unit="$"
									loading={loadingSummaryData}
								/>
								{/* <StatRow
									title={"Number of suppliers"}
									tooltipContent="The number of wallets currently supplying this market."
									value={summaryData.numberOfSuppliers}
									loading={loadingSummaryData}
								/>
								<StatRow
									title={"Number of borrowers"}
									tooltipContent="The number of wallets currently borrowing this asset."
									value={summaryData.numberOfBorrowers}
									loading={loadingSummaryData}
								/> */}
							</Column>
						</Card>
					</Column>

					{/* TODO: uncomment once new subgraph is done indexing */}
					{/* <Column>
						<Row>
							<Typography.displayS>User Dominance</Typography.displayS>
						</Row>
						<UserDominace token={token} />
					</Column> */}

					<Column>
						<Row>
							<Typography.displayS>About {token}</Typography.displayS>
						</Row>
						<CoinInfoCard
							value={tokenInfo.desc}
							whitepaper={tokenInfo.whitepaper}
							website={tokenInfo.website}
							twitter={tokenInfo.twitter}
							coingecko={tokenInfo.coingecko}
						/>
					</Column>

					{singleColumn && (
						<Column>
							<Row>
								<Typography.displayS>Transactions</Typography.displayS>
							</Row>
							<TransactionTable token={underlyingSymbol} />
						</Column>
					)}
				</Column>
			</ResponsiveRow>
		</>
	);
}
