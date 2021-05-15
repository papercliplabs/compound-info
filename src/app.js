import React from 'react'
import styled from 'styled-components'
import ChartContainer from './components/chartContainer'
import { APY_CHART_TITLE, SELECTED_COIN_COLORS, APY_DATA_SELECTOR, ACTIVE_COIN } from './config'
import { COINS, TIME_SELECTORS } from './constants'
import { fetchApyData, parseApyData }  from './contexts/apyData' 



function App() {
	return (
		<>
			<ChartContainer 
				title={APY_CHART_TITLE}
				selectedCoinColors={SELECTED_COIN_COLORS} 
				dataSelectors={APY_DATA_SELECTOR} 
				activeCoin={ACTIVE_COIN}
				coins={COINS}
				timeSelectors={TIME_SELECTORS}
				fetchData={fetchApyData}
				parseData={parseApyData}
			/>
		</>
	);
}


export default App;
