import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import OptionRow from './optionRow'
import OptionButton from './buttons'
import MultilineChart from './multilineChart'
import CoinRow from './coinRow'

const StyledChartContainer = styled.div`
	border: solid ${({ theme })  => theme.border.thickness + ' ' + theme.color.border1};
	border-radius: ${({ theme }) => theme.border.radius};
	max-width: 1024px;
	padding: 15px;
	margin: auto;
`;

function initialCoinValues(coins) {
	return coins.map((coin) => {return {name: coin.name, value: 0}});
}

export default function ChartContainer({ title, coins, selectedCoinColors, dataSelectors, timeSelectors, activeCoin, useData }) {
	const [dataSelector, setDataSelector] = useState(dataSelectors[0]);
	const [timeSelector, setTimeSelector] = useState(timeSelectors[0]);
	const [selectedCoinsAndColors, setSelectedCoinsAndColors] = useState([]);
	const [hoverDate, setHoverDate] = useState(0);
	const [coinValues, setCoinValues] = useState(initialCoinValues(coins));
	const data = useData(dataSelector, timeSelector); 


	// Set coin values when hover date changes
	useEffect(() => {
		const currentCoinValues = data?.slice(-1)[0];
		const coinValuesOnHoverDate = data?.filter(entry => entry.blockTime === hoverDate)[0];
		if(!currentCoinValues) return;

		let newCoinValues = initialCoinValues(coins); 
		newCoinValues = newCoinValues.map(({name, value}) => {
			const isSelected = selectedCoinsAndColors.filter(obj => obj.name === name).length === 1;
			let newValue;
			if(!isSelected || !hoverDate || !coinValuesOnHoverDate) {
				newValue = currentCoinValues[name];
			} else {
				newValue = coinValuesOnHoverDate[name];
			}
			return {name: name, value: newValue};
		});

		setCoinValues(newCoinValues);
	}, [selectedCoinsAndColors, hoverDate, data, coins]);


	const handleSelectedCoinsAndColors = useCallback((newSelectedCoinsAndColors) => {
		setSelectedCoinsAndColors(newSelectedCoinsAndColors);	
	}, []);


	// Render
	const dataSelectorButtons = dataSelectors.map((selector, i) => {
		return (
			<OptionButton 
			key={i} 
			active={dataSelector === selector}
			onClick={() => setDataSelector(selector)}
		>
				{selector.name}
		</OptionButton>
		);
	});

	const timeSelectorButtons = timeSelectors.map((selector, i) => {
		return (
			<OptionButton 
			key={i} 
			active={timeSelector === selector}
			onClick={() => setTimeSelector(selector)}
		>
				{selector.name}
		</OptionButton>
		);
	});

	const coinList = coins.map((coin) => {
		const value = coinValues.filter(obj => obj.name === coin.name)[0].value;
		return {'name': coin.name, value: value, allowDeselect: coin.name !== activeCoin?.name}
	});

	return (
		<StyledChartContainer>
			{title}
			<OptionRow>
				<OptionRow>
					{dataSelectorButtons}
				</OptionRow>
				<OptionRow justify='flex-end'>
					{timeSelectorButtons}
				</OptionRow>
			</OptionRow>

			<MultilineChart data={data} selectedCoinsAndColors={selectedCoinsAndColors} setHoverDate={(date) => setHoverDate(date)} />

			Compare to:
			<CoinRow 
				coinList={coinList} 
				selectedCoinColors={selectedCoinColors} 
				updateSelectedCoins={handleSelectedCoinsAndColors}
			/>
			</StyledChartContainer>
		);
}
