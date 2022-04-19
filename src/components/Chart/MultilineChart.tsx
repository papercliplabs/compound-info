// @ts-nocheck

import React, { useState, useEffect, useMemo, useRef } from "react";
import styled, { useTheme } from "styled-components";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from "recharts";

import { DateFormat, TimeSelector } from "common/enums";
import { ChartConfig, LineInfo } from "common/types";
import { TIME_SELECTOR_INFO } from "common/constants";

import { formatNumber, formatDate } from "common/utils";
import { Typography, mediaQuerySizes, theme } from "theme";
import Loader from "components/Loader";
import { Token } from "graphql";

// Used in custom labels and ticks
const foreignObjectWidth = 150;
const foreignObjectHeight = 25;
const yAxisWidth = 55; // When y axis is shown

const activeDotConfig = {
	r: 5, // dot radius
	strokeWidth: 0,
};

const dataLoadTimeoutMs = 15000; // ms before it is considered we have a data error

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

const NoDataWrapper = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	justify-content: center;
	text-align: center;
`;

function CustomTooltip({
	toolTipWidth,
	showTime,
	showValue,
	valueUnit,
	keys,
	dateKey,
	onHover,
	coordinate,
	viewBox,
	payload,
}: {
	toolTipWidth: number;
	showTime: boolean;
	showValue: boolean;
	valueUnit: string | null;
	keys: string;
	dateKey: string;
	onHover: (hoverDate: number) => void;
	coordinate: any;
	viewBox: any;
	payload: any;
}): JSX.Element | null {
	const theme = useTheme();
	const hoverData = payload && payload[0] ? payload[0].payload : null;
	const hoverDate = hoverData ? hoverData[dateKey] : null;
	const value = hoverData ? hoverData[keys[0]] : null;
	const lastHoverData = useRef(-1);

	// If hover date updates, let parent know (after render), gaurd spamming the same value to avoid infinite loop
	useEffect(() => {
		if (hoverData != lastHoverData.current) {
			onHover(hoverData);
			lastHoverData.current = hoverData;
		}
	}, [onHover, hoverData]);

	if (hoverDate) {
		const formattedDate = formatDate(hoverDate, showTime ? DateFormat.MMM_DD_TIME : DateFormat.MMM_DD_YY);

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

function CustomXTick({ x, y, payload, showTime, yAxisShown, show, index, visibleTicksCount }) {
	const width = 40;

	const theme = useTheme();
	const formattedDate = formatDate(payload.value, DateFormat.DD_YY);

	if (!show) {
		return null;
	}

	let xPosition = x - width / 2;

	if (index === 0) {
		// Left end point
		xPosition -= width / 2;
	} else if (index === visibleTicksCount - 1) {
		// Right end point
		if (yAxisShown) {
			xPosition += width - yAxisWidth;
		} else {
			xPosition += width / 2;
		}
	}

	// Render foreignObject first, as this allows us to render html and not just svg
	return (
		<foreignObject x={xPosition} y={y - 5} width={width} height={foreignObjectHeight}>
			<StyledCustomXTick>
				<Typography.subheader color={theme.color.text2}>{formattedDate}</Typography.subheader>
			</StyledCustomXTick>
		</foreignObject>
	);
}

function CustomYTick({ x, y, payload, show, unit }): JSX.Element | null {
	const theme = useTheme();
	let decimals = 2;
	if (payload.value > 100) {
		decimals = 0;
	}
	const formattedValue = formatNumber(payload.value, unit, decimals); // TODO: make so it can take generic values

	if (!show) {
		return null;
	}

	return (
		<foreignObject x={x} y={y - 15} width={yAxisWidth} height={foreignObjectHeight}>
			<StyledCustomYTick>
				<Typography.subheader color={theme.color.text2}>{formattedValue}</Typography.subheader>
			</StyledCustomYTick>
		</foreignObject>
	);
}

function AvgLabel({ viewBox, avg, unit }: { viewBox: any; avg: number | null; unit: string }): JSX.Element | null {
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
				<Typography.caption>{formatNumber(avg, unit)} average</Typography.caption>
			</StyledAvgLabel>
		</foreignObject>
	);
}

/**
 * React element to display a chart with multiple lines of from data over time according to the lineInfoList
 * @param data data to display on the chart
 * @param chartConfig the chart configuration
 * @param lineInfoList list of the line info for the lines to be plotted, the keys correspond to those in data
 * @param dateKey the key where the unix date in seconds is stored for the x axis
 * @param unit the unit of the data being shown, all data points should be in the same unit
 * @param onHover callback to pass the data that is currently being hovered over
 * 				  this includes the date, and the value of all the data at that date
 * @returns react element which is a chart with multiple lines on it
 */
export default function MultilineChart({
	data,
	chartConfig,
	lineInfoList,
	dateKey,
	unit,
	onHover,
}: {
	data: Record<string, number>[];
	chartConfig: ChartConfig;
	lineInfoList: LineInfo[];
	dateKey: string;
	unit: string | null;
	onHover: (hoverData: Record<string, any> | null) => void;
}): JSX.Element {
	const theme = useTheme();
	const [avg, setAvg] = useState<number | undefined>(undefined);
	const [dataLoadTimeout, setDataLoadTimeout] = useState<boolean>(false);

	const dataLoaded = data && data.length !== 0;

	useEffect(() => {
		setTimeout(() => setDataLoadTimeout(true), dataLoadTimeoutMs);
	}, []);

	useEffect(() => {
		// Only display avg if 1 coin is selected
		if (!chartConfig.showAvg || lineInfoList.length !== 1 || !data || data.length === 0) {
			setAvg(null);
		} else {
			const avg = getAvg(data, lineInfoList[0].key);
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

	let hasData = false;
	const lines = lineInfoList.map((lineInfo, i) => {
		hasData =
			(dataLoaded &&
				data.length > 1 &&
				data[data.length - 1][lineInfo.key] != undefined &&
				data[data.length - 2][lineInfo.key] != undefined) ||
			hasData;
		return (
			<Area
				type="monotone"
				dataKey={lineInfo.key}
				stroke={lineInfo.color}
				strokeWidth={2}
				connectNulls={true}
				key={i}
				dot={false}
				activeDot={activeDotConfig}
				isAnimationActive={chartConfig.animate}
				animationDuration={750}
				fill={lineInfoList.length === 1 && chartConfig.showAreaGradient ? `url(#areaGrad${randomId})` : "#00000000"}
			/>
		);
	});

	const maxDate = dataLoaded && data.length > 1 ? data[data.length - 1][dateKey] : 0;
	const { minDate, minDateIndex } = useMemo(() => {
		return dataLoaded
			? findMinDate(
					data,
					lineInfoList.map((entry) => entry.key),
					dateKey
			  )
			: { minDate: 0, minDateIndex: 0 };
	}, [data, lineInfoList, dateKey]);

	const xAxisTicks = useMemo(() => {
		return getXTicks(data, chartConfig.numberOfXAxisTicks, dateKey, minDateIndex);
	}, [data, chartConfig.numberOfXAxisTicks, dateKey, minDateIndex]);

	const chartHeight =
		window.innerWidth < mediaQuerySizes.small ? (chartConfig.baseChartHeightPx * 2) / 3 : chartConfig.baseChartHeightPx;

	const keys = useMemo(() => {
		return lineInfoList.map((info) => info.key);
	}, [lineInfoList]);

	const showTime = shouldShowTime(maxDate, minDate);
	const toolTipWidth = showTime ? 150 : 90;
	const toolTipOffset = -toolTipWidth / 2; // Center it on the cursor
	const showValueInTooltip = chartConfig.showValueInTooltip && lineInfoList.length === 1; // Only show value if there is 1 entry

	return (
		<ResponsiveContainer width="100%" height={chartHeight}>
			{dataLoaded && hasData ? (
				<AreaChart
					height={chartHeight}
					margin={{
						left: 10,
						top: chartConfig.showValueInTooltip ? 25 : -1,
						right: 10,
						bottom: chartConfig.showXTick ? 0 : -15,
					}}
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
						dataKey={dateKey}
						tick={<CustomXTick showTime={showTime} show={chartConfig.showXTick} yAxisShown={chartConfig.showYTick} />}
						axisLine={chartConfig.showXAxis}
						ticks={xAxisTicks}
						tickLine={false}
						interval={"preserveStartEnd"}
						type="number"
						domain={[minDate, maxDate]}
						allowDataOverflow={true}
					/>
					<YAxis
						datekey={lineInfoList[0]}
						padding={{ top: 40 }} // Space for tooltip above the data
						orientation="right"
						tick={<CustomYTick show={chartConfig.showYTick} unit={unit} />}
						axisLine={chartConfig.showYAxis}
						width={chartConfig.showYTick ? yAxisWidth : 0}
						tickLine={false}
						type="number"
					/>
					<Tooltip
						cursor={cursorConfig}
						position={{ y: 0 }} // Set to the top of chart
						content={
							<CustomTooltip
								toolTipWidth={toolTipWidth}
								showTime={showTime}
								showValue={showValueInTooltip}
								dateKey={dateKey}
								valueUnit={unit}
								keys={keys}
								onHover={onHover}
							/>
						}
						isAnimationActive={false}
						offset={toolTipOffset}
					/>
					{lines}
					<ReferenceLine
						y={avg}
						stroke={theme.color.bg5}
						strokeDasharray="5 5"
						label={<AvgLabel avg={avg} unit={unit} />}
					/>
				</AreaChart>
			) : (
				<>
					{dataLoadTimeout ? (
						<NoDataWrapper>
							{!hasData && dataLoaded ? (
								<Typography.header color={theme.color.text2}>No data in selected time range</Typography.header>
							) : (
								<Typography.header color={theme.color.text2}>Error loading data</Typography.header>
							)}
						</NoDataWrapper>
					) : (
						<Loader size="100px" />
					)}
				</>
			)}
		</ResponsiveContainer>
	);
}

/**
 * Compute the average of the values of the specied key in data
 * @param data time series data entry list
 * @param key to compute the average for
 * @returns average of the values at key in data
 */
function getAvg(data: Record<string, number>[], key: string): number | null {
	if (data.length === 0) {
		return null;
	}

	// Count for the number of values contributing to the average
	let count = 0;

	let avg: number = data.reduce((acc: number, obj) => {
		if (obj[key]) {
			const nextVal = Number(obj[key]) ?? 0;
			count += 1;
			return acc + nextVal;
		} else {
			return acc;
		}
	}, 0);
	avg /= count;

	return avg;
}

/**
 * Helper to compute if the data is over a short enough time frame to show the time of day in the tooltip and xaxis
 * @param newestDate oldest date in unix secconds
 * @param oldestDate oldest date in unix secconds
 * @returns true if that chart should show time on hover and xaxis (if configured to do so), false otherwise
 */
function shouldShowTime(newestDate: number, oldestDate: number): boolean {
	const secDiff = newestDate - oldestDate;
	const dayDiff = secDiff / (60 * 60 * 24);
	return dayDiff < TIME_SELECTOR_INFO[TimeSelector.ONE_WEEK].days; // If less than a week, show the time
}

/**
 * Find the minimum date with the first valid piece of data with a key in lineInfoList
 * @param data the data to query for the min data
 * @param lineInfoList list of line info
 * @return the minimum date and index of that date corresponding to the value at dateKey in the first data entry with a data key in lineInfoList
 */
function findMinDate(
	data: Record<string, number>[],
	dataKeys: Token[],
	dateKey: string
): { minDate: number; minDateIndex: number } {
	for (let i = 0; i < data.length; i++) {
		const keysInData = Object.keys(data[i]);
		for (let j = 0; j < dataKeys.length; j++) {
			if (keysInData.includes(dataKeys[j])) {
				return { minDate: data[i][dateKey], minDateIndex: i };
			}
		}
	}

	// Not found
	return { minDate: 0, minDateIndex: 0 };
}

/**
 * Helper to compute the tick indicies in the data given the number of ticks to show
 * @param data time series data
 * @param numberOfTicks number of ticks to show
 * @param startIndex the minimum index of data that will be shown, this is used as the left endpoint when calculating the x tick position
 * @returns array of indicies in the time series data of the values to put on each tick
 */
function getXTicks(data: Record<Token, number>[], numberOfTicks: number, dateKey: string, startIndex: number) {
	if (!data || numberOfTicks === 0 || numberOfTicks > data.length) return [];

	const ticks = Array(numberOfTicks);
	const length = data.length - startIndex;
	for (let i = 0; i < numberOfTicks; i++) {
		const index = Math.floor((i / (numberOfTicks - 1)) * (length - 1)) + startIndex;
		ticks[i] = data[index][dateKey];
	}

	return ticks;
}
