import React from 'react';
import styled from 'styled-components';
import Button from './';
import leftArrow from 'assets/leftArrow.svg';
import rightArrow from 'assets/rightArrow.svg';

const HorizontalScrollButtonWrapper = styled.div`
	positon: relative;
	border-radius: ${({ theme }) => theme.radius.md};
`;

const StyledIconButton = styled.img`
	:hover {
		cursor: pointer;
	}
`;

export function HorizontalScrollButton({ onClick, isLeft }) {
	return (
		<HorizontalScrollButtonWrapper>
			<Button onClick={onClick}>
				{isLeft ? <StyledIconButton src={leftArrow} /> : <StyledIconButton src={rightArrow} />}
			</Button>
		</HorizontalScrollButtonWrapper>
	);
}
