import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import CoinButton from './buttons/coinButton'
import OptionRow from './optionRow'
import { formatPercent } from '../utils'


function defaultCoinStates(coinList) {
	return coinList.map((coinData, i) => {
		return {name: coinData.name, color: null, selectedPosition: null}
	});
}

export default function CoinRow({ coinList, selectedCoinColors, updateSelectedCoins}) {
	const [colorStack, setColorStack] = useState(selectedCoinColors.reverse());
	const [coinStates, setCoinStates] = useState(defaultCoinStates(coinList));


	// On mount, set up the default selected and colors
	useEffect(() => {
		let noneSelected = true;
		coinList.forEach((coinInfo, i) => {
			if(!coinInfo.allowDeselect) {
				handleClick(i);
				noneSelected = false;
			}
		});

		// If there are none selected, select the first
		if(noneSelected) {
			handleClick(0);
		}
	}, []);


	// Callback to parent with new selected coins and colors
	useEffect(() => {
		let selectedCoinsAndColors = coinStates.filter(coinState => coinState.selectedPosition !== null);
		selectedCoinsAndColors = selectedCoinsAndColors.map((coinState) => {return {name: coinState.name, color: coinState.color}});
		updateSelectedCoins(selectedCoinsAndColors);
	}, [coinStates]);


	// Handles changing selected state, color, and reordering
	function handleClick(i) {
		let newColorStack = colorStack.slice();
		let newCoinStates = JSON.parse(JSON.stringify(coinStates)); // deep copy
		
		const maxCoinsSelected = selectedCoinColors.length;
		const currentPosition = newCoinStates[i].selectedPosition;
		const numberSelected = getNumberSelected();

		let nextPosition;
		if(currentPosition === null) { // It is not selected, so select it
			nextPosition = Math.min(numberSelected + 1, maxCoinsSelected);
		} else if(!coinList[i].allowDeselect || numberSelected === 1) { // Can't deselect if not allowDeselect, or the last one
			return;
		} else { // Deselect
			nextPosition = null; 
		}	

		// Reordering other selected positions
		for(let j = 0; j < newCoinStates.length; j++) {
			let position = newCoinStates[j].selectedPosition;
			if(currentPosition && position > currentPosition) { // Deselecting, so shuffle down 1
				newCoinStates[j].selectedPosition = position - 1;
			} else if(nextPosition === maxCoinsSelected && position === maxCoinsSelected) { // Selecting more than max, bump off the last selected
				newCoinStates[j].selectedPosition = null;
				newColorStack.push(coinStates[j].color);
				newCoinStates[j].color = null;
			}
		}
		
		// Set the new position
		newCoinStates[i].selectedPosition = nextPosition; 
		if(!nextPosition) {
			newColorStack.push(coinStates[i].color);
			newCoinStates[i].color = null;
		} else {
			newCoinStates[i].color = newColorStack.pop();
		}

		// Sort so that the first selected are shown first
		newCoinStates.sort((a, b) => {
			if(a.selectedPosition === b.selectedPosition) return 0;
			if(a.selectedPosition === null) return 1;
			if(b.selectedPosition === null) return -1;
			return a.selectedPosition - b.selectedPosition;
		});

		setColorStack(newColorStack);
		setCoinStates(newCoinStates);
	}


	// Helpers
	function getNumberSelected() {
		const numberSelected = coinStates.reduce((T, coinState) => {
			return coinState.selectedPosition !== null ? T + 1 : T;
		}, 0);
		return numberSelected;
	}


	// Render
	const numberSelected = getNumberSelected();
	const coinButtons = coinStates.map((coinState, i) => {
		const coinData = coinList.filter(obj => obj.name === coinState.name)[0];
		const allowDeselect = coinData.allowDeselect && numberSelected > 1; // One must always be selected
		return (
			<CoinButton 
				key={i}
				name={coinState.name} 
				color={coinState.color} // The order in coinStates, and coinList must stay the same
				selected={coinState.selectedPosition !== null} 
				value={formatPercent(coinData.value ? coinData.value : 0)}
				onClick={() => handleClick(i)}
				allowDeselect={allowDeselect}
			/>
		);
	});

	return (
		<OptionRow>
			{coinButtons}
		</OptionRow>
	);
}
