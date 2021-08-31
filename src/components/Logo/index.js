import React from "react";
import styled from "styled-components";

import { getCoinImgSource } from "common/utils";

const Logo = styled.img`
	width: ${({ size }) => size ?? "24px"};
	height: ${({ size }) => size ?? "24px"};
	border-radius: ${({ borderRadius, size }) => borderRadius ?? "calc(" + size + "/ 2)"};
	margin-right: ${({ theme, marginRight }) => marginRight ?? theme.spacing.xs};
`;

export default Logo;

export function CoinLogo({ name, size }) {
	const imgSrc = getCoinImgSource(name);
	return <Logo src={imgSrc} size={size} />;
}
