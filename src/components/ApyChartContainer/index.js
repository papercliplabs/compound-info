import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled, { useTheme } from "styled-components";

import { useTimeSeriesData } from "data/hooks";
import { OptionButton, OptionButtonVariantBackdrop } from "components/Button";
import MultilineChart from "components/MultilineChart";
import { ScrollRow, ResponsiveRow, CoinRow, ResponsiveJustifyRow } from "components/Row";
import Column from "components/Column";
import { Typography } from "theme";
import { COIN_INFO, TIME_SELECTORS } from "common/constants";
import { formatNumber } from "common/utils";

const StyledChartContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	row-gap: ${({ theme }) => theme.spacing.xs};
`;

const TimeSelectorRow = styled(ScrollRow)`
	justify-content: center;
	column-gap: ${({ theme }) => theme.spacing.lg};

	${({ theme }) => theme.mediaWidth.extraSmall`
		column-gap: ${({ theme }) => theme.spacing.md};
	`}
`;

const DataSelectorRow = styled(OptionButtonVariantBackdrop)`
	flex: 1;
	${({ theme }) => theme.mediaWidth.extraSmall`
		width: 100%;
	`}
`;

function initialCoinValues() {
	return COIN_INFO.map((info) => {
		return { name: info.name, value: 0 };
	});
}

export default function ApyChartContainer({ activeCoin, dataSelectors, includeComp }) {
	const [dataSelector, setDataSelector] = useState(dataSelectors[0]);
	const [timeSelector, setTimeSelector] = useState(TIME_SELECTORS.slice(-1)[0]);
	const [selectedCoinsAndColors, setSelectedCoinsAndColors] = useState([]);
	const [hoverDate, setHoverDate] = useState(0);
	const [coinValues, setCoinValues] = useState(initialCoinValues());

	// If includeComp, need to get the data selector key for that
	let dataSelectorKey = dataSelector.key;
	if (includeComp) {
		if (dataSelectorKey === "borrowApy") {
			dataSelectorKey = "totalBorrowApy";
		} else if (dataSelectorKey === "supplyApy") {
			dataSelectorKey = "totalSupplyApy";
		}
	}
	const data = useTimeSeriesData(dataSelectorKey, timeSelector);
	const theme = useTheme();

	console.log(data);
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
					width="50%"
					variant
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
					onClick={() => setTimeSelector(selector)}
				/>
			);
		});
	}, [timeSelector, setTimeSelector]);

	const coinList = COIN_INFO.map((info) => {
		const value = coinValues.filter((obj) => obj.name === info.name)[0].value;
		return { name: info.name, value: value, allowDeselect: info.name !== activeCoin?.name };
	});

	const currentApy = useMemo(() => {
		if (!activeCoin || !data) return null;

		return data.slice(-1)[0][activeCoin.name];
	}, [data, activeCoin]);

	// Weird bug with rechart tooltip, hence the overflow params below
	return (
		<StyledChartContainer>
			<ResponsiveRow align="flex-start" overflow="visible" reverse xs>
				<Column align="flex-start" overflow="visible">
					<Typography.headerSecondary>
						Current {dataSelector.name} {includeComp ? "with COMP" : "without COMP"}
					</Typography.headerSecondary>
					<Typography.displayL>{formatNumber(currentApy, "%")}</Typography.displayL>
				</Column>
				<DataSelectorRow>{dataSelectorButtons}</DataSelectorRow>
			</ResponsiveRow>
			<MultilineChart
				data={data}
				selectedCoinsAndColors={selectedCoinsAndColors}
				setHoverDate={(date) => setHoverDate(date)}
			/>
			<TimeSelectorRow>{timeSelectorButtons}</TimeSelectorRow>
			<Typography.header>Compare to:</Typography.header>
			<CoinRow activeCoin={activeCoin} coinList={coinList} updateSelectedCoins={handleSelectedCoinsAndColors} />
		</StyledChartContainer>
	);
}
