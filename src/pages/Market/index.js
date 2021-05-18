import React from 'react'
import styled, { useTheme } from 'styled-components'
import ChartContainer from 'components/chartContainer'
import { COINS, TIME_SELECTORS, APY_CHART_TITLE, SELECTED_COIN_COLORS, APY_DATA_SELECTOR, ACTIVE_COIN } from 'constants/index'
import { useApyData } from 'store'
import Card, { StatCard } from 'components/Card'
import { ResponsiveRow } from 'components/Row'
import { Typography } from 'theme'


const SectionTitle = styled.div`
	width: 100%;
	text-align: left;
	padding-top: 20px;
`;

export default function Market() {
	const theme = useTheme();
	const gap = theme.spacing.card;
	return (
		<>
			TODO: Markets + Coin (address with link), and coin logo and name

			<ResponsiveRow gap={gap}>	
				<StatCard title={'Total value locked'} value={1234.22} />
				<StatCard title={'Number of supliers'} value={100} />
				<StatCard title={'Reserves'} value={100} />
			</ResponsiveRow>

			<SectionTitle>
				<Typography.displayS paddingTop={'10px'}>APY Performence</Typography.displayS>
			</SectionTitle>
			<Card>
				<ChartContainer 
					selectedCoinColors={SELECTED_COIN_COLORS} 
					dataSelectors={APY_DATA_SELECTOR} 
					activeCoin={ACTIVE_COIN}
					coins={COINS}
					timeSelectors={TIME_SELECTORS}
					useData={useApyData}
				/>
			</Card>

			<SectionTitle>
				<Typography.displayS paddingTop={'10px'}>Key Statistics</Typography.displayS>
			</SectionTitle>
			<ResponsiveRow gap={gap}>	
				<StatCard title={'Total value locked'} value={1234.22} />
				<StatCard title={'Number of supliers'} value={100} />
				<StatCard title={'Reserves'} value={100} />
				<StatCard title={'Reserves'} value={100} />
			</ResponsiveRow>
			<ResponsiveRow gap={gap}>	
				<StatCard title={'Total value locked'} value={1234.22} />
				<StatCard title={'Number of supliers'} value={100} />
				<StatCard title={'Reserves'} value={100} />
				<StatCard title={'Reserves'} value={100} />
			</ResponsiveRow>

			<SectionTitle>
				<Typography.displayS paddingTop={'10px'}>Utilization</Typography.displayS>
			</SectionTitle>
			TODO: utilization chart, supply amount, borrow amount, and utilization over time

			<SectionTitle>
				<Typography.displayS paddingTop={'10px'}>Discover More</Typography.displayS>
			</SectionTitle>
			TODO: cards of the other markets, click on it and it will swap to others
		</>
	);
}
