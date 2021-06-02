import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { OptionButton } from 'components/Button';
import MultilineChart from 'components/multilineChart';
import Row, { ScrollRow, ResponsiveRow, CoinRow, ResponsiveJustifyRow } from 'components/Row';
import Column from 'components/Column';
import { Typography } from 'theme';
import { COINS, TIME_SELECTORS } from 'constants/index';
import { formatNumber } from 'utils';

const StyledChartContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	row-gap: ${({ theme }) => theme.spacing.default};
`;

function initialCoinValues() {
	return COINS.map((coin) => {
		return { name: coin.name, value: 0 };
	});
}

export default function ChartContainer({ activeCoin, dataSelectors, useData }) {
	const [dataSelector, setDataSelector] = useState(dataSelectors[0]);
	const [timeSelector, setTimeSelector] = useState(TIME_SELECTORS.slice(-1)[0]);
	const [selectedCoinsAndColors, setSelectedCoinsAndColors] = useState([]);
	const [hoverDate, setHoverDate] = useState(0);
	const [coinValues, setCoinValues] = useState(initialCoinValues());
	const data = useData(dataSelector.key, timeSelector);
	const theme = useTheme();

	// Set coin values when hover date changes
	useEffect(() => {
		const currentCoinValues = data?.slice(-1)[0];
		const coinValuesOnHoverDate = data?.filter((entry) => entry.blockTime === hoverDate)[0];
		if (!currentCoinValues) return;

		let newCoinValues = initialCoinValues();
		newCoinValues = newCoinValues.map(({ name, value }) => {
			const isSelected = selectedCoinsAndColors.filter((obj) => obj.name === name).length === 1;
			let newValue;
			if (!isSelected || !hoverDate || !coinValuesOnHoverDate) {
				newValue = currentCoinValues[name];
			} else {
				newValue = coinValuesOnHoverDate[name];
			}
			return { name: name, value: newValue };
		});

		setCoinValues(newCoinValues);
	}, [selectedCoinsAndColors, hoverDate, data]);

	const handleSelectedCoinsAndColors = useCallback((newSelectedCoinsAndColors) => {
		setSelectedCoinsAndColors(newSelectedCoinsAndColors);
	}, []);

	// Render
	const dataSelectorButtons = useMemo(() => {
		return dataSelectors.map((selector, i) => {
			return (
				<OptionButton
					key={i}
					buttonContent={selector.name}
					active={dataSelector === selector}
					onClick={() => setDataSelector(selector)}
				/>
			);
		});
	}, [dataSelector, dataSelectors, setDataSelector]);

	const timeSelectorButtons = useMemo(() => {
		return TIME_SELECTORS.map((selector, i) => {
			return (
				<OptionButton
					key={i}
					buttonContent={selector.name}
					active={timeSelector === selector}
					width="50px"
					onClick={() => setTimeSelector(selector)}
				/>
			);
		});
	}, [timeSelector, setTimeSelector]);

	const coinList = COINS.map((coin) => {
		const value = coinValues.filter((obj) => obj.name === coin.name)[0].value;
		return { name: coin.name, value: value, allowDeselect: coin.name !== activeCoin?.name };
	});

	const currentApy = useMemo(() => {
		if (!activeCoin || !data) return null;

		return data.slice(-1)[0][activeCoin.name];
	}, [data, activeCoin]);

	return (
		<StyledChartContainer>
			<ResponsiveRow align="flex-start">
				<Column>
					<ResponsiveJustifyRow justifyLarge="flex-start" justifySmall="center">
						<Typography.headerSecondary>
							Current {activeCoin?.name} {dataSelector.name}
						</Typography.headerSecondary>
					</ResponsiveJustifyRow>
					<ResponsiveJustifyRow justifyLarge="flex-start" justifySmall="center">
						<Typography.displayXL>{formatNumber(currentApy, '%')}</Typography.displayXL>
					</ResponsiveJustifyRow>
				</Column>
				<ResponsiveJustifyRow justifyLarge="flex-end" justifySmall="center">
					{dataSelectorButtons}
				</ResponsiveJustifyRow>
			</ResponsiveRow>
			<MultilineChart
				data={data}
				selectedCoinsAndColors={selectedCoinsAndColors}
				setHoverDate={(date) => setHoverDate(date)}
			/>
			<ScrollRow justify="center" gap={theme.spacing.large}>
				{timeSelectorButtons}
			</ScrollRow>
			<Typography.header>Compare to:</Typography.header>
			<CoinRow activeCoin={activeCoin} coinList={coinList} updateSelectedCoins={handleSelectedCoinsAndColors} />
		</StyledChartContainer>
	);
}
