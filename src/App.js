import React from 'react'
import styled from 'styled-components'
import ChartContainer from './components/chartContainer.js'
import { APY_CHART_TITLE, SELECTED_COIN_COLORS, APY_DATA_SELECTOR, ACTIVE_COIN } from './config'
import { fetchApyData, parseApyData }  from './contexts/apyData' 


function App(props) {
	return (
		<>
			<ChartContainer 
				title={APY_CHART_TITLE}
				selectedCoinColors={SELECTED_COIN_COLORS} 
				dataSelectors={APY_DATA_SELECTOR} 
				activeCoin={ACTIVE_COIN}
				fetchData={fetchApyData}
				parseData={parseApyData}
			/>
		</>
	);
}


export default App;
