import React from 'react'
import styled  from 'styled-components'
import { Typography } from 'theme'

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


export function StatCard({ title, value }) {
	return (
		<StyledStatCard>
			<Typography.subheader>{title?.toUpperCase()}</Typography.subheader>
			<Typography.displayL>{value}</Typography.displayL>
		</StyledStatCard>
	);
}
export default Card;
