// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { Redirect } from "react-router-dom";
import { useTheme } from "styled-components";

import ApyChartContainer from "components/ApyChartContainer";
import { useMarketSummaryData, useTimeSeriesData } from "data/hooks";
import Card, { StatCard, ProgressCard, CoinInfoCard } from "components/Card";
import Row, { ResponsiveRow } from "components/Row";
import Column from "components/Column";
import { Typography } from "theme";
import { APY_DATA_SELECTORS, TIME_SERIES_DATA_SELECTORS, TIME_SELECTORS } from "common/constants";
import { formatNumber, getCoinForCoinName, getEtherscanLink, shortAddress } from "common/utils";
import { StyledInternalLink, StyledExternalLink } from "components/Link";
import { SectionTitle, StyledDisclaimer } from "components/SpecialText";
import { CoinLogo } from "components/Logo";
import TooltipText from "components/TooltipText";
import { ToggleButton } from "components/Button";
import MultilineChart from "components/MultilineChart";

import { COIN_INFO } from "common/constants";
import { coin_E } from "common/enums";

function StatRow({ title, value, unit, tooltipContent }) {
	const formattedValue = formatNumber(value, unit);
	return (
		<Row justify="space-between">
			<TooltipText
				baseText={<Typography.headerSecondary>{title}</Typography.headerSecondary>}
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

	// console.log(keyof(typeof coin_E));

	const coinName = match.params.coin; // From url
	const coin = getCoinForCoinName(coinName);
	const marketData = useMarketSummaryData(coin);

	// Scroll to the top of the page
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [match]);

	// Redirect to home if the param name doesn't match a coin
	if (coin === null) {
		return <Redirect to={"/"} />;
	}

	// Still loading data
	if (!marketData) {
		return null;
	}

	const coinInfo = COIN_INFO[coin];
	const etherscanLink = getEtherscanLink(marketData.cTokenAddress);

	return (
		<>
			<Row>
				<Typography.body color="text2">
					<StyledInternalLink to={"/"}>Market</StyledInternalLink>
					{" / "}
					<StyledExternalLink
						href={etherscanLink}
						content={"c" + coinName + " (" + shortAddress(marketData.cTokenAddress) + ")"}
					/>
				</Typography.body>
			</Row>
			<Row height="40px" margin={"20px 0"}>
				<CoinLogo coin={coin} size="40px" />
				<Typography.displayXL>{coinName}</Typography.displayXL>
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
						<ApyChartContainer coin={coin} includeComp={includeComp} />
					</Card>
					<SectionTitle title="Key Statistics" />
					<Card>
						<ResponsiveRow gap={theme.spacing.xl} gapSmall={theme.spacing.lg}>
							<Column gap={theme.spacing.lg}>
								<StatRow
									title={"Token price"}
									tooltipContent="The current price of the asset."
									value={marketData.underlyingPrice}
									unit="$"
								/>
								<StatRow
									title={"Reserve factor"}
									tooltipContent="The percentage of a given asset's accrued interest that gets put into a reserve pool. A 5% reserve factor = 5% of the interest paid by borrowers gets put into the pool (which provides a safety net for lenders against borrower default and liquidation)."
									value={marketData.reserveFactor}
									unit="%"
								/>
								<StatRow
									title={"Number of suppliers"}
									tooltipContent="The number of wallets currently supplying this market."
									value={marketData.numberOfSuppliers}
								/>
								<StatRow
									title={"Number of borrowers"}
									tooltipContent="The number of wallets currently borrowing this asset."
									value={marketData.numberOfBorrowers}
								/>
							</Column>
							<Column gap={theme.spacing.lg}>
								<StatRow
									title={"Collateral factor"}
									tooltipContent="Each asset has a unique collateral factor that determines the maximum amount a user can borrow from the pool, relative to how much of that asset they supplied. If the collateral factor for ETH is 50%, a user who supplied 100 ETH can borrow a maximum of 50 ETH worth of other assets at a given time."
									value={marketData.collateralFactor}
									unit="%"
								/>
								<StatRow
									title={"Total borrow"}
									tooltipContent="The total amount of funds borrowed from the market. (USD)"
									value={marketData.totalBorrow}
									unit="$"
								/>
								<StatRow
									title={"Borrow cap"}
									tooltipContent="The maximum amount of an asset that can be borrowed from the market. The borrow cap is controlled by COMP token holders."
									value={marketData.borrowCap ? marketData.borrowCap : "No limit"}
								/>
								<StatRow
									title={"Available liquidity"}
									tooltipContent="The amount of assets that are currently available to be borrowed from the market. "
									value={marketData.availableLiquidity}
									unit="$"
								/>
							</Column>
						</ResponsiveRow>
					</Card>
					<SectionTitle title={"About " + coinName} />
					<CoinInfoCard
						value={coinInfo.desc}
						whitepaper={coinInfo.whitepaper}
						website={coinInfo.website}
						twitter={coinInfo.twitter}
						coingecko={coinInfo.coingecko}
					/>
					<Card>
						{/* <MultilineChart
							data={reservesData}
							selectedCoinsAndColors={selectedCoinsAndColors}
							setHoverDate={(date) => {}}
						/> */}
					</Card>
				</Column>
				<Column gap={gap}>
					<SectionTitle title="Market Overview" />
					<StatCard
						title={"Total supplied"}
						tooltipContent="The total value (USD) of tokens supplied to the market."
						value={marketData.totalSupply}
						unit="$"
					/>
					<ProgressCard
						title={"Utilization"}
						tooltipContent="How much of the total supply is in use at a given time. If there's $100 in the pool and no one borrows anything, the utilization rate is 0%. If someone borrows $10, it's 10%, and so on. If an asset is 100% utilized, there's nothing in the pool right now - suppliers can't withdraw their original cash, and borrowers can't take out loans."
						value={marketData.utilization}
						unit="%"
						size={60}
						progressPercent={marketData.utilization}
					/>
					<StatCard
						title={"Reserves"}
						tooltipContent="Compound takes a portion of all the interest paid by borrowers and stores it in a pool that acts as  insurance for lenders against borrower default and liquidation. The reserve pool is controlled by COMP token holders."
						value={marketData.totalReserves}
						unit="$"
					/>
				</Column>
			</ResponsiveRow>
		</>
	);
}
