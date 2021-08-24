import React from 'react';
import styled from 'styled-components';
import Button from './';
import leftArrow from 'assets/leftArrow.svg';
import rightArrow from 'assets/rightArrow.svg';

const HorizontalScrollButtonWrapper = styled.img`
	:hover {
		cursor: pointer;
	}
`;

export function HorizontalScrollButton({ onClick, isLeft }) {
	return (
		<>
			<Button onClick={onClick}>
				{isLeft ? (
					<HorizontalScrollButtonWrapper src={leftArrow} />
				) : (
					<HorizontalScrollButtonWrapper src={rightArrow} />
				)}
			</Button>
		</>
	);
}
