import React from 'react'
import ChartContainer from './components/chartContainer'
import { APY_CHART_TITLE, SELECTED_COIN_COLORS, APY_DATA_SELECTOR, ACTIVE_COIN } from './config'
import { COINS, TIME_SELECTORS } from './constants'
import { useApyData } from './store'

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
				useData={useApyData}
			/>
		</>
	);
}


export default App;
