import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Typography } from 'theme';

export const StyledLink = styled.a`
	text-decoration: none;
`;

// React router Link with style
export const StyledInternalLink = styled(Link)`
	text-decoration: none;
	color: ${({ theme }) => theme.color.linkInternal};
`;

const StyledExternalLinkWrapper = styled.a`
	text-decoration: none;
	color: ${({ theme }) => theme.color.linkExternal};
	:hover {
		color: ${({ theme }) => theme.color.primary1};
	}
`;

export function StyledExternalLink({ href, content }) {
	return (
		<StyledExternalLinkWrapper target="_blank" href={href}>
			{content}
		</StyledExternalLinkWrapper>
	);
}

export const StyledLogo = styled.img`
	width: ${({ size }) => size ?? '24px'};
	height: ${({ size }) => size ?? '24px'};
	border-radius: ${({ borderRadius, size }) => borderRadius ?? 'calc(' + size + '/ 2)'};
	margin-right: ${({ theme, marginRight }) => marginRight ?? theme.spacing.xs};
`;

const StyledSectionTitle = styled.div`
	width: ${({ width }) => width ?? '100%'};
	text-align: left;
	padding-top: 20px;
	margin-bottom: 8px;
`;

export function SectionTitle({ title, width }) {
	return (
		<StyledSectionTitle width={width}>
			<Typography.displayS paddingTop={'10px'}>{title}</Typography.displayS>
		</StyledSectionTitle>
	);
}

export const HideSmall = styled.div`
	${({ theme }) => theme.mediaWidth.small`
		display: none;
	`}
`;

export const Break = styled.div`
	height: ${({ theme }) => theme.border.thickness};
	background-color: ${({ theme }) => theme.color.border2};
	width: 100%;
`;

export const StyledDisclaimer = styled(Typography.caption)`
	color: ${({ theme }) => theme.color.text3};
	align-self: flex-start;
`;
