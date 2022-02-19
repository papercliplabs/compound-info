// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import styled, { useTheme } from "styled-components";

import { TimeSelector, MarketDataSelector, ProtocolDataSelector, DataType } from "common/enums";

import { Typography } from "theme";
import compoundLogo from "assets/compoundLogo.svg";
import Logo from "components/Logo";
import Row, { ResponsiveJustifyRow, ResponsiveRow } from "components/Row";
import Card, { StatCard, ProgressCard } from "components/Card";
import TokenTable from "components/TokenTable";
import { ToggleButton } from "components/Button";
import TooltipText from "components/TooltipText";
import TimeSeriesChart from "components/Chart/TimeSeriesChart";

import { useMarketSummaryData, useProtocolSummaryData } from "data/hooks";

const TableCard = styled(Card)`
	padding: ${({ theme }) => theme.spacing.md + " " + theme.spacing.lg};
	${({ theme }) => theme.mediaWidth.small`
		padding: ${theme.spacing.md + " " + theme.spacing.md};
	`}
`;

export default function Overview(): JSX.Element | null {
	const theme = useTheme();
	const gap = theme.spacing.md;
	const [includeComp, setIncludeComp] = useState<boolean>(false);

	const protocolSummaryData = useProtocolSummaryData();
	const marketSummaryData = useMarketSummaryData();

	const protocolSummaryDataLoading = !protocolSummaryData;

	// Scroll to the top of the page on first visit
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const tokenTableDataSelectors = useMemo(() => {
		if (includeComp) {
			return [
				MarketDataSelector.TOTAL_SUPPLY_USD,
				MarketDataSelector.TOTAL_SUPPLY_APY,
				MarketDataSelector.TOTAL_BORROW_USD,
				MarketDataSelector.TOTAL_BORROW_APY,
			];
		} else {
			return [
				MarketDataSelector.TOTAL_SUPPLY_USD,
				MarketDataSelector.SUPPLY_APY,
				MarketDataSelector.TOTAL_BORROW_USD,
				MarketDataSelector.BORROW_APY,
			];
		}
	}, [includeComp]);

	const chartConfig: chart_config_S = {
		showAvg: false,
		showXAxis: false,
		showYAxis: false,
		showXTick: true,
		showYTick: false,
		showHorizontalGrid: false,
		showVerticalGrid: false,
		showAreaGradient: true,
		numberOfXAxisTicks: 3,
		showCurrentValue: true,
		animate: true,
		showValueInTooltip: true,
		baseChartHeightPx: 200,
	};

	return (
		<>
			<Row height="40px" margin={"20px 0"}>
				<Logo src={compoundLogo} size="40px" />
				<Typography.displayXL>Compound Protocol</Typography.displayXL>
			</Row>
			<Row>
				<Typography.displayS>All Markets</Typography.displayS>
			</Row>
			<ResponsiveRow gap={gap} align="streach">
				<Card height="auto">
					<TimeSeriesChart
						chartConfig={chartConfig}
						lineInfoList={[{ key: "value", color: theme.color.lineChartColors[0] }]}
						dataType={DataType.PROTOCOL}
						dataSelectorOptions={[ProtocolDataSelector.TOTAL_SUPPLY_USD, ProtocolDataSelector.TOTAL_BORROW_USD]}
						timeSelectorOptions={[TimeSelector.ALL]}
					/>
				</Card>
				<Card height="auto">
					<TimeSeriesChart
						chartConfig={chartConfig}
						lineInfoList={[{ key: "value", color: theme.color.lineChartColors[1] }]}
						dataType={DataType.PROTOCOL}
						dataSelectorOptions={[ProtocolDataSelector.TOTAL_RESERVES_USD]}
						timeSelectorOptions={[TimeSelector.ALL]}
					/>
				</Card>
			</ResponsiveRow>
			<ResponsiveRow gap={gap}>
				{/* <StatCard
					title={"Total unique suppliers"}
					tooltipContent="Number of non-duplicate suppliers between all markets, this is also the total number of unique users since each borrower must be a supplier."
					value={protocolSummaryData.numberOfUniqueSuppliers}
				/> */}
				<StatCard
					title={"Total Supplied"}
					tooltipContent="Sum total of all supplied assets to the protocol in USD"
					value={protocolSummaryData ? protocolSummaryData.totalSupplyUsd : 0.0}
					unit="$"
					loading={protocolSummaryDataLoading}
				/>
				<StatCard
					title={"Total Borrowed"}
					tooltipContent="Sum total of all borrowed assets to the protocol in USD"
					value={protocolSummaryData ? protocolSummaryData.totalBorrowUsd : 0.0}
					unit="$"
					loading={protocolSummaryDataLoading}
				/>
				<ProgressCard
					title={"Utilization"}
					tooltipContent="How much of the total supply is in use at a given time. If there's $100 in the pool and no one borrows anything, the utilization rate is 0%. If someone borrows $10, it's 10%, and so on. If an asset is 100% utilized, there's nothing in the pool right now - suppliers can't withdraw their original cash, and borrowers can't take out loans."
					value={protocolSummaryData ? protocolSummaryData.utilization : 0.0}
					unit="%"
					size={60}
					loading={protocolSummaryDataLoading}
				/>
			</ResponsiveRow>
			<ResponsiveRow xs={true}>
				<Row>
					<Typography.displayS>All Markets</Typography.displayS>
				</Row>
				<ResponsiveJustifyRow justifyLarge="flex-end" justifySmall="flex-end" justifyExtraSmall="flex-start">
					<TooltipText
						baseText={<Typography.body color={theme.color.text2}>Include COMP</Typography.body>}
						tooltipContent="Toggle to include the COMP token distribution in the APY's. Note that a negative borrow rate means that the Compound protocol pays you."
					/>
					<ToggleButton active={includeComp} onClick={() => setIncludeComp(!includeComp)} />
				</ResponsiveJustifyRow>
			</ResponsiveRow>
			<TableCard>
				<TokenTable data={marketSummaryData} dataSelectors={tokenTableDataSelectors} />
			</TableCard>
		</>
	);
}
