import React from 'react';
import styled, { useTheme } from 'styled-components';
import { StyledLogo, StyledExternalLink, StyledInternalLink } from 'theme/components';
import Row from 'components/Row';
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
	margin-top: 60px;
`;

export default function Footer() {
	const theme = useTheme();

	return (
		<StyledFooter>
			<Column>
				<Break />
				<Row padding={'0 ' + theme.spacing.large} justify="space-between">
					<Typography.subheader>
						Made by <StyledExternalLink href={URLS.PAPERCLIP_HOME}>Paperclip Labs</StyledExternalLink>
					</Typography.subheader>
					<Typography.subheader>
						Powered by <StyledExternalLink href={URLS.FLIPSIDE}>Flipside Crypto</StyledExternalLink> and{' '}
						<StyledExternalLink href={URLS.COMPOUND_DOCS}> Compound API </StyledExternalLink>
					</Typography.subheader>
				</Row>
			</Column>
		</StyledFooter>
	);
}
