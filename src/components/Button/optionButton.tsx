import { auto } from "@popperjs/core";
import React from "react";
import styled, { css } from "styled-components";

import { Typography } from "theme";

const StyledOptionButton = styled.button<{
	padding?: number;
	variant?: boolean;
	width?: string;
	height?: string;
	active?: boolean;
	flex?: number;
}>`
	padding: ${({ padding, theme }) => padding ?? theme.spacing.xs + " " + theme.spacing.md};
	border-radius: ${({ theme }) => theme.radius.md};
	border: none;
	background-color: ${({ theme, variant }) => (variant ? "transparent" : theme.color.bg1)};
	display: inline;
	flex: ${({ flex }) => flex ?? 0};
	width: ${({ width }) => width ?? "auto"};
	height: ${({ height }) => height ?? "auto"};
	:hover {
		cursor: pointer;
	}

	${({ active, theme, variant }) =>
		active
			? css`
					background-color: ${variant ? theme.color.bg1 : theme.color.bg2};
					box-shadow: ${variant ? theme.shadow.card : theme.shadow.none};
			  `
			: css`
					:hover {
						background-color: ${theme.color.bg2};
					}
			  `}

	${({ theme }) => theme.mediaWidth.extraSmall`
		padding: ${theme.spacing.xs};
	`}
`;

const OptionButtonText = styled(Typography.header)<{
	active?: boolean;
	variant?: boolean;
}>`
	color: ${({ theme }) => theme.color.text2};
	${({ active, variant }) =>
		active &&
		css`
			color: ${({ theme }) => (variant ? theme.color.text1 : theme.color.white)};
		`}

	${({ theme }) => theme.mediaWidth.extraSmall`
		font-size: 14px;
	`}
`;

export const OptionButtonVariantBackdrop = styled.div<{
	width?: string;
}>`
	display: flex;
	padding: ${({ theme }) => theme.spacing.xxs};
	border-radius: ${({ theme }) => theme.radius.lg};
	background-color: ${({ theme }) => theme.color.bg0};
	column-gap: ${({ theme }) => theme.spacing.xs};
	width: ${({ width }) => width ?? "auto"};
`;

export function OptionButton({
	buttonContent,
	padding,
	active,
	width,
	variant,
	flex,
	onClick,
}: {
	buttonContent: any;
	padding?: number;
	active: boolean;
	width?: string;
	variant?: boolean;
	flex?: number;
	onClick?: () => void;
}) {
	return (
		<StyledOptionButton padding={padding} active={active} width={width} onClick={onClick} variant={variant} flex={flex}>
			<OptionButtonText active={active} variant={variant}>
				{buttonContent}
			</OptionButtonText>
		</StyledOptionButton>
	);
}
