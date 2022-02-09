import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const StyledLink = styled.a`
	text-decoration: none;
`;

// React router Link with style
export const StyledInternalLink = styled(Link)`
	text-decoration: none;
	color: ${({ theme }) => theme.color.linkInternal};
`;

const StyledExternalLinkWrapper = styled.a<{
	variant?: string;
}>`
	text-decoration: none;
	color: ${({ theme }) => theme.color.primary1};
	:hover {
		opacity: 0.8;
	}

	${({ variant, theme }) =>
		variant == "secondary" &&
		css`
			color: ${theme.color.linkExternal};
			:hover {
				color: ${({ theme }) => theme.color.primary1};
			}
		`}
`;

export function StyledExternalLink({ href, variant, children }: { href: string; variant?: string; children: any }) {
	return (
		<StyledExternalLinkWrapper target="_blank" href={href} variant={variant}>
			{children}
		</StyledExternalLinkWrapper>
	);
}

const StyledExternalInfoLinkWrapper = styled.a`
	text-decoration: none;
	color: ${({ theme }) => theme.color.linkInternal};
	:hover {
		opacity: 0.8;
	}
	a:active {
		text-decoration: none;
	}
`;

export function StyledExternalInfoLink({ href, content }: { href: string; content: any }) {
	return (
		<StyledExternalInfoLinkWrapper target="_blank" href={href}>
			{content}
		</StyledExternalInfoLinkWrapper>
	);
}
