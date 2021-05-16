import React from 'react'
import styled from 'styled-components'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { formatDate } from '../utils'
import { SHORT_TERM_DAYS } from '../constants'

const cursorConfig = {
	stroke: 'gray', // Can't use theme here
	strokeWidth: 2,
	strokeDasharray: '5,5',
};

const activeDotConfig = {
	r: 5, // dot radius
}

const StyledTooltip = styled.div`
	background-color: red;
	text-align: center;
	padding: 5px 0;
	width: ${({toolTipWidth}) => toolTipWidth}px;
	color: ${({theme}) => theme.color.secondary1};
	border: solid ${({theme}) => theme.border.thickness + ' ' + theme.color.border1};
	border-radius: ${({theme}) => theme.border.radius};
	background-color: ${({theme}) => theme.color.bg1};
	font-size: ${({theme}) => theme.fontSize.body};
	transform: translate(${({translationX}) => translationX}px);
`;

// This gives a warning in the console, but it is handled, so can disregard
function CustomTooltip(props) {
	if(props.payload) { // Make sure the data exists
		const hoverDate = props.payload[0]?.payload?.blockTime;
	 	props.setHoverDate(hoverDate);

		// Format the tooltip date
		const date = new Date(hoverDate);
		const formattedDate = formatDate(date, props.showTime);

		// Bound the right side of tooltip
		const rightX = props.coordinate.x + props.toolTipWidth/2;
		const maxX = props.viewBox.width + props.viewBox.left;
		const translationX = rightX > maxX ? maxX - rightX : 0; 
		
		return (
			<StyledTooltip toolTipWidth={props.toolTipWidth} translationX={translationX} >{formattedDate}</StyledTooltip>
		);
	} else {
		return null;
	}
}

function CustomXTick(props) {
	const {x, y, payload, showTime} = props;
	const date = new Date(payload.value);
	const formattedDate = formatDate(date, showTime);
	return <text x={x} y={y+15} textAnchor='middle'>{formattedDate}</text>
}

class MultilineChart extends React.Component {
	// Only rerender if the data changes, or if the selected coins change for optimization
	shouldComponentUpdate(nextProps, nextState) {
		const newData = this.props.data !== nextProps.data;
		const newCoin = this.props.selectedCoinColor !== nextProps.selectedCoinColor;
		return newData || newCoin;
	}

	// Only show the time of day for short range data
	shouldShowTime = () => {
		const data = this.props.data;
		if(!data) return false;

		const lastDate = new Date(data.slice(-1)[0].blockTime);
		const firstDate = new Date(data[0].blockTime);
		const dayDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24); // ms diff converted to days
		return dayDiff < SHORT_TERM_DAYS;
	}

	render() {
		const lines = this.props.selectedCoinColor.map((coin, i) => {
			return (
				<Line 
				type='monotone' 
				dataKey={coin.name} 
				stroke={coin.color} 
				key={i} 
				dot={false} 
				activeDot={activeDotConfig}
				isAnimationActive={false}
			/>
			);
		});

		const showTime = this.shouldShowTime(); 
		const toolTipWidth = showTime ? 150 : 90;
		const toolTipOffset = -toolTipWidth/2; // Center it on the cursor

		return (
			<ResponsiveContainer width='100%' height={300} >
				<LineChart margin={{right: 20, left: 0, top: 0, bottom: 0}} data={this.props.data}>
					{lines}
					<XAxis 
						dataKey='blockTime' 
						tick={<CustomXTick showTime={showTime} />} 
						tickCount={3}
					/>
					<YAxis 
						datekey='price' 
						padding={{top: 30}} // Space for tooltip above the data
						orientation='left'
					/>
					<Tooltip 
						cursor={cursorConfig} 
						position={{y: 0}}  // Set to the top of chart
						content={<CustomTooltip toolTipWidth={toolTipWidth} setHoverDate={this.props.setHoverDate} showTime={showTime} />} 
						isAnimationActive={false}
						offset={toolTipOffset} 
					/>
				</LineChart>
			</ResponsiveContainer>
		);
	}
}


export default MultilineChart;
