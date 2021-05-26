import React from 'react';
import { Redirect } from 'react-router-dom';
import { useTheme } from 'styled-components';
import ChartContainer from 'components/chartContainer';
import { useApyData, useSummaryData } from 'store/hooks';
import Card, { StatCard } from 'components/Card';
import Row, { ResponsiveRow } from 'components/Row';
import { Typography } from 'theme';
import { APY_DATA_SELECTORS } from 'constants/index';
import { getCoinInfo, getEtherscanLink, shortAddress } from 'utils';
import { SectionTitle, StyledInternalLink, StyledExternalLink } from 'theme/components';
import CoinLogo from 'components/CoinLogo';

// Main content of the market page
export default function Market({ match }) {
	const theme = useTheme()
	const gap = theme.spacing.card
	const activeCoinName = match.params.coin
	const activeCoin = getCoinInfo(activeCoinName)
	const coinData = useSummaryData(activeCoinName)

	// Redirect to home if the param name doesn't match a coin
	if (!activeCoin) {
		return <Redirect to={'/'} />;
	}

	if (!coinData) {
		return null; // Loading the summary data
	}

	const etherscanLink = getEtherscanLink(coinData.cTokenAddress)

	return (
		<>
			<Row>
				<Typography.body>
					<StyledInternalLink to={'/'}>Market </StyledInternalLink>
					{' > '}
					<StyledExternalLink href={etherscanLink}>
						c{activeCoin.name} ({shortAddress(coinData.cTokenAddress)})
					</StyledExternalLink>
				</Typography.body>
			</Row>
			<Row height="40px" margin={'20px 0'}>
				<CoinLogo name={activeCoinName} size="40px" />
				<Typography.displayXL>{activeCoin.name}</Typography.displayXL>
			</Row>
			<SectionTitle title="Market Overview" />
			<ResponsiveRow gap={gap}>
				<StatCard title={'Total supplied'} value={coinData.totalSupply} unit="$" />
				<StatCard title={'Utilization'} value={coinData.utilization} unit="%" />
				<StatCard title={'Reserves'} value={coinData.totalReserves} unit="$" />
			</ResponsiveRow>
			<SectionTitle title="APY Performence" />
			<Card>
				<ChartContainer dataSelectors={APY_DATA_SELECTORS} activeCoin={activeCoin} useData={useApyData} />
			</Card>
			<SectionTitle title="Key Statistics" />
			<ResponsiveRow gap={gap}>
				<StatCard title={'Token price'} value={coinData.underlyingPrice} unit="$" />
				<StatCard title={'Reserve factor'} value={coinData.reserveFactor} unit="%" />
				<StatCard title={'Number of suppliers'} value={coinData.numberOfSuppliers} />
				<StatCard title={'Number of borrowers'} value={coinData.numberOfBorrowers} />
			</ResponsiveRow>
			<ResponsiveRow gap={gap}>
				<StatCard title={'Collateral factor'} value={coinData.collateralFactor} unit="%" />
				<StatCard title={'Total borrow'} value={coinData.totalBorrow} unit="$" />
				<StatCard title={'Borrow cap'} value={coinData.borrowCap ? coinData.borrowCap : 'No limit'} />
				<StatCard title={'Available liquidity'} value={coinData.availableLiquidity} unit="$" />
			</ResponsiveRow>
			<SectionTitle title="Utilization" />
			TODO: utilization chart, supply amount, borrow amount, and utilization over time
			<SectionTitle title="Dicvoer More" />
			TODO: cards of the other markets, click on it and it will swap to others
		</>
	)
}

// Example of coinData:
// {
// 		availableLiquidity: 2407457643.3461146
//		borrowCap: 0
//		cTokenAddress: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5"
//		collateralFactor: 0.75
//		distributionBorrowApy: 0.09400693398056958
//		distributionSupplyApy: 0.0033289338526691914
//		marketSize: 2532336280.5858564
//		maxBorrow: 2532336280.5858564
//		name: "ETH"
//		numberOfBorrowers: 899
//		numberOfSuppliers: 63142
//		reserveFactor: 0.2
//		totalBorrow: 124878637.2397417
//		totalReserves: 793847.2521822633
//		totalSupply: 3376448374.1144753
//		totalValueLocked: 3251569736.8747334
//		underlyingAddress: null
//		underlyingPrice: 2373.9900000000016
//		utilization: 0.0493136074371809
//	}
