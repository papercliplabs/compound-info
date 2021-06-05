import React from 'react';
import styled, { css } from 'styled-components';
import { Typography } from 'theme';

const Button = styled.button`
	background: none;
	border: none;
	padding: 0;
`;

export default Button;

export const OptionButtonStyle = styled.button`
	padding: ${({ padding }) => padding ?? '6px'};
	border-radius: ${({ theme }) => theme.radius.lg};
	border: none;
	background-color: ${({ active, theme }) => (active ? theme.color.secondary1 : theme.color.bg1)};
	width: ${({ width }) => width ?? 'auto'};
	display: inline;
`;

const OptionButtonText = styled(Typography.subheader)`
	${({ active }) =>
		active &&
		css`
			color: ${({ theme }) => theme.color.primary1};
		`}
`;

export function OptionButton({ buttonContent, padding, active, width, onClick }) {
	return (
		<OptionButtonStyle padding={padding} active={active} width={width} onClick={onClick}>
			<OptionButtonText active={active}>{buttonContent}</OptionButtonText>
		</OptionButtonStyle>
	);
}

const StyledSortButton = styled(Typography.header)`
	user-select: none;

	:hover {
		cursor: pointer;
		opacity: ${({ active }) => (active ? 1 : 0.7)};
	}

	${({ active }) =>
		active &&
		css`
			color: ${({ theme }) => theme.color.primary1};
		`}
`;

export function SortButton({ name, isActive, isAsc, handleClick }) {
	return (
		<StyledSortButton onClick={handleClick} active={isActive}>
			{name} {isActive ? (isAsc ? '↑' : '↓') : null}
		</StyledSortButton>
	);
}
