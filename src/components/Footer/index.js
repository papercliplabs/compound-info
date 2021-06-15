import React from 'react';
import styled, { useTheme } from 'styled-components';
import { StyledLogo, StyledExternalLink, StyledInternalLink } from 'theme/components';
import { ResponsiveRow } from 'components/Row';
import Column from 'components/Column';
import { URLS } from 'constants/index';
import { Typography } from 'theme';
import { Break, HideSmall } from 'theme/components';

const StyledFooter = styled.div`
	display: flex;
	height: 72px;
	width: 100%;
	background-color: ${({ theme }) => theme.color.bg0};
	align-items: center;
	padding-bottom: 30px;
	padding-top: 50px;

	${({ theme }) => theme.mediaWidth.small`
		padding-bottom: 180px;
	`}
`;

export default function Footer() {
	const theme = useTheme();

	return (
		<StyledFooter>
			<Column>
				<Break />
				<ResponsiveRow padding={theme.spacing.lg} justify="space-between">
					<Typography.subheader>
						Made by <StyledExternalLink href={URLS.PAPERCLIP_HOME} content="Paperclip Labs" />
					</Typography.subheader>
					<Typography.subheader>
						Powered by <StyledExternalLink href={URLS.FLIPSIDE} content="Flipside Crypto" /> and{' '}
						<StyledExternalLink href={URLS.COMPOUND_DOCS} content="Compound API" />
					</Typography.subheader>
				</ResponsiveRow>
			</Column>
		</StyledFooter>
	);
}
