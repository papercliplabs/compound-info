import React, { useState, useEffect, useCallback } from "react";
import { Redirect } from "react-router-dom";
import { useTheme } from "styled-components";

import ChartContainer from "components/ChartContainer";
import { useApyData, useSummaryData } from "data/hooks";
import Card, { StatCard, ProgressCard, CoinInfoCard } from "components/Card";
import Row, { ResponsiveRow } from "components/Row";
import Column from "components/Column";
import { Typography } from "theme";
import { APY_DATA_SELECTORS } from "common/constants";
import { formatNumber, getCoinInfo, getEtherscanLink, shortAddress } from "common/utils";
import { StyledInternalLink, StyledExternalLink } from "components/Link";
import { SectionTitle, StyledDisclaimer } from "components/SpecialText";
import { CoinLogo } from "components/Logo";
import TooltipText from "components/TooltipText";
import { ToggleButton } from "components/Button";

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
export default function Market({ match }) {
	const theme = useTheme();
	const gap = theme.spacing.md;
	const activeCoinName = match.params.coin;
	const activeCoin = getCoinInfo(activeCoinName);
	const coinData = useSummaryData(activeCoinName);
	const [includeComp, setIncludeComp] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [match]);

	// Redirect to home if the param name doesn't match a coin
	if (!activeCoin) {
		return <Redirect to={"/"} />;
	}

	if (!coinData) {
		return null; // Loading the summary data
	}

	const etherscanLink = getEtherscanLink(coinData.cTokenAddress);

	return (
		<>
			<Row>
				<Typography.body color="text2">
					<StyledInternalLink to={"/"}>Market</StyledInternalLink>
					{" / "}
					<StyledExternalLink
						href={etherscanLink}
						content={"c" + activeCoin.name + " (" + shortAddress(coinData.cTokenAddress) + ")"}
					/>
				</Typography.body>
			</Row>
			<Row height="40px" margin={"20px 0"}>
				<CoinLogo name={activeCoinName} size="40px" />
				<Typography.displayXL>{activeCoin.name}</Typography.displayXL>
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
						<ChartContainer
							dataSelectors={APY_DATA_SELECTORS}
							activeCoin={activeCoin}
							useData={useApyData}
							includeComp={includeComp}
						/>
					</Card>
					<SectionTitle title="Key Statistics" />
					<Card>
						<ResponsiveRow gap={theme.spacing.xl} gapSmall={theme.spacing.lg}>
							<Column gap={theme.spacing.lg}>
								<StatRow
									title={"Token price"}
									tooltipContent="The current price of the asset."
									value={coinData.underlyingPrice}
									unit="$"
								/>
								<StatRow
									title={"Reserve factor"}
									tooltipContent="The percentage of a given asset's accrued interest that gets put into a reserve pool. A 5% reserve factor = 5% of the interest paid by borrowers gets put into the pool (which provides a safety net for lenders against borrower default and liquidation)."
									value={coinData.reserveFactor}
									unit="%"
								/>
								<StatRow
									title={"Number of suppliers"}
									tooltipContent="The number of wallets currently supplying this market."
									value={coinData.numberOfSuppliers}
								/>
								<StatRow
									title={"Number of borrowers"}
									tooltipContent="The number of wallets currently borrowing this asset."
									value={coinData.numberOfBorrowers}
								/>
							</Column>
							<Column gap={theme.spacing.lg}>
								<StatRow
									title={"Collateral factor"}
									tooltipContent="Each asset has a unique collateral factor that determines the maximum amount a user can borrow from the pool, relative to how much of that asset they supplied. If the collateral factor for ETH is 50%, a user who supplied 100 ETH can borrow a maximum of 50 ETH worth of other assets at a given time."
									value={coinData.collateralFactor}
									unit="%"
								/>
								<StatRow
									title={"Total borrow"}
									tooltipContent="The total amount of funds borrowed from the market. (USD)"
									value={coinData.totalBorrow}
									unit="$"
								/>
								<StatRow
									title={"Borrow cap"}
									tooltipContent="The maximum amount of an asset that can be borrowed from the market. The borrow cap is controlled by COMP token holders."
									value={coinData.borrowCap ? coinData.borrowCap : "No limit"}
								/>
								<StatRow
									title={"Available liquidity"}
									tooltipContent="The amount of assets that are currently available to be borrowed from the market. "
									value={coinData.availableLiquidity}
									unit="$"
								/>
							</Column>
						</ResponsiveRow>
					</Card>
					<SectionTitle title={"About " + activeCoinName} />
					<CoinInfoCard
						value={activeCoin.desc}
						whitepaper={activeCoin.whitepaper}
						website={activeCoin.website}
						twitter={activeCoin.twitter}
						coingecko={activeCoin.coingecko}
					/>
				</Column>
				<Column gap={gap}>
					<SectionTitle title="Market Overview" />
					<StatCard
						title={"Total supplied"}
						tooltipContent="The total value (USD) of tokens supplied to the market."
						value={coinData.totalSupply}
						unit="$"
					/>
					<ProgressCard
						title={"Utilization"}
						tooltipContent="How much of the total supply is in use at a given time. If there's $100 in the pool and no one borrows anything, the utilization rate is 0%. If someone borrows $10, it's 10%, and so on. If an asset is 100% utilized, there's nothing in the pool right now - suppliers can't withdraw their original cash, and borrowers can't take out loans."
						value={coinData.utilization}
						unit="%"
						size={60}
						progressPercent={coinData.utilization}
					/>
					<StatCard
						title={"Reserves"}
						tooltipContent="Compound takes a portion of all the interest paid by borrowers and stores it in a pool that acts as  insurance for lenders against borrower default and liquidation. The reserve pool is controlled by COMP token holders."
						value={coinData.totalReserves}
						unit="$"
					/>
				</Column>
			</ResponsiveRow>
		</>
	);
}

// Example of coinData:
// {
// 		availableLiquidity: 2407457643.3461146
//		borrowCap: 0
//		cTokenAddress: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5"
//		collateralFactor: 0.75
//		distributionBorrowApy: 0.09400693398056958
//		distributionSupplyApy: 0.0033289338526691914
//		marketSize: 2532336280.5858564
//		maxBorrow: 2532336280.5858564
//		name: "ETH"
//		numberOfBorrowers: 899
//		numberOfSuppliers: 63142
//		reserveFactor: 0.2
//		totalBorrow: 124878637.2397417
//		totalReserves: 793847.2521822633
//		totalSupply: 3376448374.1144753
//		totalValueLocked: 3251569736.8747334
//		underlyingAddress: null
//		underlyingPrice: 2373.9900000000016
//		utilization: 0.0493136074371809
//	}
