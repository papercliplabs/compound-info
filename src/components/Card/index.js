import React from 'react';
import styled from 'styled-components';
import { Typography } from 'theme';
import { formatNumber } from 'utils';
import ProgressRing from 'components/ProgressRing';
import Row from 'components/Row';
import Column from 'components/Column';

const Card = styled.div`
	display: flex;
	flex-direction: ${({ column }) => (column ? 'column' : 'row')};
	border: solid ${({ theme }) => theme.border.thickness + ' ' + theme.color.border1};
	border-radius: ${({ theme }) => theme.radius.lg};
	background-color: ${({ theme }) => theme.color.bg1};
	height: ${({ height }) => height ?? '100%'};
	width: ${({ width }) => width ?? '100%'};
	padding: ${({ padding, theme }) => padding ?? theme.spacing.lg};
	margin: 0;
	box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1), inset 0px 1px 6px rgba(255, 255, 255, 0.05);
	row-gap: 8px;
`;

export default Card;

const StyledStatCard = styled(Card)`
	flex-direction: column;
`;

export function StatCard({ title, value, unit }) {
	const formattedValue = formatNumber(value, unit);
	return (
		<StyledStatCard>
			<Typography.header>{title}</Typography.header>
			<Typography.displayL>{formattedValue}</Typography.displayL>
		</StyledStatCard>
	);
}

// progressValue is a number from 0 to 1
export function ProgressCard({ title, value, unit, size, progressValue }) {
	const formattedValue = formatNumber(value, unit);
	return (
		<Card>
			<Column align="left">
				<Typography.header>{title}</Typography.header>
				<Typography.displayL>{formattedValue}</Typography.displayL>
			</Column>
			<ProgressRing value={progressValue ?? value} size={size} />
		</Card>
	);
}
