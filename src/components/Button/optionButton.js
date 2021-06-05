import React from 'react';
import styled, { css } from 'styled-components';
import { Typography } from 'theme';

const StyledOptionButton = styled.button`
	padding: ${({ padding, theme }) => padding ?? theme.spacing.xs};
	border-radius: ${({ theme }) => theme.radius.md};
	border: none;
	background-color: ${({ theme, variant }) => (variant ? 'transparent' : theme.color.bg1)};
	width: ${({ width }) => width ?? 'auto'};
	display: inline;

	${({ active }) =>
		active &&
		css`
			background-color: ${({ theme, variant }) => (variant ? theme.color.bg1 : theme.color.secondary1)};
		`}
`;

const OptionButtonText = styled(Typography.headerSecondary)`
	${({ active }) =>
		active &&
		css`
			color: ${({ theme, variant }) => (variant ? theme.color.text1 : theme.color.primary1)};
		`}
`;

export const OptionButtonVariantBackdrop = styled.div`
	display: flex;
	padding: ${({ theme }) => theme.spacing.xxs};
	border-radius: ${({ theme }) => theme.radius.lg};
	background-color: ${({ theme }) => theme.color.bg0};
	column-gap: ${({ theme }) => theme.spacing.xs};
	width: ${({ width }) => width ?? 'auto'};
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
