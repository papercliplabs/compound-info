// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { Redirect } from "react-router-dom";
import { useTheme } from "styled-components";

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
import Row, { ResponsiveRow } from "components/Row";
import Column from "components/Column";
import { Typography } from "theme";
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

function StatRow({ title, value, unit, tooltipContent }) {
	const theme = useTheme();
	const formattedValue = formatNumber(value, unit);
	return (
		<Row justify="space-between">
			<TooltipText
				baseText={<Typography.header color={theme.color.text1}>{title}</Typography.header>}
				tooltipContent={tooltipContent}
			></TooltipText>
			<Typography.header>{formattedValue}</Typography.header>
		</Row>
	);
}

// Main content of the market page
export default function Market({ match }): JSX.Element | null {
	const theme = useTheme();
	const gap = theme.spacing.md;
	const [includeComp, setIncludeComp] = useState<boolean>(false);
	const [showInUsd, setShowInUsd] = useState<boolean>(false);

	const underlyingSymbol = match.params.token; // From url
	const token = getTokenForUnderlyingSymbol(underlyingSymbol);

	const userDominanceData = useUserDominanceData(token);
	console.log(userDominanceData);

	// Scroll to the top of the page
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [match]);

	const summaryData = useMarketSummaryData(token);
	// const marketData = useMarketSummaryData(coin);

	if (!token) {
		return <Redirect to={"/"} />;
	}

	// Loading data
	if (!summaryData || Array.isArray(summaryData)) {
		return null;
	}

	const tokenInfo = TOKEN_INFO[token];
	const cTokenAddress = summaryData.id;
	const etherscanLink = getEtherscanLink(cTokenAddress, EtherscanLinkType.TOKEN);

	const tokenSelectorChartConfig: ChartConfig = {
		showAvg: true,
		showXAxis: false,
		showYAxis: false,
		showXTick: true,
		showYTick: true,
		showHorizontalGrid: true,
		showVerticalGrid: false,
		showAreaGradient: true,
		numberOfXAxisTicks: 3,
		animate: true,
		showValueInTooltip: false,
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
			<ResponsiveRow reverse align="flex-start" gap={"32px"}>
				<Column flex={2} gap={gap}>
					<Row>
						<SectionTitle width="auto" title="APY Performance" />
						<Row justify="flex-end" height="100%" padding="20px 0 0 0" margin="0 0 8px 0">
							<TooltipText
								baseText={<Typography.body color="text2">Include COMP</Typography.body>}
								tooltipContent="Toggle to include the COMP token distribution in the APY chart data. Note that a negative borrow rate means that the Compound protocol pays you."
							/>
							<ToggleButton active={includeComp} onClick={() => setIncludeComp(!includeComp)} />
						</Row>
					</Row>
					<Card>
						<TokenSelectorTimeSeriesChart
							chartConfig={tokenSelectorChartConfig}
							dataSelectorOptions={apyChartDataSelectors}
							timeSelectorOptions={timeSelectorOptions}
							mainToken={token}
						/>
					</Card>
					<SectionTitle title="Key Statistics" />
					<Card>
						<ResponsiveRow gap={theme.spacing.xxl} gapSmall={theme.spacing.lg}>
							<Column gap={theme.spacing.lg}>
								<StatRow
									title={"Token price"}
									tooltipContent="The current price of the asset."
									value={summaryData.usdcPerUnderlying}
									unit="$"
								/>
								<StatRow
									title={"Reserve factor"}
									tooltipContent="The percentage of a given asset's accrued interest that gets put into a reserve pool. A 5% reserve factor = 5% of the interest paid by borrowers gets put into the pool (which provides a safety net for lenders against borrower default and liquidation)."
									value={summaryData.reserveFactor}
									unit="%"
								/>
								{/* <StatRow
									title={"Number of suppliers"}
									tooltipContent="The number of wallets currently supplying this market."
									value={summaryData.numberOfSuppliers}
								/>
								<StatRow
									title={"Number of borrowers"}
									tooltipContent="The number of wallets currently borrowing this asset."
									value={summaryData.numberOfBorrowers}
								/> */}
								<StatRow
									title={"Collateral factor"}
									tooltipContent="Each asset has a unique collateral factor that determines the maximum amount a user can borrow from the pool, relative to how much of that asset they supplied. If the collateral factor for ETH is 50%, a user who supplied 100 ETH can borrow a maximum of 50 ETH worth of other assets at a given time."
									value={summaryData.collateralFactor}
									unit="%"
								/>
							</Column>
							<Column gap={theme.spacing.lg}>
								<StatRow
									title={"Total borrow"}
									tooltipContent="The total amount of funds borrowed from the market. (USD)"
									value={summaryData.totalBorrow * summaryData.usdcPerUnderlying}
									unit="$"
								/>
								<StatRow
									title={"Borrow cap"}
									tooltipContent="The maximum amount of an asset that can be borrowed from the market. The borrow cap is controlled by COMP token holders."
									value={summaryData.borrowCap !== "0" ? summaryData.borrowCap : "No limit"}
								/>
								<StatRow
									title={"Available liquidity"}
									tooltipContent="The amount of assets that are currently available to be borrowed from the market. "
									value={summaryData.availableLiquidityUsd}
									unit="$"
								/>
							</Column>
						</ResponsiveRow>
					</Card>
					<Row>
						<SectionTitle width="auto" title={"Supply, Borrow and Reserves"} />
						<Row justify="flex-end" height="100%" padding="20px 0 0 0" margin="0 0 8px 0">
							<TooltipText
								baseText={<Typography.body color="text2">USD equivilent</Typography.body>}
								tooltipContent="Toggle to convert to total number of tokens supplied, borrowed and in reserves to the USD equivilent values. That is, the number of tokens, times the token value at that time."
							/>
							<ToggleButton active={showInUsd} onClick={() => setShowInUsd(!showInUsd)} />
						</Row>
					</Row>
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
					<SectionTitle title={"Token price in USD"} />
					<Card>
						<TimeSeriesChart
							chartConfig={lowerChartsConfig}
							lineInfoList={[{ key: token, color: theme.color.lineChartColors[1] }]}
							dataType={DataType.MARKET}
							dataSelectorOptions={tokenPriceDataSelectors}
							token={token}
							timeSelectorOptions={timeSelectorOptions}
						/>
					</Card>
					<SectionTitle title="Transactions" />
					<TransactionTable token={underlyingSymbol} />
					<SectionTitle title={"About " + token} />
					<CoinInfoCard
						value={tokenInfo.desc}
						whitepaper={tokenInfo.whitepaper}
						website={tokenInfo.website}
						twitter={tokenInfo.twitter}
						coingecko={tokenInfo.coingecko}
					/>
				</Column>
				<Column gap={gap}>
					<SectionTitle title="Market Overview" />
					<StatCard
						title={"Total supplied"}
						tooltipContent="The total value (USD) of tokens supplied to the market."
						value={summaryData.totalSupply * summaryData.usdcPerUnderlying}
						unit="$"
					/>
					<ProgressCard
						title={"Utilization"}
						tooltipContent="How much of the total supply is in use at a given time. If there's $100 in the pool and no one borrows anything, the utilization rate is 0%. If someone borrows $10, it's 10%, and so on. If an asset is 100% utilized, there's nothing in the pool right now - suppliers can't withdraw their original cash, and borrowers can't take out loans."
						value={summaryData.utilization}
						unit="%"
						size={60}
						progressPercent={summaryData.utilization}
					/>
					<StatCard
						title={"Reserves"}
						tooltipContent="Compound takes a portion of all the interest paid by borrowers and stores it in a pool that acts as  insurance for lenders against borrower default and liquidation. The reserve pool is controlled by COMP token holders."
						value={summaryData.totalReserves * summaryData.usdcPerUnderlying}
						unit="$"
					/>
				</Column>
			</ResponsiveRow>
		</>
	);
}
