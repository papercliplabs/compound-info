// @ts-nocheck
import React, { useState, useMemo, useCallback, useEffect } from "react";
import styled, { useTheme } from "styled-components";

import { TimeSelector, DataSelector, Token, DataType } from "common/enums";
import { LineInfo, ChartConfig } from "common/types";

import { useHistoricalData } from "data/hooks";
import { OptionButton, OptionButtonVariantBackdrop } from "components/Button";
import MultilineChart from "components/Chart/MultilineChart";
import Column from "components/Column";
import { ScrollRow, ResponsiveRow } from "components/Row";
import { Typography } from "theme";
import { TIME_SELECTOR_INFO, MARKET_DATA_SELECTOR_INFO, PROTOCOL_DATA_SELECTOR_INFO } from "common/constants";
import { formatNumber } from "common/utils";
import Skeleton from "components/Skeleton";
import { time } from "console";

const StyledChartContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
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
 * @param token the core token of this chart, if this is set the current value will be shown in the top left, otherwise it will be hidden
 * @param lineInfoList list of the line info for the lines to be plotted
 * @param dataType type of the data, this determines the data source to use
 * @param dataSelectorOptions list of data selectors, if only 1 selector is provided buttons are not shown, this should be a selector for the dataType
 * @param timeSelectorOptions list of the time selectors to show buttons for, if only 1 selector is provided no buttons are shown
 * @param hoverDataCallback callback to recieve the hover data, this is the data hovered over for the coins in lineInfoList, and the last data point for the coins not in lastInfoList
 * @returns react element which is a time series chart, with a row of time selectors below the chart, and data selectors + current value above
 */
export default function TimeSeriesChart({
	chartConfig,
	token,
	lineInfoList,
	dataType,
	dataSelectorOptions,
	timeSelectorOptions,
	hoverDataCallback,
}: {
	chartConfig: ChartConfig;
	token?: Token;
	lineInfoList: LineInfo[];
	dataType: DataType;
	dataSelectorOptions: DataSelector[];
	timeSelectorOptions: TimeSelector[];
	hoverDataCallback?: (hoverData: Record<string, any>) => void;
}): JSX.Element | null {
	const theme = useTheme();
	const [timeSelector, setTimeSelector] = useState<TimeSelector>(timeSelectorOptions.slice(-1)[0]);
	const [dataSelector, setDataSelector] = useState<string>(dataSelectorOptions[0]);
	const [dataSelectorIndex, setDataSelectorIndex] = useState<number>(0); // Used when the data selector options change

	// Select new data selector if they changed
	if (!dataSelectorOptions.includes(dataSelector)) {
		if (dataSelectorOptions.length > dataSelectorIndex) {
			setDataSelector(dataSelectorOptions[dataSelectorIndex]);
		} else {
			setDataSelector(dataSelectorOptions[0]);
			setDataSelectorIndex(0);
		}
	}

	const selectedData = useHistoricalData(dataType, timeSelector, dataSelector);

	const dataSelectorInfo = DataType.PROTOCOL === dataType ? PROTOCOL_DATA_SELECTOR_INFO : MARKET_DATA_SELECTOR_INFO;

	// Update hover data callback when selectedData changes
	useEffect(() => {
		if (selectedData && selectedData.length != 0 && hoverDataCallback) {
			const callbackData = JSON.parse(JSON.stringify(selectedData.slice(-1)[0])); // deep copy of most recent
			hoverDataCallback(callbackData);
		}
	}, [hoverDataCallback, dataSelector]);

	const dataSelectorButtons = useMemo(() => {
		if (dataSelectorOptions.length <= 1) {
			// Show no buttons for 1 item in list
			return null;
		}

		return dataSelectorOptions.map((selector, i) => {
			return (
				<OptionButton
					key={i}
					buttonContent={dataSelectorInfo[selector].name}
					active={dataSelector === selector}
					onClick={() => {
						setDataSelector(selector);
						setDataSelectorIndex(i);
					}}
					flex={1}
					variant
				/>
			);
		});
	}, [dataSelector, dataSelectorOptions, setDataSelector, setDataSelectorIndex, selectedData, hoverDataCallback]);

	const timeSelectorButtons = useMemo(() => {
		if (timeSelectorOptions.length <= 1) {
			// Show no buttons for 1 item in list
			return null;
		}

		return timeSelectorOptions.map((selector, i) => {
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
		(hoverData: any) => {
			if (!selectedData) {
				return;
			}
			const callbackData = JSON.parse(JSON.stringify(selectedData.slice(-1)[0])); // deep copy of most recent

			// Update the data of coins in lineInfoList to the hover data
			if (hoverData && hoverDataCallback) {
				for (let i = 0; i < lineInfoList.length; i++) {
					const key = lineInfoList[i].key; // This will be the coin name if it is "ALL"
					callbackData[key] = hoverData[key];
				}
			}
			if (hoverDataCallback) {
				hoverDataCallback(callbackData);
			}
		},
		[selectedData, hoverDataCallback, lineInfoList] // lineInfoList here causes infinite loop since it updates on this useCallback
	);

	const currentValue =
		selectedData && selectedData.length > 0
			? selectedData.slice(-1)[0][token] ?? selectedData.slice(-1)[0]["value"] ?? undefined
			: undefined;

	const dataSelectorDescription = dataSelectorInfo[dataSelector].description;
	const dataSelectorUnit = dataSelectorInfo[dataSelector].unit;

	return (
		<StyledChartContainer>
			{dataSelectorOptions.length > 0 && (
				<ResponsiveRow align="flex-start" overflow="visible" reverse xs>
					<Column align="flex-start" overflow="visible" flex={1}>
						<Typography.header color={theme.color.text2}>Current {dataSelectorDescription}</Typography.header>
						{currentValue != undefined ? (
							<Typography.displayL>{formatNumber(currentValue, dataSelectorUnit, 2)}</Typography.displayL>
						) : (
							<Skeleton width="100px" />
						)}
					</Column>
					{dataSelectorOptions.length > 1 && <DataSelectorRow>{dataSelectorButtons}</DataSelectorRow>}
				</ResponsiveRow>
			)}
			<MultilineChart
				data={selectedData}
				chartConfig={chartConfig}
				dateKey="date"
				lineInfoList={lineInfoList}
				onHover={handleHover}
				unit={dataSelectorUnit}
			/>
			{timeSelectorOptions.length > 1 && <TimeSelectorRow>{timeSelectorButtons}</TimeSelectorRow>}
		</StyledChartContainer>
	);
}
