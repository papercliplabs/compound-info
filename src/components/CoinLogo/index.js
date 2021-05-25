import React from 'react';
import { getCoinImgSource } from 'utils';
import { StyledLogo } from 'theme/components';

export default function CoinLogo({ name, size }) {
	const imgSrc = getCoinImgSource(name);
	return <StyledLogo src={imgSrc} size={size} />;
}
