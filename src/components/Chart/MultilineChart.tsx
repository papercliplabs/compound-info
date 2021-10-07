// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState, useEffect, useMemo, useRef } from "react";
import styled, { useTheme } from "styled-components";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from "recharts";

import { formatNumber, formatDate } from "common/utils";
import { SHORT_TERM_DAYS } from "common/constants";
import { Typography, mediaQuerySizes, theme } from "theme";

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

function CustomTooltip({
	toolTipWidth,
	showTime,
	showValue,
	valueUnit,
	coinKeys,
	onHover,
	coordinate,
	viewBox,
	payload,
}: {
	toolTipWidth: number;
	showTime: boolean;
	showValue: boolean;
	valueUnit: string | null;
	coinKeys: (coin_name_L | "ALL")[];
	onHover: (hoverDate: number) => void;
	coordinate: any;
	viewBox: any;
	payload: any;
}): JSX.Element | null {
	const theme = useTheme();
	const hoverData = payload && payload[0] ? payload[0].payload : null;
	const hoverDate = hoverData ? hoverData.blockTime : null;
	const value = hoverData ? hoverData[coinKeys[0]] : null;
	const lastHoverData = useRef(-1);

	// If hover date updates, let parent know (after render), gaurd spamming the same value to avoid infinite loop
	useEffect(() => {
		if (hoverData != lastHoverData.current) {
			onHover(hoverData);
			lastHoverData.current = hoverData;
		}
	}, [onHover, hoverData]);

	if (hoverDate) {
		// Format the tooltip date
		const date = new Date(hoverDate);
		const formattedDate = formatDate(date, showTime, false);

		// Bound the right side of tooltip
		const rightX = coordinate.x + toolTipWidth / 2;
		const maxX = viewBox.width + viewBox.left;
		const translationX = rightX > maxX ? maxX - rightX : 0;

		return (
			<StyledTooltip toolTipWidth={toolTipWidth} translationX={translationX}>
				<Typography.caption color={theme.color.text2}>{formattedDate}</Typography.caption>
				{showValue && value != null && <Typography.caption>{formatNumber(value, valueUnit)}</Typography.caption>}
			</StyledTooltip>
		);
	} else {
		return null;
	}
}

// TODO: The x position is broken/wrong from recharts using my custom tick array
function CustomXTick({ x, y, payload, showTime, show }) {
	const width = 40;

	const theme = useTheme();
	const date = new Date(payload.value);
	const formattedDate = formatDate(date, showTime, true);

	if (!show) {
		return null;
	}

	// Render foreignObject first, as this allows us to render html and not just svg
	return (
		<foreignObject x={x - width / 2} y={y - 5} width={width} height={foreignObjectHeight}>
			<StyledCustomXTick>
				<Typography.subheader color={theme.color.text2}>{formattedDate}</Typography.subheader>
			</StyledCustomXTick>
		</foreignObject>
	);
	return null;
}

function CustomYTick({ x, y, payload, show }): JSX.Element | null {
	const theme = useTheme();
	const formattedValue = formatNumber(payload.value, "%", 2); // TODO: make so it can take generic values

	if (!show) {
		return null;
	}

	return (
		<foreignObject x={x} y={y - 15} width={foreignObjectWidth} height={foreignObjectHeight}>
			<StyledCustomYTick>
				<Typography.subheader color={theme.color.text2}>{formattedValue}</Typography.subheader>
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

/**
 * React element to display a chart with multiple lines from data according to the lineInfoList
 * @param data data to display
 * @param chartConfig the chart configuration
 * @param lineInfoList list of the line info for the lines to be plotted
 * @param unit the unit of the data being shown, this is used for the tooltip value if it is configured to be shown
 * @returns react element which is a chart with multiple lines on it
 */
export default function MultilineChart({
	data,
	chartConfig,
	lineInfoList,
	unit,
	onHover,
}: {
	data: time_series_data_entry_S[];
	chartConfig: chart_config_S;
	lineInfoList: line_info_S[];
	unit: string | null;
	onHover: (hoverData: time_series_data_entry_S | null) => void;
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

	// Used in the tooltip to display the values
	const coinKeys: (coin_name_L | "ALL")[] = [];

	const lines = lineInfoList.map((lineInfo, i) => {
		// Current value of the first entry in lineInfoList for the selected data
		let coinName = lineInfo.coin; // This will be the coin name if it is "ALL"
		if (typeof coinName !== "string") {
			// If it is not ALL, this will find the name
			coinName = COIN_INFO[coinName].name;
		}

		coinKeys.push(coinName);

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
	const showValueInTooltip = chartConfig.showValueInTooltip && lineInfoList.length === 1; // Only show value if there is 1 entry

	return (
		<ResponsiveContainer width="100%" height={chartHeight}>
			<AreaChart
				margin={{ left: 0, top: chartConfig.showValueInTooltip ? 25 : -1, bottom: chartConfig.showXTick ? 0 : -15 }}
				data={data}
			>
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
					interval={"preserveStartEnd"}
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
					content={
						<CustomTooltip
							toolTipWidth={toolTipWidth}
							showTime={showTime}
							showValue={showValueInTooltip}
							valueUnit={unit}
							coinKeys={coinKeys}
							onHover={onHover}
						/>
					}
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
	if (!data || numberOfTicks === 0 || numberOfTicks > data.length) return [];

	const ticks = Array(numberOfTicks);
	const length = data.length;
	for (let i = 0; i < numberOfTicks; i++) {
		const index = Math.floor((i / (numberOfTicks - 1)) * (length - 1));
		ticks[i] = data[index].blockTime;
	}

	return ticks;
}
