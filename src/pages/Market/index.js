import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import ChartContainer from 'components/chartContainer'
import { COINS, TIME_SELECTORS, APY_CHART_TITLE, SELECTED_COIN_COLORS, APY_DATA_SELECTOR } from 'constants/index'
import { useApyData } from 'store'
import Card, { StatCard } from 'components/Card'
import Row, { ResponsiveRow } from 'components/Row'
import { Typography } from 'theme'
import { APY_DATA_SELECTORS } from 'constants/index'
import { getCoinInfo, getEtherscanLink, shortAddress } from 'utils'
import { StyledInternalLink, StyledExternalLink } from 'theme/components'


const SectionTitle = styled.div`
	width: 100%;
	text-align: left;
	padding-top: 20px;
`;

const CoinLogo = styled.img`
	height: 100%;
`;


// Main content of the market page
export default function Market({ match }) {
	const theme = useTheme();
	const gap = theme.spacing.card;
	
	const activeCoinName = match.params.coin;
	const activeCoin = getCoinInfo(activeCoinName);

	// Redirect to home if the param name doesn't match a coin
	if(!activeCoin) {
		return <Redirect to={'/'} /> 
	}

	const etherscanLink = getEtherscanLink(activeCoin.cAddress);

	return (
		<>
			<Row> 
				<Typography.header>
					<StyledInternalLink to={'/'}>Market </StyledInternalLink>
					{' > '} 
					<StyledExternalLink href={etherscanLink}>c{activeCoin.name} ({shortAddress(activeCoin.cAddress)})</StyledExternalLink>
				</Typography.header>
			</Row>

			<Row height='40px' margin={'20px 0'}> 
				<CoinLogo src={activeCoin.imgSrc} /> 
				<Typography.displayXL>{activeCoin.name}</Typography.displayXL>
			</Row>

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
					dataSelectors={APY_DATA_SELECTORS} 
					activeCoin={activeCoin}
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
