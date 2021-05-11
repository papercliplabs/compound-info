import React from 'react'
import styled, { css } from 'styled-components'
import OptionRow from './optionRow'
import OptionButton from './buttons'
import CoinButton from './buttons/coinButton'
import MultilineChart from './multilineChart'
import { formatPercent } from '../utils'

const StyledChartContainer = styled.div`
	border: solid ${({ theme })  => theme.border.thickness + ' ' + theme.color.border1};
	border-radius: ${({ theme }) => theme.border.radius};
	max-width: 1024px;
	padding: 15px;
	margin: auto;
`;

class ChartContainer extends React.Component {
	constructor(props) {
		super(props);

		// Set inital state for coins, activeCoin will get selected in componentDidMount
		const coinStates = this.props.coins.map((coin, i) => {
			return (
				{'name': coin.name, 'selectedPosition': null, 'value': null, 'color': null, 'cAddress': coin.cAddress} 
			);
		});
		
		this.state = {
			coinStates: coinStates,
			dataSelector: this.props.dataSelectors[0],
			timeSelector: this.props.timeSelectors.slice(-1)[0],
			activeCoin: this.props.activeCoin,
			maxCoinsSelected: this.props.selectedCoinColors.length,
			colorStack: this.props.selectedCoinColors.reverse(),
			hoverDate: 0, // Non null to trigger initial load
			rawData: null,
			parsedData: null,
		};
	}

	async componentDidMount() {
		// Simulate selecting the active coin to trigger reorder
		const activeCoin = this.state.activeCoin;
		if(activeCoin) {
			this.handleCoinButtonClick(this.state.coinStates.findIndex(coin => coin.name === activeCoin.name)); 
		} else {
			this.handleCoinButtonClick(0);
		}

		const rawData = await this.props.fetchData();

		this.setState({
			rawData: rawData,				
		})
		this.updateData(this.props.dataSelectors[0], this.props.timeSelectors.slice(-1)[0]);
		this.handleHoverDate(null); // Trigger loading coin values on load
	}

	//// Function handlers - callbacks for child components
	// Handles chaning selected state, color, and reordering, all logic for the coin selector is here
	handleCoinButtonClick = (i) => {
		let coinStates = JSON.parse(JSON.stringify(this.state.coinStates)); // Deep copy
		let colorStack = this.state.colorStack.slice();
		const maxCoinsSelected = this.state.maxCoinsSelected;
		const currentPosition = coinStates[i].selectedPosition;
		const numberSelected = coinStates.reduce((T, coinState) => {
			return coinState.selectedPosition > 0 ? T + 1 : T;
		}, 0);

		let nextPosition;
		if(!currentPosition) { // It is not selected, so select it
			nextPosition = Math.min(numberSelected + 1, maxCoinsSelected);
		} else if(coinStates[i].name === this.props.activeCoin?.name || numberSelected === 1) { // Can't deselect active coin, or the last one
			return;
		} else { // Deselect
			nextPosition = null; 
		}	

		// Reordering others 
		for(let j = 0; j < coinStates.length; j++) {
			let position = coinStates[j].selectedPosition;
			if(currentPosition && position > currentPosition) { // Deselecting, so shuffle down 1
				coinStates[j].selectedPosition = position - 1;
			} else if(nextPosition === maxCoinsSelected && position === maxCoinsSelected) { // Selecting more than max, bump off the last selected
				coinStates[j].selectedPosition = null;
				colorStack.push(coinStates[j].color);
				coinStates[j].color = null;
			}
		}

		coinStates[i].selectedPosition = nextPosition; // Set the new position
		if(!nextPosition) {
			colorStack.push(coinStates[i].color);
			coinStates[i].color = null;
		} else {
			coinStates[i].color = colorStack.pop();
		}

		// Sort so that the first selected are shown first
		coinStates.sort((a, b) => {
			if(a.selectedPosition === b.selectedPosition) return 0;
			if(!a.selectedPosition) return 1;
			if(!b.selectedPosition) return -1;
			return a.selectedPosition - b.selectedPosition;
		});

		this.setState({
			coinStates: coinStates,
			colorStack: colorStack,
		});
	}

	handleTimeSelectorClick = (i) => {
		const newTimeSelector = this.props.timeSelectors[i];
		this.updateData(this.state.dataSelector, newTimeSelector);
	}

	handleDataSelectorClick = (i) => {
		const newDataSelector = this.props.dataSelectors[i];
		this.updateData(newDataSelector, this.state.timeSelector);
	}
	
	handleHoverDate = (hoverDate) => {
		if(hoverDate === this.state.hoverDate) { // Gaurd that the data has changed, as this function will get called in an infinite state change loop
			return
		}

		this.setState({hoverDate: hoverDate})

		let coinStates = JSON.parse(JSON.stringify(this.state.coinStates)); // Deep copy

		const currentCoinValues = this.state.parsedData?.slice(-1)[0];
		const coinValuesOnHoverDate = this.state.parsedData?.filter(entry => entry.blockTime === hoverDate)[0];
		if(!currentCoinValues) return;

		coinStates = coinStates.map((coinState) => {
			if(coinState.selectedPosition === null || !hoverDate || !coinValuesOnHoverDate) {
				coinState.value = currentCoinValues[coinState.name];
			} else {
				coinState.value = coinValuesOnHoverDate[coinState.name];
			}
			return coinState;
		});

		this.setState({
			coinStates: coinStates,
		})
	}

	
	//// Helpers
	updateData = (dataSelector, timeSelector) => {
		const data = this.props.parseData(this.state.rawData, dataSelector, timeSelector)		

		this.setState({
			parsedData: data,
			dataSelector: dataSelector,
			timeSelector: timeSelector,
		})
	}
	
	render() {
		const coinButtons = this.state.coinStates.map((coin, i) => {
			return (
				<CoinButton 
					key={i}
					name={coin.name} 
					color={coin.color} 
					imgPath={coin.imgPath}
					selected={coin.selectedPosition !== null} 
					value={formatPercent(coin.value ? coin.value : 0)}
					onClick={() => this.handleCoinButtonClick(i)}
					activeCoin={coin.name === this.props.activeCoin?.name}
				/>
			);
		});
	
		const dataSelectorButtons = this.props.dataSelectors.map((selector, i) => {
			return (
				<OptionButton 
					key={i} 
					active={this.state.dataSelector === selector}
					onClick={() => this.handleDataSelectorClick(i)}
				>
					{selector.name}
				</OptionButton>
			);
		});

		const timeSelectorButtons = this.props.timeSelectors.map((selector, i) => {
			return (
				<OptionButton 
					key={i} 
					active={this.state.timeSelector === selector}
					onClick={() => this.handleTimeSelectorClick(i)}
				>
					{selector.name}
				</OptionButton>
			);
		});

		let selectedCoinColor = this.state.coinStates.filter(coinState => coinState.selectedPosition !== null);
		selectedCoinColor = selectedCoinColor.map(coinState => {
			return {'name': coinState.name, 'color': coinState.color};
		})

		return (
			<StyledChartContainer>
				{this.props.title}
				<OptionRow>
					<OptionRow>
						{dataSelectorButtons}
					</OptionRow>
					<OptionRow justify='flex-end'>
						{timeSelectorButtons}
					</OptionRow>
				</OptionRow>

				<MultilineChart data={this.state.parsedData} selectedCoinColor={selectedCoinColor} setHoverDate={(date) => this.handleHoverDate(date)} />

				Compare to:
				<OptionRow>				
					{coinButtons}
				</OptionRow>
			</StyledChartContainer>
		);
	}
}


export default ChartContainer;
