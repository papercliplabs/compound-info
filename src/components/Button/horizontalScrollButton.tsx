import React from "react";
import styled from "styled-components";

import Button from "./";
import leftArrowSvg from "assets/leftArrow.svg";
import rightArrowSvg from "assets/rightArrow.svg";
import Row from "components/Row";

const HorizontalScrollButtonWrapper = styled(Row)`
	height: 100%;
	width: 100%;
	border-radius: 25px;
	justify-content: center;
	align-content: center;
	background-color: ${({ theme }) => theme.color.bg3};
	box-shadow: ${({ theme }) => theme.shadow.card};
`;

const BackgroupWrapper = styled(Row)<{
	isRight?: boolean;
}>`
	width: 50px;
	height: 50px;
	background: ${({ theme, isRight }) =>
		`linear-gradient(${isRight ? "-90deg" : "90deg"}, ${theme.color.bg1} 0%, ${
			theme.color.bg1
		} 50%, rgb(00, 00, 00, 00) 51%)`};

	display: flex;

	:hover {
		cursor: pointer;
	}
	right: ${({ isRight }) => (isRight ? "0" : "auto")};
	left: ${({ isRight }) => (isRight ? "auto" : "0")};
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	height: 100%;
	width: 50px;
`;

export function HorizontalScrollButton({ onClick, isRight }: { onClick: any; isRight: boolean }) {
	return (
		<Button onClick={onClick}>
			<BackgroupWrapper isRight={isRight}>
				<HorizontalScrollButtonWrapper>
					{isRight ? <img src={rightArrowSvg} /> : <img src={leftArrowSvg} />}
				</HorizontalScrollButtonWrapper>
			</BackgroupWrapper>
		</Button>
	);
}
