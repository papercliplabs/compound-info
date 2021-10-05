import React, { useState, useEffect, useMemo } from "react";
import styled, { useTheme } from "styled-components";

import { Typography } from "theme";
import { useMarketSummaryData, useProtocolSummaryData } from "data/hooks";
import compoundLogo from "assets/compoundLogo.svg";
import Logo from "components/Logo";
import { SectionTitle, StyledDisclaimer } from "components/SpecialText";
import Row, { ResponsiveRow } from "components/Row";
import Card, { StatCard, ProgressCard } from "components/Card";
import CoinTable from "components/CoinTable";
import { ToggleButton } from "components/Button";
import TooltipText from "components/TooltipText";
import TimeSeriesChart from "components/TimeSeriesChart";

import { time_selector_E, time_series_data_selector_E } from "common/enums";
import { market_summary_data_S, market_summary_column_info_S, chart_config_S } from "common/interfaces";

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
	const marketSummaryDataList = useMarketSummaryData() as market_summary_data_S[];
	const protocolSummaryData = useProtocolSummaryData();

	// Scroll to the top of the page on first visit
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// Columns in order, which are used to display in the table
	const tableDataKeysAndUnits: market_summary_column_info_S[] = useMemo(() => {
		return includeComp
			? [
					{ name: "Asset", key: "name" },
					{ name: "Total Supply", key: "totalSupplyUsd", unit: "$" },
					{ name: "Supply APY", key: "totalSupplyApy", unit: "%" },
					{ name: "Total Borrow", key: "totalBorrowUsd", unit: "$" },
					{ name: "Borrow APY", key: "totalBorrowApy", unit: "%" },
			  ]
			: [
					{ name: "Asset", key: "name" },
					{ name: "Total Supply", key: "totalSupplyUsd", unit: "$" },
					{ name: "Supply APY", key: "supplyApy", unit: "%" },
					{ name: "Total Borrow", key: "totalBorrowUsd", unit: "$" },
					{ name: "Borrow APY", key: "borrowApy", unit: "%" },
			  ];
	}, [includeComp]);

	if (!marketSummaryDataList || !protocolSummaryData) {
		return null; // Loading summary data still
	}

	// Examples of using time series chart
	function hoverCallback(date: Date | null) {
		// console.log(date);
	}

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
	};

	return (
		<>
			<Row height="40px" margin={"20px 0"}>
				<Logo src={compoundLogo} size="40px" />
				<Typography.displayXL>Compound Protocol</Typography.displayXL>
			</Row>
			<SectionTitle title="Compound Overview" />
			<ResponsiveRow gap={gap}>
				<Card>
					<TimeSeriesChart
						chartConfig={chartConfig}
						lineInfoList={[{ coin: "ALL", color: theme.color.lineChartColors[0] }]}
						dataSelectors={[time_series_data_selector_E.SUPPLY_USD, time_series_data_selector_E.BORROW_USD]}
						timeSelectors={[time_selector_E.ALL]}
						onChartHover={hoverCallback}
					/>
				</Card>
				<Card>
					<TimeSeriesChart
						chartConfig={chartConfig}
						lineInfoList={[{ coin: "ALL", color: theme.color.lineChartColors[1] }]}
						dataSelectors={[time_series_data_selector_E.RESERVES_USD]}
						timeSelectors={[time_selector_E.ALL]}
						onChartHover={hoverCallback}
					/>
				</Card>
			</ResponsiveRow>
			<ResponsiveRow gap={gap}>
				<StatCard
					title={"Total unique active users"}
					tooltipContent="Number of non-duplicate users between all markets"
					value={protocolSummaryData.numberOfUniqueSuppliers}
				/>
				<ProgressCard
					title={"Utilization"}
					tooltipContent="How much of the total supply is in use at a given time. If there's $100 in the pool and no one borrows anything, the utilization rate is 0%. If someone borrows $10, it's 10%, and so on. If an asset is 100% utilized, there's nothing in the pool right now - suppliers can't withdraw their original cash, and borrowers can't take out loans."
					value={protocolSummaryData.utilization}
					unit="%"
					size={60}
				/>
				<StatCard
					title={"Total borrowed"}
					tooltipContent="The total amount of funds borrowed from Compound. (USD)"
					value={protocolSummaryData.totalBorrowUsd}
					unit="$"
				/>
			</ResponsiveRow>
			<Row>
				<SectionTitle title="All Markets" width="auto" />
				<Row justify="flex-end" height="100%" padding="20px 0 0 0" margin="0 0 8px 0">
					<TooltipText
						baseText={<Typography.body color="text2">Include COMP</Typography.body>}
						tooltipContent="Toggle to include the COMP token distribution in the APY's. Note that a negative borrow rate means that the Compound protocol pays you."
					/>
					<ToggleButton active={includeComp} onClick={() => setIncludeComp(!includeComp)} />
				</Row>
			</Row>
			<TableCard>
				<CoinTable data={marketSummaryDataList} columnInfoList={tableDataKeysAndUnits} />
			</TableCard>
		</>
	);
}
