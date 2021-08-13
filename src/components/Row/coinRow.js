import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from 'styled-components';
import { CoinButton } from 'components/Button';
import { ScrollRow } from './index';
import Row from 'components/Row';
import { formatNumber } from 'utils';
import { COINS } from 'constants/index';
import { HorizontalScrollButton } from 'components/Button/horizontalScrollButton';

function defaultCoinStates() {
	return COINS.map((coinData, i) => {
		return { name: coinData.name, color: null, selectedPosition: null };
	});
}

export function CoinRow({ activeCoin, coinList, updateSelectedCoins }) {
	const theme = useTheme();
	const [colorStack, setColorStack] = useState([...theme.color.lineChartColors].reverse());
	const [coinStates, setCoinStates] = useState(defaultCoinStates());
	const loaded = useRef(false);
	const scroll = useRef();

	// Helpers
	const getNumberSelected = useCallback(() => {
		const numberSelected = coinStates.reduce((T, coinState) => {
			return coinState.selectedPosition !== null ? T + 1 : T;
		}, 0);
		return numberSelected;
	}, [coinStates]);

	// Handles changing selected state, color, and reordering
	const handleClick = useCallback(
		(i) => {
			let newColorStack = colorStack.slice();
			let newCoinStates = JSON.parse(JSON.stringify(coinStates)); // deep copy

			const maxCoinsSelected = theme.color.lineChartColors.length;
			const currentPosition = newCoinStates[i].selectedPosition;
			const allowDeselect = coinList.filter((coin) => coin.name === coinStates[i].name)[0].allowDeselect;
			const numberSelected = getNumberSelected();

			let nextPosition;
			if (currentPosition === null) {
				// It is not selected, so select it
				nextPosition = Math.min(numberSelected + 1, maxCoinsSelected);
			} else if (!allowDeselect || numberSelected === 1) {
				// Can't deselect if not allowDeselect, or the last one
				return;
			} else {
				// Deselect
				nextPosition = null;
			}

			// Reordering other selected positions
			for (let j = 0; j < newCoinStates.length; j++) {
				let position = newCoinStates[j].selectedPosition;
				if (currentPosition && position > currentPosition) {
					// Deselecting, so shuffle down 1
					newCoinStates[j].selectedPosition = position - 1;
				} else if (nextPosition === maxCoinsSelected && position === maxCoinsSelected) {
					// Selecting more than max, bump off the last selected
					newCoinStates[j].selectedPosition = null;
					newColorStack.push(coinStates[j].color);
					newCoinStates[j].color = null;
				}
			}

			// Set the new position
			newCoinStates[i].selectedPosition = nextPosition;
			if (!nextPosition) {
				newColorStack.push(coinStates[i].color);
				newCoinStates[i].color = null;
			} else {
				newCoinStates[i].color = newColorStack.pop();
			}

			// Sort so that the first selected are shown first
			newCoinStates.sort((a, b) => {
				if (a.selectedPosition === b.selectedPosition) return 0;
				if (a.selectedPosition === null) return 1;
				if (b.selectedPosition === null) return -1;
				return a.selectedPosition - b.selectedPosition;
			});

			setColorStack(newColorStack);
			setCoinStates(newCoinStates);
		},
		[colorStack, coinStates, getNumberSelected, coinList, theme.color.lineChartColors.length]
	);

	// On mount, set up the default selected and colors
	useEffect(() => {
		if (!loaded.current) {
			let noneSelected = true;
			coinList.forEach((coinInfo, i) => {
				if (!coinInfo.allowDeselect) {
					handleClick(i);
					noneSelected = false;
				}
			});

			// If there are none selected, select the first
			if (noneSelected) {
				handleClick(0);
			}
			loaded.current = true;
		}
	}, [handleClick, coinList]);

	// Callback to parent with new selected coins and colors
	useEffect(() => {
		let selectedCoinsAndColors = coinStates.filter((coinState) => coinState.selectedPosition !== null);
		selectedCoinsAndColors = selectedCoinsAndColors.map((coinState) => {
			return { name: coinState.name, color: coinState.color };
		});
		updateSelectedCoins(selectedCoinsAndColors);
	}, [coinStates, updateSelectedCoins]);

	// When activeCoin changes, reset default selected
	useEffect(() => {
		setColorStack([...theme.color.lineChartColors].reverse()); // Array copy
		setCoinStates(defaultCoinStates());
		loaded.current = false;
	}, [activeCoin, setCoinStates, theme.color.lineChartColors]);

	// Render
	const numberSelected = getNumberSelected();
	const coinButtons = coinStates.map((coinState, i) => {
		const coinData = coinList.filter((obj) => obj.name === coinState.name)[0];
		const allowDeselect = coinData.allowDeselect && numberSelected > 1; // One must always be selected
		return (
			<CoinButton
				key={i}
				name={coinState.name}
				color={coinState.color} // The order in coinStates, and coinList must stay the same
				selected={coinState.selectedPosition !== null}
				value={formatNumber(coinData.value ? coinData.value : 0, '%')}
				onClick={() => handleClick(i)}
				allowDeselect={allowDeselect}
			/>
		);
	});

	function leftScroll() {
		// the leftmost point starts @ 0
		scroll.current.scrollLeft -= 200;
	}

	function rightScroll() {
		scroll.current.scrollLeft += 200;
	}

	return (
		<Row>
			<HorizontalScrollButton isLeft={true} onClick={() => leftScroll()}></HorizontalScrollButton>
			<ScrollRow ref={scroll}>{coinButtons}</ScrollRow>
			<HorizontalScrollButton isLeft={false} onClick={() => rightScroll()}></HorizontalScrollButton>
		</Row>
	);
}
