import React from 'react';
import styled from 'styled-components';
import Button from './';
import leftArrow from 'assets/leftArrow.svg';
import rightArrow from 'assets/rightArrow.svg';
import emptyLeft from 'assets/emptyLeft.svg';
import emptyRight from 'assets/emptyRight.svg';

const HorizontalScrollButtonWrapper = styled.div`
	positon: relative;
	border-radius: ${({ theme }) => theme.radius.md};
`;

const StyledIconButton = styled.img`
	:hover {
		cursor: pointer;
	}
`;

const StyledHiddenIconButton = styled.img`
	:hover {
		cursor: default;
	}
`;

export function HorizontalScrollButton({ show, onClick, isLeft }) {
	return (
		<>
			<HorizontalScrollButtonWrapper>
				{show ? (
					<Button onClick={onClick}>
						{isLeft ? <StyledIconButton src={leftArrow} /> : <StyledIconButton src={rightArrow} />}
					</Button>
				) : (
					<Button>
						{/* Need to add an image to avoid a visible shift when hiding the icon */}
						{isLeft ? <StyledHiddenIconButton src={emptyLeft} /> : <StyledHiddenIconButton src={emptyRight} />}
					</Button>
				)}
			</HorizontalScrollButtonWrapper>
		</>
	);
}
