import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import OptionButton from './Button'
import MultilineChart from './multilineChart'
import Row, { ResponsiveRow, CoinRow } from './Row'
import { Typography } from 'theme'
import { COINS, TIME_SELECTORS } from 'constants/index'

const StyledChartContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	row-gap: ${({ theme }) => theme.spacing.default};
`;

function initialCoinValues() {
	return COINS.map((coin) => {return {name: coin.name, value: 0}});
}

export default function ChartContainer({ activeCoin, dataSelectors, useData }) {
	const [dataSelector, setDataSelector] = useState(dataSelectors[0]);
	const [timeSelector, setTimeSelector] = useState(TIME_SELECTORS.slice(-1)[0]);
	const [selectedCoinsAndColors, setSelectedCoinsAndColors] = useState([]);
	const [hoverDate, setHoverDate] = useState(0);
	const [coinValues, setCoinValues] = useState(initialCoinValues());
	const data = useData(dataSelector, timeSelector); 

	// Set coin values when hover date changes
	useEffect(() => {
		const currentCoinValues = data?.slice(-1)[0];
		const coinValuesOnHoverDate = data?.filter(entry => entry.blockTime === hoverDate)[0];
		if(!currentCoinValues) return;

		let newCoinValues = initialCoinValues(); 
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
	}, [selectedCoinsAndColors, hoverDate, data]);


	const handleSelectedCoinsAndColors = useCallback((newSelectedCoinsAndColors) => {
		setSelectedCoinsAndColors(newSelectedCoinsAndColors);	
	}, []);


	// Render
	const dataSelectorButtons = useMemo(() => {
		return (
			dataSelectors.map((selector, i) => {
				return (
					<OptionButton 
						key={i} 
						active={dataSelector === selector}
						onClick={() => setDataSelector(selector)}
					>
						<Typography.subheader>{selector.name}</Typography.subheader>
					</OptionButton>
				);
			})
		);
	}, [dataSelector, dataSelectors, setDataSelector]);

	const timeSelectorButtons = useMemo(() => {
		return (
			TIME_SELECTORS.map((selector, i) => {
				return (
					<OptionButton 
						key={i} 
						active={timeSelector === selector}
						onClick={() => setTimeSelector(selector)}
					>
						<Typography.subheader>{selector.name}</Typography.subheader>
					</OptionButton>
				);
			})	
		);
	}, [timeSelector, setTimeSelector]);

	const coinList = COINS.map((coin) => {
		const value = coinValues.filter(obj => obj.name === coin.name)[0].value;
		return {name: coin.name, value: value, allowDeselect: coin.name !== activeCoin?.name}
	});

	return (
		<StyledChartContainer>
			<ResponsiveRow>
				<Row>
					{dataSelectorButtons}
				</Row>
				<Row justify='flex-end'>
					{timeSelectorButtons}
				</Row>
			</ResponsiveRow>

			<MultilineChart data={data} selectedCoinsAndColors={selectedCoinsAndColors} setHoverDate={(date) => setHoverDate(date)} />

			Compare to:
			<CoinRow 
				activeCoin={activeCoin}
				coinList={coinList} 
				updateSelectedCoins={handleSelectedCoinsAndColors}
			/>
			</StyledChartContainer>
		);
}
