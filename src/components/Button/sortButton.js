import React from 'react';
import styled, { css } from 'styled-components';
import { Typography } from 'theme';

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
