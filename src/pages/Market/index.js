import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useTheme } from 'styled-components';
import ChartContainer from 'components/chartContainer';
import { useApyData, useSummaryData } from 'store/hooks';
import Card, { StatCard, ProgressCard } from 'components/Card';
import Row, { ResponsiveRow } from 'components/Row';
import Column from 'components/Column';
import { Typography } from 'theme';
import { APY_DATA_SELECTORS } from 'constants/index';
import { formatNumber, getCoinInfo, getEtherscanLink, shortAddress } from 'utils';
import { SectionTitle, StyledInternalLink, StyledExternalLink } from 'theme/components';
import CoinLogo from 'components/CoinLogo';
import TooltipText from 'components/TooltipText';

function StatRow({ title, value, unit, tooltipContent }) {
	const formattedValue = formatNumber(value, unit);
	return (
		<Row justify="space-between">
			<TooltipText
				baseText={<Typography.headerSecondary>{title}</Typography.headerSecondary>}
				tooltipContent={tooltipContent}
			></TooltipText>
			<Typography.header>{formattedValue}</Typography.header>
		</Row>
	);
}

// Main content of the market page
export default function Market({ match }) {
	const theme = useTheme();
	const gap = theme.spacing.md;
	const activeCoinName = match.params.coin;
	const activeCoin = getCoinInfo(activeCoinName);
	const coinData = useSummaryData(activeCoinName);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [match]);

	// Redirect to home if the param name doesn't match a coin
	if (!activeCoin) {
		return <Redirect to={'/'} />;
	}

	if (!coinData) {
		return null; // Loading the summary data
	}

	const etherscanLink = getEtherscanLink(coinData.cTokenAddress);

	return (
		<>
			<Row>
				<Typography.body>
					<StyledInternalLink to={'/'}>Market</StyledInternalLink>
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
			<ResponsiveRow reverse align="flex-start" gap={gap}>
				<Column flex={2} gap={gap}>
					<SectionTitle title="APY Performence" />
					<Card>
						<ChartContainer dataSelectors={APY_DATA_SELECTORS} activeCoin={activeCoin} useData={useApyData} />
					</Card>
					<SectionTitle title="Key Statistics" />
					<Card>
						<ResponsiveRow gap={theme.spacing.xl} gapSmall={theme.spacing.lg}>
							<Column gap={theme.spacing.lg}>
								<StatRow title={'Token price'} tooltipContent="temp" value={coinData.underlyingPrice} unit="$" />
								<StatRow title={'Reserve factor'} tooltipContent="temp" value={coinData.reserveFactor} unit="%" />
								<StatRow title={'Number of suppliers'} tooltipContent="temp" value={coinData.numberOfSuppliers} />
								<StatRow title={'Number of borrowers'} tooltipContent="temp" value={coinData.numberOfBorrowers} />
							</Column>
							<Column gap={theme.spacing.lg}>
								<StatRow title={'Collateral factor'} tooltipContent="temp" value={coinData.collateralFactor} unit="%" />
								<StatRow title={'Total borrow'} tooltipContent="temp" value={coinData.totalBorrow} unit="$" />
								<StatRow
									title={'Borrow cap'}
									tooltipContent="temp"
									value={coinData.borrowCap ? coinData.borrowCap : 'No limit'}
								/>
								<StatRow
									title={'Available liquidity'}
									tooltipContent="temp"
									value={coinData.availableLiquidity}
									unit="$"
								/>
							</Column>
						</ResponsiveRow>
					</Card>
				</Column>
				<Column gap={gap}>
					<SectionTitle title="Market Overview" />
					<StatCard title={'Total supplied'} tooltipContent="temp" value={coinData.totalSupply} unit="$" />
					<ProgressCard
						title={'Utilization'}
						tooltipContent="temp"
						value={coinData.utilization}
						unit="%"
						size={60}
						progressPercent={coinData.utilization}
					/>
					<StatCard title={'Reserves'} tooltipContent="temp" value={coinData.totalReserves} unit="$" />
				</Column>
			</ResponsiveRow>
		</>
	);
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
