import React from "react";
import styled from "styled-components";

export * from "./optionButton";
export * from "./coinButton";
export * from "./sortButton";
export * from "./toggleButton";

const Button = styled.button`
	background: none;
	border: none;
	padding: 0;
	:hover {
		cursor: pointer;
	}
`;

export default Button;
