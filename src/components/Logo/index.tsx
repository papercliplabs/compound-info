import React from "react";
import styled from "styled-components";

import { Token } from "common/enums";
import { TOKEN_INFO } from "common/constants";

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

export function CoinLogo({ token, size }: { token: Token; size?: string }): JSX.Element {
	const imgSrc = TOKEN_INFO[token].imgSrc;

	return <Logo src={imgSrc} size={size} />;
}
