import React from "react";
import styled from "styled-components";

import Column from "components/Column";

const SvgContainer = styled.svg`
	height: ${({ size }) => size}px;
	width: ${({ size }) => size}px;
	transform: rotate(-90deg);
`;

const BackCircle = styled.circle`
	stroke: ${({ theme }) => theme.color.secondary1};
	r: ${({ r }) => r}px;
	cx: 50%;
	cy: 50%;
	fill: none;
	stroke-width: ${({ strokeWidth }) => strokeWidth};
	stroke-dasharray: ${({ circumference }) => circumference};
	stroke-dashoffset: ${({ circumference, value }) => circumference * (1 - value)};
`;

const ProgressCircle = styled(BackCircle)`
	stroke: ${({ theme }) => theme.color.lineChartColors[0]};
`;

// Value from 0 to 1
export default function ProgressRing({ size, value }) {
	const strokeWidth = 8; //px
	const r = size / 2 - strokeWidth;
	const circumference = Math.PI * 2 * r;
	return (
		<Column justify="center" align="flex-end">
			<SvgContainer size={size}>
				<BackCircle r={r} strokeWidth={strokeWidth} circumference={circumference} value={1} />
				<ProgressCircle r={r} strokeWidth={strokeWidth} circumference={circumference} value={Math.min(value, 1)} />
			</SvgContainer>
		</Column>
	);
}
