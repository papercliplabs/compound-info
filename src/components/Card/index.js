import React from 'react'
import styled  from 'styled-components'
import { Typography } from 'theme'
import { formatNumber } from 'utils'

const Card = styled.div`
	display: flex;
	border: solid ${({ theme })  => theme.border.thickness + ' ' + theme.color.border1};
	border-radius: ${({ theme }) => theme.border.radius};
	background-color: ${({ theme }) => theme.color.bg1};
	width: ${({ width }) => width ?? '100%'};
	padding: 30px;
	margin: 0;
`;


const StyledStatCard = styled(Card)`
	flex-direction: column;
`;


export function StatCard({ title, value, unit }) {
	const formattedValue = formatNumber(value, unit);
	return (
		<StyledStatCard>
			<Typography.subheader>{title?.toUpperCase()}</Typography.subheader>
			<Typography.displayL>{formattedValue}</Typography.displayL>
		</StyledStatCard>
	);
}
export default Card;
