import React from "react";
import styled, { css } from "styled-components";

import { Typography } from "theme";

const StyledOptionButton = styled.button`
	padding: ${({ padding, theme }) => padding ?? theme.spacing.xs + " " + theme.spacing.md};
	border-radius: ${({ theme }) => theme.radius.md};
	border: none;
	background-color: ${({ theme, variant }) => (variant ? "transparent" : theme.color.bg1)};
	display: inline;
	width: ${({ width }) => width ?? "auto"};
	height: ${({ height }) => height ?? "auto"};
	:hover {
		cursor: pointer;
	}

	${({ active }) =>
		active
			? css`
					background-color: ${({ theme, variant }) => (variant ? theme.color.bg1 : theme.color.secondary1)};
					box-shadow: ${({ theme, variant }) => (variant ? theme.shadow.card : theme.shadow.none)};
			  `
			: css`
					:hover {
						background-color: ${({ theme }) => theme.color.bg2};
					}
			  `}

	${({ theme }) => theme.mediaWidth.extraSmall`
		padding: ${({ theme }) => theme.spacing.xs};
	`}
`;

const OptionButtonText = styled(Typography.headerSecondary)`
	${({ active }) =>
		active &&
		css`
			color: ${({ theme, variant }) => (variant ? theme.color.text1 : theme.color.primary1)};
		`}

	${({ theme }) => theme.mediaWidth.extraSmall`
		font-size: 14px;
	`}
`;

export const OptionButtonVariantBackdrop = styled.div`
	display: flex;
	padding: ${({ theme }) => theme.spacing.xxs};
	border-radius: ${({ theme }) => theme.radius.lg};
	background-color: ${({ theme }) => theme.color.bg0};
	column-gap: ${({ theme }) => theme.spacing.xs};
	width: ${({ width }) => width ?? "auto"};
`;

export function OptionButton({ buttonContent, padding, active, width, onClick, variant }) {
	return (
		<StyledOptionButton padding={padding} active={active} width={width} onClick={onClick} variant={variant}>
			<OptionButtonText active={active} variant={variant}>
				{buttonContent}
			</OptionButtonText>
		</StyledOptionButton>
	);
}
