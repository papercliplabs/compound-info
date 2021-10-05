// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState, useEffect, useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from "recharts";

import { formatNumber, formatDate } from "common/utils";
import { SHORT_TERM_DAYS } from "common/constants";
import { Typography, mediaQuerySizes } from "theme";

import { coin_E } from "common/enums";
import { line_info_S, chart_config_S, time_series_data_entry_S } from "common/interfaces";
import { TIME_SERIES_DATA_SELECTOR_INFO, COIN_INFO } from "common/constants";

// Used in custom labels and ticks
const foreignObjectWidth = 150;
const foreignObjectHeight = 25;

const activeDotConfig = {
	r: 5, // dot radius
	strokeWidth: 0,
};

const StyledTooltip = styled.div`
	text-align: center;
	padding: 5px 0;
	width: ${({ toolTipWidth }) => toolTipWidth}px;
	background-color: ${({ theme }) => theme.color.bg1};
	transform: translate(${({ translationX }) => translationX}px);
`;

const StyledCustomXTick = styled.div`
	text-align: center;
`;

const StyledCustomYTick = styled.div`
	text-align: left;
`;

const StyledAvgLabel = styled.div`
	display: inline-block;
	padding: 2px 8px;
	background-color: ${({ theme }) => theme.color.bg0 + "A0"};
	backdrop-filter: blur(2px);
	text-align: left;
`;

function CustomTooltip({ coordinate, toolTipWidth, viewBox, showTime, payload, onUpdate }) {
	const hoverDate = payload ? payload[0]?.payload.blockTime : null;

	// If hover date updates, let parent know (after render)
	useEffect(() => {
		onUpdate(hoverDate);
	}, [hoverDate, onUpdate]);

	if (hoverDate) {
		// Format the tooltip date
		const date = new Date(hoverDate);
		const formattedDate = formatDate(date, showTime);

		// Bound the right side of tooltip
		const rightX = coordinate.x + toolTipWidth / 2;
		const maxX = viewBox.width + viewBox.left;
		const translationX = rightX > maxX ? maxX - rightX : 0;

		return (
			<StyledTooltip toolTipWidth={toolTipWidth} translationX={translationX}>
				<Typography.subheader>{formattedDate}</Typography.subheader>
			</StyledTooltip>
		);
	} else {
		return null;
	}
}

function CustomXTick({ x, y, payload, showTime, show }) {
	const date = new Date(payload.value);
	const formattedDate = formatDate(date, showTime);

	if (!show) {
		return null;
	}

	// Render foreignObject first, as this allows us to render html and not just svg
	return (
		<foreignObject x={x - foreignObjectWidth / 2} y={y - 5} width={foreignObjectWidth} height={foreignObjectHeight}>
			<StyledCustomXTick>
				<Typography.subheader>{formattedDate}</Typography.subheader>
			</StyledCustomXTick>
		</foreignObject>
	);
	return null;
}

function CustomYTick({ x, y, payload, show }) {
	const formattedValue = formatNumber(payload.value, "%", 2); // TODO: make so it can take generic values

	if (!show) {
		return null;
	}

	return (
		<foreignObject x={x} y={y - 15} width={foreignObjectWidth} height={foreignObjectHeight}>
			<StyledCustomYTick>
				<Typography.subheader>{formattedValue}</Typography.subheader>
			</StyledCustomYTick>
		</foreignObject>
	);
}

function AvgLabel({ viewBox, avg }: { viewBox: any; avg: number | null }): JSX.Element | null {
	if (!avg) {
		return null;
	}

	return (
		<foreignObject
			x={viewBox.x}
			y={viewBox.y - foreignObjectHeight}
			width={foreignObjectWidth}
			height={foreignObjectHeight}
		>
			<StyledAvgLabel>
				<Typography.caption>{formatNumber(avg, "%")} average</Typography.caption>
			</StyledAvgLabel>
		</foreignObject>
	);
}

export default function MultilineChart({
	data,
	chartConfig,
	lineInfoList,
	onHover,
}: {
	data: time_series_data_entry_S[];
	chartConfig: chart_config_S;
	lineInfoList: line_info_S[];
	onHover?: (hoverData: Date | null) => void;
}): JSX.Element {
	const theme = useTheme();
	const [avg, setAvg] = useState<number | null>(null);

	useEffect(() => {
		// Only display avg if 1 coin is selected
		if (!chartConfig.showAvg || lineInfoList.length !== 1) {
			setAvg(null);
		} else {
			const avg = getAvg(data, lineInfoList[0].coin);
			setAvg(avg);
		}
	}, [data, lineInfoList]);

	const cursorConfig = useMemo(() => {
		return {
			stroke: theme.color.bg4,
			strokeWidth: 2,
			strokeDasharray: "5,5",
		};
	}, [theme]);

	// Used to make the linear gradient def for the id different
	const randomId = Math.floor(Math.random() * 10000);

	const lines = lineInfoList.map((lineInfo, i) => {
		// Current value of the first entry in lineInfoList for the selected data
		let coinName = lineInfo.coin; // This will be the coin name if it is "ALL"
		if (typeof coinName !== "string") {
			// If it is not ALL, this will find the name
			coinName = COIN_INFO[coinName].name;
		}

		return (
			<Area
				type="monotone"
				dataKey={coinName}
				stroke={lineInfo.color}
				strokeWidth={2}
				key={i}
				dot={false}
				activeDot={activeDotConfig}
				isAnimationActive={chartConfig.animate}
				animationDuration={750}
				fill={lineInfoList.length === 1 && chartConfig.showAreaGradient ? `url(#areaGrad${randomId})` : "#00000000"}
			/>
		);
	});

	const showTime = shouldShowTime(data);
	const toolTipWidth = showTime ? 150 : 90;
	const toolTipOffset = -toolTipWidth / 2; // Center it on the cursor
	const xAxisTicks = getXTicks(data, chartConfig.numberOfXAxisTicks);
	const chartHeight = window.innerWidth < mediaQuerySizes.small ? 200 : 300;

	return (
		<ResponsiveContainer width="100%" height={chartHeight}>
			<AreaChart margin={{ left: 0, top: -1, bottom: chartConfig.showXTick ? 0 : -30 }} data={data}>
				<CartesianGrid
					vertical={chartConfig.showVerticalGrid}
					horizontal={chartConfig.showHorizontalGrid}
					width="1"
					strokeWidth={0.1}
				/>
				<defs>
					<linearGradient id={"areaGrad" + randomId} x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor={lineInfoList[0].color} stopOpacity={0.3} />
						<stop offset="100%" stopColor={lineInfoList[0].color} stopOpacity={0} />
					</linearGradient>
				</defs>
				<XAxis
					dataKey="blockTime"
					tick={<CustomXTick showTime={showTime} show={chartConfig.showXTick} />}
					axisLine={chartConfig.showXAxis}
					ticks={xAxisTicks}
					tickLine={chartConfig.showXTick}
				/>
				<YAxis
					datekey="price"
					padding={{ top: 40 }} // Space for tooltip above the data
					orientation="right"
					tick={<CustomYTick show={chartConfig.showYTick} />}
					axisLine={chartConfig.showYAxis}
					width={chartConfig.showYTick ? 55 : 0}
					tickLine={false}
				/>
				<Tooltip
					cursor={cursorConfig}
					position={{ y: 0 }} // Set to the top of chart
					content={<CustomTooltip toolTipWidth={toolTipWidth} showTime={showTime} onUpdate={onHover} />}
					isAnimationActive={false}
					offset={toolTipOffset}
				/>
				{lines}
				<ReferenceLine y={avg} stroke={theme.color.bg5} strokeDasharray="5 5" label={<AvgLabel avg={avg} />} />
			</AreaChart>
		</ResponsiveContainer>
	);
}

/**
 * Compute the average of the list of time series data entries for the specified coin
 * @param data time series data entry list
 * @param coin coin to compute the average for
 * @returns average of the time series data entry list for the specifed coin
 */
function getAvg(data: time_series_data_entry_S[], coin: coin_E): number | null {
	if (data.length === 0) {
		return null;
	}

	let avg: number = data.reduce((acc: number, obj: time_series_data_entry_S) => {
		const nextVal = obj[COIN_INFO[coin].name] ?? 0;
		return acc + nextVal;
	}, 0);
	avg /= data.length;

	return avg;
}

/**
 * Helper to compute if the data is over a short enough time frame to show the time of day in the tooltip and xaxis
 * @param data time series data entry list to check the time for
 * @returns true if that chart should show time on hover and xaxis (if configured to do so), false otherwise
 */
function shouldShowTime(data: time_series_data_entry_S[]): boolean {
	if (!data) return false;

	const lastDate = new Date(data.slice(-1)[0].blockTime);
	const firstDate = new Date(data[0].blockTime);
	const dayDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24); // ms diff converted to days
	return dayDiff < SHORT_TERM_DAYS;
}

/**
 * Helper to compute the tick indicies in the data given the number of ticks to show
 * @param data time series data
 * @param numberOfTicks number of ticks to show
 * @returns array of indicies in the time series data of the values to put on each tick
 */
function getXTicks(data: time_series_data_entry_S[], numberOfTicks: number) {
	if (!data || numberOfTicks === 0) return [];

	const ticks = Array(numberOfTicks);
	const inc = data.length / numberOfTicks;
	const offset = (data.length - inc * (numberOfTicks - 1)) / 2;
	for (let i = 0; i < numberOfTicks; i++) {
		const index = Math.floor(inc * i + offset);
		ticks[i] = data[index].blockTime;
	}

	return ticks;
}
