import React from 'react';
import styled, { useTheme } from 'styled-components';
import { StyledLogo, StyledExternalLink, StyledInternalLink } from 'theme/components';
import headerLogo from 'assets/headerLogo.svg';
import Row from 'components/Row';
import GasTracker from 'components/GasTracker';
import { URLS } from 'constants/index';
import { Typography } from 'theme';
import { HideSmall } from 'theme/components';

// 'BF' on the background color uses RRGGBBAA, giving 75% alpha on the background color
const StyledHeader = styled.div`
	display: flex;
	height: 72px;
	width: 100%;
	background-color: ${({ theme }) => theme.color.bg0};
	align-items: center;
`;

export default function Header() {
	const theme = useTheme();

	return (
		<StyledHeader>
			<Row padding={'0 ' + theme.spacing.large} justify="space-between">
				<HideSmall>
					<StyledExternalLink href={URLS.PAPERCLIP_HOME}>
						<StyledLogo src={headerLogo} size="40px" />
					</StyledExternalLink>
				</HideSmall>
				<Row justify="center">
					<StyledInternalLink to="/">
						<Typography.displayL>Compound Info</Typography.displayL>
					</StyledInternalLink>
				</Row>
				<HideSmall>
					<GasTracker />
				</HideSmall>
			</Row>
		</StyledHeader>
	);
}
