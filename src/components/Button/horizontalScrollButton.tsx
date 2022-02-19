import React from "react";
import styled from "styled-components";

import Button from "./";
import leftArrowSvg from "assets/leftArrow.svg";
import rightArrowSvg from "assets/rightArrow.svg";
import Row from "components/Row";

const HorizontalScrollButtonWrapper = styled(Row)<{
	isRight?: boolean;
}>`
	display: flex;
	justify-content: center;
	align-content: center;
	:hover {
		cursor: pointer;
	}
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background-color: ${({ theme }) => theme.color.bg3};
	height: 100%;
	width: 50px;
	border-radius: 25px;

	right: ${({ isRight }) => (isRight ? "0" : "auto")};
	left: ${({ isRight }) => (isRight ? "auto" : "0")};
`;

export function HorizontalScrollButton({ onClick, isRight }: { onClick: any; isRight: boolean }) {
	return (
		<Button onClick={onClick}>
			<HorizontalScrollButtonWrapper isRight={isRight}>
				{isRight ? <img src={rightArrowSvg} /> : <img src={leftArrowSvg} />}
			</HorizontalScrollButtonWrapper>
		</Button>
	);
}
