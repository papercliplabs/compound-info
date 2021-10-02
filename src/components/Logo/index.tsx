import React from "react";
import styled from "styled-components";

import { coin_E } from "common/enums";
import { COIN_INFO } from "common/constants";

const Logo = styled.img<{
	size?: string;
	borderRadius?: number;
	marginRight?: number;
}>`
	width: ${({ size }) => size ?? "24px"};
	height: ${({ size }) => size ?? "24px"};
	border-radius: ${({ borderRadius, size }) => borderRadius ?? "calc(" + size + "/ 2)"};
	margin-right: ${({ theme, marginRight }) => marginRight ?? theme.spacing.xs};
`;

export default Logo;

export function CoinLogo({ coin, size }: { coin: coin_E; size?: string }): JSX.Element {
	const imgSrc = COIN_INFO[coin].imgSrc;

	return <Logo src={imgSrc} size={size} />;
}
