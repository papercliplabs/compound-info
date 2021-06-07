import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { formatNumber, formatDate } from 'utils';
import { SHORT_TERM_DAYS } from 'constants/index';
import { Typography, mediaQuerySizes } from 'theme';

// Used in custom labels and ticks
const foreignObjectWidth = 100;
const foreignObjectHeight = 30;
const numberOfXAxisTicks = 3;

const cursorConfig = {
	stroke: 'gray', // Can't use theme here
	strokeWidth: 2,
	strokeDasharray: '5,5',
};

const activeDotConfig = {
	r: 5, // dot radius
	strokeWidth: 0,
};

const StyledTooltip = styled.div`
	background-color: red;
	text-align: center;
	padding: 5px 0;
	width: ${({ toolTipWidth }) => toolTipWidth}px;
	border: solid ${({ theme }) => theme.border.thickness + ' ' + theme.color.border1};
	border-radius: ${({ theme }) => theme.radius.lg};
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
	padding: 0 8px;
	border-radius: ${({ theme }) => theme.radius.lg};
	background-color: ${({ theme }) => theme.color.bg0};
	text-align: left;
`;

function CustomTooltip({ coordinate, toolTipWidth, viewBox, setHoverDate, showTime, payload }) {
	const hoverDate = payload ? payload[0]?.payload.blockTime : null;

	// If hover date updates, let parent know (after render)
	useEffect(() => {
		setHoverDate(hoverDate);
	}, [hoverDate, setHoverDate]);

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

function CustomXTick({ x, y, payload, showTime }) {
	const date = new Date(payload.value);
	const formattedDate = formatDate(date, showTime);
	// Render foreignObject first, as this allows us to render html and not just svg

	// Not rendering X-axis titles
	//	return (
	//		<foreignObject x={x - foreignObjectWidth / 2} y={y - 5} width={foreignObjectWidth} height={foreignObjectHeight}>
	//			<StyledCustomXTick>
	//				<Typography.subheader>{formattedDate}</Typography.subheader>
	//			</StyledCustomXTick>
	//		</foreignObject>
	//	);
	return null;
}

function CustomYTick({ x, y, payload }) {
	let formattedValue = formatNumber(payload.value, '%', 2); // TODO: make so it can take generic values
	return (
		<foreignObject x={x} y={y - 15} width={foreignObjectWidth} height={foreignObjectHeight}>
			<StyledCustomYTick>
				<Typography.subheader>{formattedValue}</Typography.subheader>
			</StyledCustomYTick>
		</foreignObject>
	);
}

function AvgLabel({ viewBox, avg }) {
	return (
		<foreignObject
			x={viewBox.x + viewBox.width}
			y={viewBox.y - foreignObjectHeight / 2}
			width={foreignObjectWidth}
			height={foreignObjectHeight}
		>
			<StyledAvgLabel>
				<Typography.subheader>{formatNumber(avg, '%')}</Typography.subheader>
			</StyledAvgLabel>
		</foreignObject>
	);
}

export default function MultilineChart({ data, selectedCoinsAndColors, setHoverDate }) {
	const theme = useTheme();
	const [avg, setAvg] = useState(null);

	useEffect(() => {
		// Only display avg if 1 coin is selected
		if (selectedCoinsAndColors.length !== 1) {
			setAvg(null);
		} else {
			const avg = getAvg(data, selectedCoinsAndColors[0].name);
			setAvg(avg);
		}
	}, [data, selectedCoinsAndColors]);

	function shouldShowTime() {
		if (!data) return false;

		const lastDate = new Date(data.slice(-1)[0].blockTime);
		const firstDate = new Date(data[0].blockTime);
		const dayDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24); // ms diff converted to days
		return dayDiff < SHORT_TERM_DAYS;
	}

	// Render
	const lines = selectedCoinsAndColors.map((coin, i) => {
		return (
			<Area
				type="monotone"
				dataKey={coin.name}
				stroke={coin.color}
				strokeWidth={2}
				key={i}
				dot={false}
				activeDot={activeDotConfig}
				isAnimationActive={true}
				animationDuration={750}
				fill={avg ? 'url(#areaGrad)' : '#00000000'}
			/>
		);
	});

	const showTime = shouldShowTime();
	const toolTipWidth = showTime ? 150 : 90;
	const toolTipOffset = -toolTipWidth / 2; // Center it on the cursor
	const xAxisTicks = getXTicks(data, numberOfXAxisTicks);
	const chartHeight = window.innerWidth < mediaQuerySizes.small ? 200 : 300;

	return (
		<ResponsiveContainer width="100%" height={chartHeight}>
			<AreaChart margin={{ left: 0, top: -1, bottom: 0 }} data={data}>
				<CartesianGrid vertical={false} width="1" strokeWidth={0.1} />
				<defs>
					<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor={theme.color.primary1} stopOpacity={0.3} />
						<stop offset="100%" stopColor={theme.color.primary1} stopOpacity={0} />
					</linearGradient>
				</defs>
				<XAxis dataKey="blockTime" tick={<CustomXTick showTime={showTime} />} tickLine={false} ticks={xAxisTicks} />
				<YAxis
					datekey="price"
					padding={{ top: 40 }} // Space for tooltip above the data
					orientation="right"
					tick={<CustomYTick />}
					width={55}
					axisLine={false}
					tickLine={false}
				/>
				<Tooltip
					cursor={cursorConfig}
					position={{ y: 0 }} // Set to the top of chart
					content={<CustomTooltip toolTipWidth={toolTipWidth} setHoverDate={setHoverDate} showTime={showTime} />}
					isAnimationActive={false}
					offset={toolTipOffset}
				/>
				<ReferenceLine y={avg} stroke={theme.color.text2} strokeDasharray="3 3" label={<AvgLabel avg={avg} />} />
				{lines}
			</AreaChart>
		</ResponsiveContainer>
	);
}

// Helpers
function getAvg(data, coinName) {
	if (!data || data.length === 0 || !coinName) return null;

	let avg = data.reduce((acc, obj) => {
		return acc + obj[coinName];
	}, 0);
	avg /= data.length;

	return avg;
}

function getXTicks(data, num) {
	if (!data) return [];

	let ticks = Array(num);
	const inc = data.length / num;
	const offset = (data.length - inc * (num - 1)) / 2;
	for (let i = 0; i < num; i++) {
		const index = parseInt(inc * i + offset);
		ticks[i] = data[index].blockTime;
	}

	return ticks;
}
