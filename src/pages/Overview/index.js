import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Typography } from 'theme';
import { StyledLogo, SectionTitle } from 'theme/components';
import Row, { ResponsiveRow } from 'components/Row';
import compoundLogo from 'assets/compoundLogo.svg';
import Card, { StatCard } from 'components/Card';
import CoinTable from 'components/CoinTable';
import { useSummaryData } from 'store/hooks';

const TableCard = styled(Card)`
	padding: 0 ${({ theme }) => theme.spacing.large};
`;

const tableDataKeysAndUnits = [
	{ key: 'totalSupply', unit: '$' },
	{ key: 'supplyApy', unit: '%' },
	{ key: 'totalBorrow', unit: '$' },
	{ key: 'borrowApy', unit: '%' },
];

export default function Overview() {
	const theme = useTheme();
	const gap = theme.spacing.card;
	const summaryData = useSummaryData();

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
				<StatCard title={'Total supplied'} value={protocolData.totalSupply} unit="$" />
				<StatCard title={'Total unique active users'} value={protocolData.numberOfUniqueSuppliers} />
			</ResponsiveRow>
			<ResponsiveRow gap={gap}>
				<StatCard title={'Total reserves'} value={protocolData.totalReserves} unit="$" />
				<StatCard title={'Utilization'} value={protocolData.utilization} unit="%" />
				<StatCard title={'Total borrowed'} value={protocolData.totalBorrow} unit="$" />
			</ResponsiveRow>
			<SectionTitle title="All Markets" />
			<TableCard>
				<CoinTable data={summaryData} keysAndUnits={tableDataKeysAndUnits} />
			</TableCard>
			TODO: media query the keys to change what is shown in table based on screen size
		</>
	);
}
