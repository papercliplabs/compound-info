import React from "react";
import styled from "styled-components";

export const Break = styled.div`
	height: ${({ theme }) => theme.border.thickness};
	background-color: ${({ theme }) => theme.color.border2};
	width: 100%;
`;

export const HideSmall = styled.div`
	${({ theme }) => theme.mediaWidth.small`
		display: none;
	`}
`;
