import React from 'react'
import styled from 'styled-components'
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { formatDate } from '../utils'

const StyledTooltip = styled.div`
	background-color: red;
	top: 0;
`;

const cursorConfig = {
	stroke: 'gray', // Can't use theme here, which is crappy
	strokeWidth: 2,
	strokeDasharray: '5,5',
};

const activeDotConfig = {
	r: 5, // dot radius
}

function CustomTooltip(props) {
	if(props.payload) { // Make sure the data exists
		const hoverDate = props.payload[0]?.payload?.blockTime;
	 	props.setHoverDate(hoverDate);
		const date = new Date(hoverDate);
		const formattedDate = formatDate(date, true);
		console.log(props)
		console.log(props.coordinate.x)
		return (
			<StyledTooltip>{formattedDate}</StyledTooltip>
		);
	} else {
		return null;
	}
}

function renderCustomXAxisTick(obj) {
	const x = obj.x;
	const y = obj.y;
	const payload = obj.payload;
	const date = new Date(payload.value);
	const formattedDate = formatDate(date, false);
	return <text x={x} y={y+10} textAnchor='middle'>{formattedDate}</text>
}

class MultilineChart extends React.Component {
	// Only rerender if the data changes, or if the selected coins change for optimization
	shouldComponentUpdate(nextProps, nextState) {
		const newData = this.props.data !== nextProps.data;
		const newCoin = this.props.selectedCoinColor.length !== nextProps.selectedCoinColor.length; // Object equality breaks down here, length comparrison is sufficient
		return newData || newCoin;
	}

	render() {
		console.log("here")
		const aspect = 2.5/1.0; 

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

		return (
			<ResponsiveContainer width='100%' aspect={aspect}>
				<LineChart margin={{right: 20}} data={this.props.data}>
					{lines}
					<XAxis 
						dataKey='blockTime' 
						tick={renderCustomXAxisTick} 
						tickCount={3}
					/>
					<YAxis 
						datekey='price' 
						padding={{top: 30}} // Space for tooltip above the data
					/>
					<Tooltip 
						cursor={cursorConfig} 
						position={{y: 0}}  // Set to the top of chart
						content={<CustomTooltip setHoverDate={this.props.setHoverDate} />} 
						isAnimationActive={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		);
	}
}


export default MultilineChart;
