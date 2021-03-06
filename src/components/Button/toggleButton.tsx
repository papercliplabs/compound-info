import React from "react";
import styled, { keyframes } from "styled-components";

const StyledToggleButton = styled.div`
	width: 40px;
	height: 20px;
	position: relative;
`;

const Track = styled.div<{
	active: boolean;
}>`
	width: 34px;
	height: 14px;
	top: 3px;
	left: 3px;
	border-radius: 7px;
	background-color: ${({ active, theme }) => (active ? theme.color.primary1 : theme.color.bg4)};
	position: absolute;
`;

const Knob = styled.div<{
	active: boolean;
}>`
	background-color: ${({ theme }) => theme.color.white};
	width: 20px;
	height: 20px;
	border-radius: 10px;
	position: absolute;
	left: ${({ active }) => (active ? "20px" : "0px")};
	transition: 300ms all;
`;

export function ToggleButton({ active, onClick }: { active: boolean; onClick: any }) {
	return (
		<StyledToggleButton onClick={onClick}>
			<Track active={active} />
			<Knob active={active} />
		</StyledToggleButton>
	);
}
