// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useMemo, useCallback } from "react";
import styled, { useTheme } from "styled-components";

import { useTimeSeriesData } from "data/hooks";
import { OptionButton, OptionButtonVariantBackdrop } from "components/Button";
import MultilineChart from "components/Chart/MultilineChart";
import Column from "components/Column";
import { ScrollRow, ResponsiveRow } from "components/Row";
import { Typography } from "theme";
import { TIME_SELECTOR_INFO, TIME_SERIES_DATA_SELECTOR_INFO, COIN_INFO } from "common/constants";
import { formatNumber } from "common/utils";

import { time_selector_E, time_series_data_selector_E } from "common/enums";
import { chart_config_S, line_info_S } from "common/interfaces";

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

/**
 * React element to display the multiline chart, with time selector and data selector buttons
 * @param chartConfig the chart configuration
 * @param lineInfoList list of the line info for the lines to be plotted
 * @param dataSelectors list of data selectors, if only 1 selector is give, buttons are not shown
 * @param timeSelectors list of the time selectors to show buttons for, if empty or length 1 buttons are not shown, if empty ALL is selected
 * @param hoverDataCallback callback to recieve the hover data, this is the data hovered over for the coins in lineInfoList, and the last data point for the coins not in lastInfoList
 * @returns react element which is a time series chart, with a row of time selectors below the chart, and data selectors + current value above
 */
export default function TimeSeriesChart({
	chartConfig,
	lineInfoList,
	dataSelectors,
	timeSelectors,
	hoverDataCallback,
}: {
	chartConfig: chart_config_S;
	lineInfoList: line_info_S[];
	dataSelectors: time_series_data_selector_E[];
	timeSelectors: time_selector_E[];
	hoverDataCallback?: (hoverData: time_series_data_entry_S) => void;
}): JSX.Element | null {
	const theme = useTheme();
	const [timeSelector, setTimeSelector] = useState<time_selector_E>(
		timeSelectors.length === 0 ? time_selector_E.ALL : timeSelectors.slice(-1)[0]
	);
	const [dataSelector, setDataSelector] = useState<time_series_data_selector_E>(dataSelectors[0]);

	// Jump to first data selector if they changed
	if (!dataSelectors.includes(dataSelector)) {
		setDataSelector(dataSelectors[0]);
	}

	const data = useTimeSeriesData(dataSelector, timeSelector);

	const dataSelectorButtons = useMemo(() => {
		if (dataSelectors.length <= 1) {
			return null;
		}

		return dataSelectors.map((selector, i) => {
			return (
				<OptionButton
					key={i}
					buttonContent={TIME_SERIES_DATA_SELECTOR_INFO[selector].displayName}
					active={dataSelector === selector}
					onClick={() => setDataSelector(selector)}
					flex={1}
					variant
				/>
			);
		});
	}, [dataSelector, dataSelectors, setDataSelector]);

	const timeSelectorButtons = useMemo(() => {
		if (timeSelectors.length <= 1) {
			return null;
		}

		return timeSelectors.map((selector, i) => {
			return (
				<OptionButton
					key={i}
					buttonContent={TIME_SELECTOR_INFO[selector].name}
					active={timeSelector === selector}
					onClick={() => setTimeSelector(selector)}
				/>
			);
		});
	}, [timeSelector, timeSelectors, setTimeSelector]);

	// For null hoverData, or entries with coins not in lineInfoList the data passed to the callback the most recent point
	const handleHover = useCallback(
		(hoverData: time_series_data_entry_S | null) => {
			if (!data) {
				return;
			}

			const callbackData = JSON.parse(JSON.stringify(data.slice(-1)[0])); // deep copy of most recent

			// Update the data of coins in lineInfoList to the hover data
			if (hoverData && hoverDataCallback) {
				for (let i = 0; i < lineInfoList.length; i++) {
					let coinName = lineInfoList[i].coin; // This will be the coin name if it is "ALL"
					if (typeof coinName !== "string") {
						// If it is not all, this will find the name
						coinName = COIN_INFO[coinName].name;
					}

					callbackData[coinName] = hoverData[coinName];
				}
			}

			if (hoverDataCallback) {
				hoverDataCallback(callbackData);
			}
		},
		[data, hoverDataCallback, lineInfoList] // lineInfoList here causes infinite loop since it updates on this useCallback
	);

	// if (!data || lineInfoList.length === 0) {
	// 	return null;
	// }

	// Current value of the first entry in lineInfoList for the selected data
	let coinName = lineInfoList[0].coin; // This will be the coin name if it is "ALL"
	if (typeof coinName !== "string") {
		// If it is not all, this will find the name
		coinName = COIN_INFO[coinName].name;
	}

	const currentValue = data && data.length !== 0 ? data.slice(-1)[0][coinName] : "";
	const dataSelectorInfo = TIME_SERIES_DATA_SELECTOR_INFO[dataSelector];

	return (
		<StyledChartContainer>
			{(chartConfig.showCurrentValue || dataSelectors.length > 1) && (
				<ResponsiveRow align="flex-start" overflow="visible" reverse xs>
					{chartConfig.showCurrentValue && (
						<Column align="flex-start" overflow="visible" flex={1}>
							<Typography.header color={theme.color.text2}>Current {dataSelectorInfo.description}</Typography.header>
							<Typography.displayL>{formatNumber(currentValue, dataSelectorInfo.unit)}</Typography.displayL>
						</Column>
					)}
					{dataSelectors.length > 1 && <DataSelectorRow>{dataSelectorButtons}</DataSelectorRow>}
				</ResponsiveRow>
			)}
			<MultilineChart
				data={data}
				chartConfig={chartConfig}
				lineInfoList={lineInfoList}
				onHover={handleHover}
				unit={dataSelectorInfo.unit}
			/>
			<TimeSelectorRow>{timeSelectorButtons}</TimeSelectorRow>
		</StyledChartContainer>
	);
}
