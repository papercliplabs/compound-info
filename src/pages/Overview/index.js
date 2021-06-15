import React, { useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { Typography } from 'theme';
import { StyledLogo, SectionTitle, StyledDisclaimer } from 'theme/components';
import Row, { ResponsiveRow } from 'components/Row';
import compoundLogo from 'assets/compoundLogo.svg';
import Card, { StatCard, ProgressCard } from 'components/Card';
import CoinTable from 'components/CoinTable';
import { useSummaryData } from 'store/hooks';

const TableCard = styled(Card)`
	padding: ${({ theme }) => theme.spacing.md + ' ' + theme.spacing.lg};
	${({ theme }) => theme.mediaWidth.small`
	padding: ${({ theme }) => theme.spacing.md + ' ' + theme.spacing.md};
		
	`}
`;

const tableDataKeysAndUnits = [
	{ key: 'totalSupply', unit: '$' },
	{ key: 'supplyApy', unit: '%' },
	{ key: 'totalBorrow', unit: '$' },
	{ key: 'borrowApy', unit: '%' },
];

export default function Overview() {
	const theme = useTheme();
	const gap = theme.spacing.md;
	const summaryData = useSummaryData();

	console.log(summaryData);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	if (!summaryData) {
		return null; // Loading summary data
	}

	const protocolData = summaryData['ALL'];

	return (
		<>
			<Row height="40px" margin={'20px 0'}>
				<StyledLogo src={compoundLogo} size="40px" />
				<Typography.displayXL>Compound Protocol</Typography.displayXL>
			</Row>
			<SectionTitle title="Compound Overview" />
			<ResponsiveRow gap={gap}>
				<StatCard
					title={'Total supplied'}
					tooltipContent="The total amount of funds supplied to Compound. (USD)"
					value={protocolData.totalSupply}
					unit="$"
				/>
				<StatCard
					title={'Total unique active users'}
					tooltipContent="Number of non-duplicate users between all markets"
					value={protocolData.numberOfUniqueSuppliers}
				/>
			</ResponsiveRow>
			<ResponsiveRow gap={gap}>
				<StatCard
					title={'Total reserves'}
					tooltipContent="Compound takes a portion of all the interest paid by borrowers and stores it in a pool that acts as  insurance for lenders against borrower default and liquidation. The reserve pool is controlled by COMP token holders. (USD)"
					value={protocolData.totalReserves}
					unit="$"
				/>
				<ProgressCard
					title={'Utilization'}
					tooltipContent="How much of the total supply is in use at a given time. If there's $100 in the pool and no one borrows anything, the utilization rate is 0%. If someone borrows $10, it's 10%, and so on. If an asset is 100% utilized, there's nothing in the pool right now - suppliers can't withdraw their original cash, and borrowers can't take out loans."
					value={protocolData.utilization}
					unit="%"
					size={60}
					progressPercent={protocolData.utilization}
				/>
				<StatCard
					title={'Total borrowed'}
					tooltipContent="The total amount of funds borrowed from Compound. (USD)"
					value={protocolData.totalBorrow}
					unit="$"
				/>
			</ResponsiveRow>
			<SectionTitle title="All Markets" />
			<TableCard>
				<CoinTable data={summaryData} keysAndUnits={tableDataKeysAndUnits} />
			</TableCard>
			<StyledDisclaimer>APY does not include the COMP rewards</StyledDisclaimer>
		</>
	);
}

// Example of entry in summary data array:
// {
// 		availableLiquidity: 2581044854.164039
// 		borrowApy: 0.029142989872318985
// 		borrowCap: 0
// 		cTokenAddress: "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5"
// 		collateralFactor: 0.75
// 		distributionBorrowApy: 0.05544746889898233
// 		distributionSupplyApy: 0.00280334711686292
// 		marketSize: 2772817999.153234
// 		maxBorrow: 2772817999.153234
// 		name: "ETH"
// 		numberOfBorrowers: 894
// 		numberOfSuppliers: 63726
// 		reserveFactor: 0.2
// 		supplyApy: 0.0011928182048466943
// 		totalBorrow: 191773144.98919505
// 		totalReserves: 962590.8487683185
// 		totalSupply: 3697090665.5376453
// 		totalValueLocked: 3505317520.5484505
// 		underlyingAddress: null
// 		underlyingPrice: 2770.7049999999977
// 		utilization: 0.06916182203367077
// 	}
