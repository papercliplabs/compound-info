// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import styled, { useTheme } from "styled-components";

import { Token, MarketDataSelector, TimeSelector, DataType } from "common/enums";
import { ChartConfig, LineInfo } from "common/types";
import { TOKEN_INFO } from "common/constants";

import TimeSeriesChart from "components/Chart/TimeSeriesChart";
import Row, { ScrollRow } from "components/Row";
import Button, { TokenButton } from "components/Button";
import { mediaQuerySizes, Typography } from "theme";
import { tokenToString } from "typescript";
import { HorizontalScrollButton } from "components/Button/horizontalScrollButton";

const StyledChartContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	row-gap: ${({ theme }) => theme.spacing.xs};
`;

const CoinRowWrapper = styled.div`
	display: ;
	position: relative;
	height: 50px;
`;

/**
 * Holds the state of the token buttons
 */
type TokenButtonStates = {
	[token in Tokens]: {
		token: Token;
		value: number | undefined;
		color: string | undefined;
		selectedPosition: number | undefined;
	};
};

function CoinRow({ children }) {
	const scroll = useRef();
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(true);

	const maxScrollLeft = scroll && scroll.current ? scroll.current.scrollWidth - scroll.current.clientWidth : 0;

	const showArrows = window.innerWidth > mediaQuerySizes.extraSmall;

	function onScroll() {
		const currentPos = scroll.current.scrollLeft;
		setShowLeftArrow(currentPos > 0);
		setShowRightArrow(currentPos < maxScrollLeft - 10); // -10 offset to not have at very end as this doesn't work in Chrome
	}

	function leftScroll() {
		// the leftmost point starts @ 0
		scroll.current.scrollBy({ top: 0, left: -300, behavior: "smooth" });
	}

	function rightScroll() {
		console.log(scroll);
		scroll.current.scrollBy({ top: 0, left: 300, behavior: "smooth" });
	}

	return (
		<CoinRowWrapper>
			<ScrollRow ref={scroll} onScroll={onScroll}>
				{children}
			</ScrollRow>
			{showArrows && showLeftArrow && <HorizontalScrollButton onClick={leftScroll} isRight={false} />}
			{showArrows && showRightArrow && <HorizontalScrollButton onClick={rightScroll} isRight={true} />}
		</CoinRowWrapper>
	);
}

function defaultButtonStates(mainToken: Token, mainColor: string): TokenButtonStates[] {
	const buttonStates = {};
	for (const token in Token) {
		const isMain = token === mainToken;
		buttonStates[token] = {
			token: token,
			value: undefined,
			color: isMain ? mainColor : null,
			selectedPosition: isMain ? 0 : null,
		};
	}

	return buttonStates;
}

/**
 * React element to display the time series chart, with coin selectors to derive the lineInfoList
 * @param chartConfig the chart configuration
 * @param dataSelectorOptions list of data selectors, if only 1 selector is provided buttons are not shown.
 * @param timeSelectorOptions list of the time selectors to show buttons for, if only 1 selector is provided no buttons are shown
 * @param mainToken the main token, if defined this will not allow deselecting of this token, and display the current value of this token in the top left of the chart container
 * @returns react element coin selector time series chart (time selectors, data selectors, and coin selectors)
 */
export default function TokenSelectorTimeSeriesChart({
	chartConfig,
	dataSelectorOptions,
	timeSelectorOptions,
	mainToken,
}: {
	chartConfig: ChartConfig;
	dataSelectorOptions: MarketDataSelector[];
	timeSelectorOptions: TimeSelector[];
	mainToken?: Token;
}): JSX.Element | null {
	const theme = useTheme();

	const [buttonStates, setButtonStates] = useState<TokenButtonStates>(
		defaultButtonStates(mainToken, theme.color.lineChartColors[0])
	);
	const [colorStack, setColorStack] = useState<string[]>(
		!!mainToken ? [...theme.color.lineChartColors].slice(1).reverse() : [...theme.color.lineChartColors].reverse()
	);

	// When the main token changes, reset button states
	useEffect(() => {
		// Clear colors and positions
		setButtonStates((prevState) => {
			const nextState = JSON.parse(JSON.stringify(prevState)); // deep copy
			for (const token in Token) {
				const isMain = token === mainToken;
				nextState[token].color = isMain ? theme.color.lineChartColors[0] : null;
				nextState[token].selectedPosition = isMain ? 0 : null;
			}
			return nextState;
		});
		// Reset color stack
		setColorStack(
			mainToken != null
				? [...theme.color.lineChartColors].slice(1).reverse()
				: [...theme.color.lineChartColors].reverse()
		);
	}, [mainToken, setButtonStates]);

	const handleHoverData = useCallback(
		(hoverData: any) => {
			setButtonStates((prevState) => {
				const nextState = JSON.parse(JSON.stringify(prevState)); // deep copy
				for (const token in Token) {
					nextState[token].value = hoverData[token] ?? "-";
				}
				return nextState;
			});
		},
		[setButtonStates]
	);

	function handleTokenButtonClick(token: Token) {
		// Copy old data
		const newColorStack = [...colorStack];
		const newButtonStates = JSON.parse(JSON.stringify(buttonStates)); // deep copy

		const maxTokensSelected = theme.color.lineChartColors.length;
		const allowDeselect = token !== mainToken && lineInfoList.length > 1;
		const numberSelected = maxTokensSelected - newColorStack.length;
		const currentPosition = newButtonStates[token].selectedPosition;

		let nextPosition;
		if (currentPosition === null) {
			// It is not selected, so select it
			nextPosition = Math.min(numberSelected + 1, maxTokensSelected);
		} else if (!allowDeselect) {
			// Can't deselect if not allowDeselect, or the last one
			return;
		} else {
			// Deselect
			nextPosition = null;
		}

		// Shuffling positions on deselect
		for (const tempToken in Token) {
			const position = newButtonStates[tempToken].selectedPosition;
			if (currentPosition && position > currentPosition) {
				// Deselecting, so shuffle down 1
				newButtonStates[tempToken].selectedPosition = position - 1;
			} else if (nextPosition === maxTokensSelected && position === maxTokensSelected) {
				// Selecting more than max, bump off the last selected
				newButtonStates[tempToken].selectedPosition = null;
				newColorStack.push(newButtonStates[tempToken].color);
				newButtonStates[tempToken].color = null;
			}
		}

		// Set the new position
		newButtonStates[token].selectedPosition = nextPosition;
		if (!nextPosition) {
			newColorStack.push(newButtonStates[token].color);
			newButtonStates[token].color = null;
		} else {
			newButtonStates[token].color = newColorStack.pop();
		}

		setColorStack(newColorStack);
		setButtonStates(newButtonStates);
	}

	const tokenButtons = useMemo(() => {
		// Make a copy of the button states and reorder them
		const copiedButtonStates = JSON.parse(JSON.stringify(buttonStates)); // deep copy
		const orderedButtonStateList = [];
		let numSelected = 0;
		for (const token in Token) {
			orderedButtonStateList.push(copiedButtonStates[token]);
			if (copiedButtonStates[token].selectedPosition !== null) {
				numSelected += 1;
			}
		}
		orderedButtonStateList.sort((a, b) => {
			// Sort so that the first selected are shown first
			if (a.selectedPosition === b.selectedPosition) return 0;
			if (a.selectedPosition === null) return 1;
			if (b.selectedPosition === null) return -1;
			return a.selectedPosition - b.selectedPosition;
		});

		const buttons = orderedButtonStateList.map((buttonState, i) => {
			return (
				<TokenButton
					key={i}
					token={buttonState.token}
					value={buttonState.value}
					color={buttonState.color} // The order in coinStates, and coinList must stay the same
					selected={buttonState.selectedPosition !== null}
					allowDeselect={buttonState.token !== mainToken && numSelected > 1}
					clickCallback={() => handleTokenButtonClick(buttonState.token)}
				/>
			);
		});

		return buttons;
	}, [buttonStates]);

	const lineInfoList: LineInfo[] = useMemo(() => {
		const list = [];
		for (const token in Token) {
			if (buttonStates[token].selectedPosition !== null) {
				list.push({
					key: token,
					color: buttonStates[token].color,
				});
			}
		}
		return list;
	}, [buttonStates]);

	return (
		<StyledChartContainer>
			<TimeSeriesChart
				chartConfig={chartConfig}
				token={mainToken}
				lineInfoList={lineInfoList}
				dataType={DataType.MARKET}
				dataSelectorOptions={dataSelectorOptions}
				timeSelectorOptions={timeSelectorOptions}
				hoverDataCallback={handleHoverData}
			/>
			<Typography.header>Compare to:</Typography.header>
			<CoinRow>{tokenButtons}</CoinRow>
		</StyledChartContainer>
	);
}
