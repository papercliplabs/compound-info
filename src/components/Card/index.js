import React from 'react';
import styled from 'styled-components';
import { Typography } from 'theme';
import { formatNumber } from 'utils';

const Card = styled.div`
	display: flex;
	border: solid ${({ theme }) => theme.border.thickness + ' ' + theme.color.border1};
	border-radius: ${({ theme }) => theme.border.radius};
	background-color: ${({ theme }) => theme.color.bg1};
	width: ${({ width }) => width ?? '100%'};
	padding: ${({ padding, theme }) => padding ?? theme.spacing.roomy};
	margin: 0;
	box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1), inset 0px 1px 6px rgba(255, 255, 255, 0.05);
	row-gap: 8px;
`;

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
export default Card;
