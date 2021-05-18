import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { formatDate } from 'utils'
import { SHORT_TERM_DAYS } from 'constants/index'
import { Typography } from 'theme'

// Note: with ReChart, I am unable to use Typography to set the x and y axis tick styles

const cursorConfig = {
	stroke: 'gray', // Can't use theme here
	strokeWidth: 2,
	strokeDasharray: '5,5',
};

const activeDotConfig = {
	r: 5, // dot radius
	strokeWidth: 0,
}

const StyledTooltip = styled.div`
	background-color: red;
	text-align: center;
	padding: 5px 0;
	width: ${({ toolTipWidth }) => toolTipWidth}px;
	border: solid ${({ theme }) => theme.border.thickness + ' ' + theme.color.border1};
	border-radius: ${({ theme }) => theme.border.radius};
	background-color: ${({ theme }) => theme.color.bg1};
	transform: translate(${({ translationX }) => translationX}px);
`;

function CustomTooltip({ coordinate, toolTipWidth, viewBox, setHoverDate, showTime, payload }) {
	const hoverDate = payload ? payload[0]?.payload.blockTime : null;

	// If hover date updates, let parent know (after render)
	useEffect(() => {
		setHoverDate(hoverDate);
	}, [hoverDate, setHoverDate]);

	if(hoverDate) {
		// Format the tooltip date
		const date = new Date(hoverDate);
		const formattedDate = formatDate(date, showTime);

		// Bound the right side of tooltip
		const rightX = coordinate.x + toolTipWidth/2;
		const maxX = viewBox.width + viewBox.left;
		const translationX = rightX > maxX ? maxX - rightX : 0; 

		return (
			<StyledTooltip toolTipWidth={toolTipWidth} translationX={translationX} >
				<Typography.subheader>{formattedDate}</Typography.subheader>
			</StyledTooltip>
		);
	} else {
		return null;
	}
}

function CustomXTick({ x, y, payload, showTime, fill }) {
	const date = new Date(payload.value);
	const formattedDate = formatDate(date, showTime);
	return (
		<text fill={fill} x={x} y={y+15} textAnchor='middle'>
			{formattedDate}
		</text>
	);
}

export default function MultilineChart({ data, selectedCoinsAndColors, setHoverDate }) {
	const theme = useTheme();

	function shouldShowTime() {
		if(!data) return false;

		const lastDate = new Date(data.slice(-1)[0].blockTime);
		const firstDate = new Date(data[0].blockTime);
		const dayDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24); // ms diff converted to days
		return dayDiff < SHORT_TERM_DAYS;
	}

	// Render
	const lines = selectedCoinsAndColors.map((coin, i) => {
		return (
			<Line 
			type='monotone' 
			dataKey={coin.name} 
			stroke={coin.color} 
			strokeWidth={2}
			key={i} 
			dot={false} 
			activeDot={activeDotConfig}
			isAnimationActive={false}
		/>
		);
	});

	const showTime = shouldShowTime();
	const toolTipWidth = showTime ? 150 : 90;
	const toolTipOffset = -toolTipWidth/2; // Center it on the cursor

	return (
		<ResponsiveContainer width='100%' height={300} >
			<LineChart margin={{right: 20, left: 0, top: 0, bottom: 0}} data={data}>
				{lines}
				<XAxis 
					dataKey='blockTime' 
					tick={<CustomXTick fill={theme.color.secondary1} tshowTime={showTime} />} 
					tickCount={3}
				/>
				<YAxis 
					datekey='price' 
					padding={{top: 30}} // Space for tooltip above the data
					orientation='left'
					tick={{fill: theme.color.secondary1}}
				/>
				<Tooltip 
					cursor={cursorConfig} 
					position={{y: 0}}  // Set to the top of chart
					content={<CustomTooltip toolTipWidth={toolTipWidth} setHoverDate={setHoverDate} showTime={showTime} />} 
					isAnimationActive={false}
					offset={toolTipOffset} 
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
