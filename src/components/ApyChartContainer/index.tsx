// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled, { useTheme } from "styled-components";

import { useTimeSeriesData } from "data/hooks";
import { OptionButton, OptionButtonVariantBackdrop } from "components/Button";
import MultilineChart from "components/MultilineChart";
import { ScrollRow, ResponsiveRow, CoinRow, ResponsiveJustifyRow } from "components/Row";
import Column from "components/Column";
import { Typography } from "theme";
import { COIN_INFO, TIME_SELECTOR_INFO, TIME_SERIES_DATA_SELECTOR_INFO } from "common/constants";
import { formatNumber } from "common/utils";

import { coin_E, time_selector_E, time_series_data_selector_E } from "common/enums";

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

export default function ApyChartContainer({ coin, includeComp }: { coin: coin_E; includeComp: boolean }): JSX.Element {
	const [dataSelector, setDataSelector] = useState<time_series_data_selector_E>(time_series_data_selector_E.SUPPLY_APY);
	const [timeSelector, setTimeSelector] = useState<time_selector_E>(time_selector_E.ALL);
	const [selectedCoinsAndColors, setSelectedCoinsAndColors] = useState([]);
	const [hoverDate, setHoverDate] = useState(0);
	const [coinValues, setCoinValues] = useState(initialCoinValues());

	let apyDataSelectors: time_series_data_selector_E[] = [];
	if (includeComp) {
		apyDataSelectors = [time_series_data_selector_E.TOTAL_SUPPLY_APY, time_series_data_selector_E.TOTAL_BORROW_APY];
	} else {
		apyDataSelectors = [time_series_data_selector_E.SUPPLY_APY, time_series_data_selector_E.BORROW_APY];
	}

	const data = useTimeSeriesData(dataSelector, timeSelector);
	const coinInfo = COIN_INFO[coin];
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
		// setSelectedCoinsAndColors(newSelectedCoinsAndColors);
	}, []);

	// Render
	const dataSelectorButtons = useMemo(() => {
		return apyDataSelectors.map((selector, i) => {
			return (
				<OptionButton
					key={i}
					buttonContent={TIME_SERIES_DATA_SELECTOR_INFO[selector].displayName}
					active={dataSelector === selector}
					onClick={() => setDataSelector(selector)}
					width="50%"
					variant
				/>
			);
		});
	}, [dataSelector, apyDataSelectors, setDataSelector]);

	const timeSelectorButtons = useMemo(() => {
		return TIME_SELECTOR_INFO.map((selectorInfo, i) => {
			const selectorEnum = i as time_selector_E;
			return (
				<OptionButton
					key={i}
					buttonContent={selectorInfo.name}
					active={timeSelector === selectorEnum}
					onClick={() => setTimeSelector(selectorEnum)}
				/>
			);
		});
	}, [timeSelector, setTimeSelector]);

	const coinList = COIN_INFO.map((info) => {
		const value = coinValues.filter((obj) => obj.name === info.name)[0].value;
		return { name: info.name, value: value, allowDeselect: info.name !== coinInfo?.name };
	});

	const currentApy = useMemo(() => {
		if (!coin || !data) return null;

		return data.slice(-1)[0][coinInfo.name];
	}, [data, coinInfo, coin]);

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
			<CoinRow activeCoin={coin} coinList={coinList} updateSelectedCoins={handleSelectedCoinsAndColors} />
		</StyledChartContainer>
	);
}
