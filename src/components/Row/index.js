import styled from 'styled-components';

const Row = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	width: ${({ width }) => width ?? '100%'};
	height: ${({ height }) => height ?? 'none'};
	justify-content: ${({ justify }) => justify ?? 'flex-start'};
	align-items: ${({ align }) => align ?? 'center'};
	padding: ${({ padding }) => padding ?? '0'};
	border: ${({ border }) => border};
	border-radius: ${({ borderRadius }) => borderRadius};
	margin: ${({ margin }) => margin ?? '0'};
	column-gap: ${({ gap, theme }) => gap ?? theme.spacing.default};
	row-gap: ${({ gap, theme }) => gap ?? theme.spacing.default};
`;

export const ScrollRow = styled(Row)`
	flex-wrap: nowrap;
	overflow-x: scroll;
	overflow-y: hidden;

	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
`;

export const RowSpaced = styled(Row)`
	justify-content: space-between;
`;

export const ResponsiveRow = styled(RowSpaced)`
	${({ theme }) => theme.mediaWidth.small`
		flex-direction: column;
		row-gap: 5px;
	`}
`;

// Changes justification of content upon resize
export const ResponsiveJustifyRow = styled(Row)`
	justify-content: ${({ justifyLarge }) => justifyLarge ?? 'flex-start'};
	${({ theme }) => theme.mediaWidth.small`
		justify-content: ${({ justifySmall }) => justifySmall ?? 'flex-start'};
	`}
`;

export default Row;
export { CoinRow } from './coinRow';
