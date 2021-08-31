import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

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

const StyledExternalInfoLinkWrapper = styled.a`
	text-decoration: none;
	color: ${({ theme }) => theme.color.linkInternal};
	padding-right: ${({ theme }) => theme.spacing.md};
	:hover {
		text-decoration: underline;
	}
	a:active {
		text-decoration: none;
	}
`;

export function StyledExternalInfoLink({ href, content }) {
	return (
		<StyledExternalInfoLinkWrapper target="_blank" href={href}>
			{content}
		</StyledExternalInfoLinkWrapper>
	);
}
