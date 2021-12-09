// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useMemo, useCallback } from "react";
import styled, { useTheme } from "styled-components";

import { TimeSelector, DataResolution } from "common/enums";
import { LineInfo, ChartConfig, DataSelector } from "common/types";

import { useTimeSeriesData } from "data/hooks";
import { OptionButton, OptionButtonVariantBackdrop } from "components/Button";
import MultilineChart from "components/Chart/MultilineChart";
import Column from "components/Column";
import { ScrollRow, ResponsiveRow } from "components/Row";
import { Typography } from "theme";
import { TIME_SELECTOR_INFO, TIME_SERIES_DATA_SELECTOR_INFO, COIN_INFO } from "common/constants";
import { formatNumber, getDataSelectorName, getDataSelectorUnit, getDataSelectorDescription } from "common/utils";

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
 * @param data chart data to display for each data resolution
 * @param chartConfig the chart configuration
 * @param lineInfoList list of the line info for the lines to be plotted
 * @param dataSelectors list of data selectors, if only 1 selector is give, buttons are not shown. If the selector is a MarketDataSelector or ProtocolDataSelector more info about it is shown
 * @param timeSelectors list of the time selectors to show buttons for, if empty or length 1 buttons are not shown, if empty ALL is selected
 * @param hoverDataCallback callback to recieve the hover data, this is the data hovered over for the coins in lineInfoList, and the last data point for the coins not in lastInfoList
 * @returns react element which is a time series chart, with a row of time selectors below the chart, and data selectors + current value above
 */
export default function TimeSeriesChart({
	data,
	chartConfig,
	lineInfoList,
	dataSelectorOptions,
	timeSelectorOptions,
	hoverDataCallback,
}: {
	data: Record<keyof DataResolition, Record<string, any>[]>;
	chartConfig: ChartConfig;
	lineInfoList: LineInfo[];
	dataSelectorOptions: string[];
	timeSelectorOptions: TimeSelector[];
	hoverDataCallback?: (hoverData: Record<string, any>) => void;
}): JSX.Element | null {
	const theme = useTheme();
	const [timeSelector, setTimeSelector] = useState<TimeSelector>(
		timeSelectors.length === 0 ? TimeSelector.ALL : timeSelectors.slice(-1)[0]
	);
	const [dataSelector, setDataSelector] = useState<string>(dataSelectorOptions[0]);

	// Jump to first data selector if they changed
	if (!dataSelectorOptions.includes(dataSelector)) {
		setDataSelector(dataSelectorOptions[0]);
	}

	// Data at the correct resolution for the time selected
	const selectedData = useMemo(() => {
		const resolution = TIME_SERIES_DATA_SELECTOR_INFO[timeSelector].resolution;
		if (resolution in data) {
			return data[resolution];
		} else {
			console.log("No data provided for the selected resolution");
			return [];
		}
	});

	const dataSelectorButtons = useMemo(() => {
		if (dataSelectorOptions.length <= 1) {
			return null;
		}

		return dataSelectorOptions.map((selector, i) => {
			const name = getDataSelectorName(selector);
			return (
				<OptionButton
					key={i}
					buttonContent={name}
					active={dataSelector === selector}
					onClick={() => setDataSelector(selector)}
					flex={1}
					variant
				/>
			);
		});
	}, [dataSelector, dataSelectorOptions, setDataSelector]);

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
	}, [timeSelector, timeSelectorOptions, setTimeSelector]);

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

	const currentValue = 0; //data !== null && data.length !== 0 ? data.slice(-1)[0][coinName] ?? 0 : 0;
	const dataSelectorInfo = TIME_SERIES_DATA_SELECTOR_INFO[dataSelector];
	const dataSelectorDescription = getDataSelectorDescription(dataSelector);
	const dataSelectorUnit = getDataSelectorUnit(dataSelector);

	return (
		<StyledChartContainer>
			{(chartConfig.showCurrentValue || dataSelectors.length > 1) && (
				<ResponsiveRow align="flex-start" overflow="visible" reverse xs>
					{chartConfig.showCurrentValue && (
						<Column align="flex-start" overflow="visible" flex={1}>
							<Typography.header color={theme.color.text2}>Current {dataSelectorDescription}</Typography.header>
							<Typography.displayL>{formatNumber(currentValue, dataSelectorUnit)}</Typography.displayL>
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
				unit={dataSelectorUnit}
			/>
			<TimeSelectorRow>{timeSelectorButtons}</TimeSelectorRow>
		</StyledChartContainer>
	);
}
