import styled from "styled-components";

const Row = styled.div<{
	width?: string;
	height?: string;
	justify?: string;
	align?: string;
	border?: string;
	borderRadius?: string;
	margin?: string;
	padding?: string;
	gap?: string;
	flex?: number;
	overflow?: string;
	order?: string;
}>`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	width: ${({ width }) => width ?? "100%"};
	height: ${({ height }) => height ?? ""};
	justify-content: ${({ justify }) => justify ?? "flex-start"};
	align-items: ${({ align }) => align ?? "center"};
	padding: ${({ padding }) => padding ?? "0"};
	border: ${({ border }) => border};
	border-radius: ${({ borderRadius }) => borderRadius};
	margin: ${({ margin }) => margin ?? "0"};
	column-gap: ${({ gap, theme }) => gap ?? theme.spacing.xs};
	row-gap: ${({ gap, theme }) => gap ?? theme.spacing.xs};
	flex: ${({ flex }) => flex ?? 1};
	overflow: ${({ overflow }) => overflow ?? "hidden"};
`;

export const ScrollRow = styled(Row)`
	width: 100%;
	height: 100%;
	overflow-x: scroll;
	overflow-y: hidden;
	scroll-behavior: smooth;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
`;

export const ResponsiveRow = styled(Row)<{
	xs?: boolean;
	reverse?: boolean;
	gapSmall?: string;
}>`
	justify-content: space-between;
	${({ theme, xs, reverse, gapSmall }) =>
		xs
			? theme.mediaWidth.extraSmall`
				flex-direction: ${reverse ? "column-reverse" : "column"};
				row-gap: ${gapSmall ?? theme.spacing.xs};
				column-gap: ${gapSmall ?? theme.spacing.xs};
			`
			: theme.mediaWidth.small`
				flex-direction: ${reverse ? "column-reverse" : "column"};
				row-gap: ${gapSmall ?? theme.spacing.xs};
				column-gap: ${gapSmall ?? theme.spacing.xs};
			`}
`;

// Changes justification of content upon resize
export const ResponsiveJustifyRow = styled(Row)<{
	justifyLarge?: string;
	justifySmall?: string;
	justifyExtraSmall?: string;
}>`
	justify-content: ${({ justifyLarge }) => justifyLarge ?? "flex-start"};
	${({ theme, justifySmall }) => theme.mediaWidth.small`
		justify-content: ${justifySmall ?? "flex-start"};
	`}
	${({ theme, justifyExtraSmall, justifySmall }) => theme.mediaWidth.extraSmall`
		justify-content: ${justifyExtraSmall ?? justifySmall ?? "flex-start"};
	`}
`;

export default Row;
