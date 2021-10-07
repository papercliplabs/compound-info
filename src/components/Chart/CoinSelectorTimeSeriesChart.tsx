// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import styled, { useTheme } from "styled-components";

import TimeSeriesChart from "components/Chart/TimeSeriesChart";
import { ScrollRow } from "components/Row";
import { COIN_INFO } from "common/constants";
import { CoinButton } from "components/Button";
import { Typography } from "theme";

import { coin_E, time_selector_E, time_series_data_selector_E } from "common/enums";
import { chart_config_S, line_info_S, time_series_data_entry_S } from "common/interfaces";

const StyledChartContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	row-gap: ${({ theme }) => theme.spacing.xs};
`;

/**
 * Structure to hold the state of each coin button in the coin row
 */
interface coin_button_state_S {
	coin: coin_E;
	value: number;
	color: string | null;
	selectedPosition: number | null;
}

function defaultButtonStates(mainCoin: coin_E, mainColor: string): coin_button_state_S[] {
	return COIN_INFO.map((info, i) => {
		const isMainCoin = i === mainCoin;
		return {
			coin: i,
			value: 0,
			color: isMainCoin ? mainColor : null,
			selectedPosition: isMainCoin ? 0 : null,
		};
	});
}

/**
 * React element to display the time series chart, with coin selectors to derive the lineInfoList
 * @param chartConfig the chart configuration
 * @param dataSelectors list of data selectors, if only 1 selector is give, buttons are not shown
 * @param timeSelectors list of the time selectors to show buttons for, if empty or length 1 buttons are not shown, if empty ALL is selected
 * @returns react element coin selector time series chart (time selectors, data selectors, and coin selectors)
 */
export default function CoinSelectorTimeSeriesChart({
	chartConfig,
	dataSelectors,
	timeSelectors,
	mainCoin,
}: {
	chartConfig: chart_config_S;
	dataSelectors: time_series_data_selector_E[];
	timeSelectors: time_selector_E[];
	mainCoin: coin_E | null;
}): JSX.Element | null {
	const theme = useTheme();
	const [buttonStates, setButtonStates] = useState<coin_button_state_S[]>(
		defaultButtonStates(mainCoin, theme.color.lineChartColors[0])
	);
	const [colorStack, setColorStack] = useState<string[]>(
		mainCoin != null ? [...theme.color.lineChartColors].slice(1).reverse() : [...theme.color.lineChartColors].reverse()
	);

	// When the main coin changes, reset button states
	useEffect(() => {
		// Clear colors and positions
		setButtonStates((prevState) => {
			const nextState = [...prevState].map((buttonState) => ({
				...buttonState,
				color: buttonState.coin === mainCoin ? theme.color.lineChartColors[0] : null,
				selectedPosition: buttonState.coin === mainCoin ? 0 : null,
			}));
			return nextState;
		});

		// Reset color stack
		setColorStack(
			mainCoin != null
				? [...theme.color.lineChartColors].slice(1).reverse()
				: [...theme.color.lineChartColors].reverse()
		);
	}, [mainCoin, setButtonStates]);

	const handleHoverData = useCallback(
		(hoverData: time_series_data_entry_S) => {
			setButtonStates((prevState) => {
				const nextState = [...prevState].map((buttonState) => ({
					...buttonState,
					value: hoverData[COIN_INFO[buttonState.coin].name],
				}));
				return nextState;
			});
		},
		[setButtonStates]
	);

	function handleCoinButtonClick(coin: coin_E) {
		const newColorStack = [...colorStack];
		const newButtonStates = JSON.parse(JSON.stringify(buttonStates)); // deep copy

		const maxCoinsSelected = theme.color.lineChartColors.length;
		const allowDeselect = coin !== mainCoin && lineInfoList.length > 1;
		const numberSelected = maxCoinsSelected - newColorStack.length;
		const currentPosition = newButtonStates[coin].selectedPosition;

		let nextPosition;
		if (currentPosition === null) {
			// It is not selected, so select it
			nextPosition = Math.min(numberSelected + 1, maxCoinsSelected);
		} else if (!allowDeselect) {
			// Can't deselect if not allowDeselect, or the last one
			return;
		} else {
			// Deselect
			nextPosition = null;
		}

		// Shuffling positions on deselect
		for (let j = 0; j < newButtonStates.length; j++) {
			const position = newButtonStates[j].selectedPosition;
			if (currentPosition && position > currentPosition) {
				// Deselecting, so shuffle down 1
				newButtonStates[j].selectedPosition = position - 1;
			} else if (nextPosition === maxCoinsSelected && position === maxCoinsSelected) {
				// Selecting more than max, bump off the last selected
				newButtonStates[j].selectedPosition = null;
				newColorStack.push(newButtonStates[j].color);
				newButtonStates[j].color = null;
			}
		}

		// Set the new position
		newButtonStates[coin].selectedPosition = nextPosition;
		if (!nextPosition) {
			newColorStack.push(newButtonStates[coin].color);
			newButtonStates[coin].color = null;
		} else {
			newButtonStates[coin].color = newColorStack.pop();
		}

		setColorStack(newColorStack);
		setButtonStates(newButtonStates);
	}

	const lineInfoList: line_info_S[] = useMemo(() => {
		const list = [];

		for (let i = 0; i < buttonStates.length; i++) {
			if (buttonStates[i].selectedPosition !== null) {
				// Is selected
				list.push({
					coin: buttonStates[i].coin,
					color: buttonStates[i].color,
				});
			}
		}

		return list;
	}, [buttonStates]);

	const coinButtons = useMemo(() => {
		// Make a copy of the button states and reorder them
		const orderedButtonStates = JSON.parse(JSON.stringify(buttonStates)); // deep copy
		orderedButtonStates.sort((a, b) => {
			// Sort so that the first selected are shown first
			if (a.selectedPosition === b.selectedPosition) return 0;
			if (a.selectedPosition === null) return 1;
			if (b.selectedPosition === null) return -1;
			return a.selectedPosition - b.selectedPosition;
		});

		const buttons = orderedButtonStates.map((buttonState, i) => {
			return (
				<CoinButton
					key={i}
					coin={buttonState.coin}
					// value={ values ? values[COIN_INFO[buttonState.coin].name] : 0}
					value={buttonState.value}
					color={buttonState.color} // The order in coinStates, and coinList must stay the same
					selected={buttonState.selectedPosition !== null}
					allowDeselect={buttonState.coin !== mainCoin && lineInfoList.length > 1}
					clickCallback={() => handleCoinButtonClick(buttonState.coin)}
				/>
			);
		});

		return buttons;
	}, [buttonStates, lineInfoList]);

	return (
		<StyledChartContainer>
			<TimeSeriesChart
				chartConfig={chartConfig}
				lineInfoList={lineInfoList}
				dataSelectors={dataSelectors}
				timeSelectors={timeSelectors}
				hoverDataCallback={handleHoverData}
			/>
			<Typography.header>Compare to:</Typography.header>
			<ScrollRow>{coinButtons}</ScrollRow>
		</StyledChartContainer>
	);
}
