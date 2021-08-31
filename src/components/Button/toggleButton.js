import React from "react";
import styled from "styled-components";

const StyledToggleButton = styled.div`
	width: 40px;
	height: 20px;
	position: relative;
`;

const Track = styled.div`
	width: 34px;
	height: 14px;
	top: 3px;
	left: 3px;
	border-radius: 7px;
	background-color: ${({ active, theme }) => (active ? theme.color.primary1 : theme.color.bg4)};
	position: absolute;
`;

const Knob = styled.div`
	background-color: ${({ theme }) => theme.color.white};
	width: 20px;
	height: 20px;
	border-radius: 10px;
	position: absolute;
	z-index: 9999;
	left: ${({ active }) => (active ? "20px" : "0px")};
`;

export function ToggleButton({ active, onClick }) {
	return (
		<StyledToggleButton onClick={onClick}>
			<Track active={active} />
			<Knob active={active} />
		</StyledToggleButton>
	);
}
