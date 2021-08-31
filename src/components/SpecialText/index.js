import React from "react";
import styled from "styled-components";

import { Typography } from "theme";

const StyledSectionTitle = styled.div`
	width: ${({ width }) => width ?? "100%"};
	text-align: left;
	padding-top: 20px;
	margin-bottom: 8px;
`;

export function SectionTitle({ title, width }) {
	return (
		<StyledSectionTitle width={width}>
			<Typography.displayS paddingTop={"10px"}>{title}</Typography.displayS>
		</StyledSectionTitle>
	);
}

export const StyledDisclaimer = styled(Typography.caption)`
	color: ${({ theme }) => theme.color.text3};
	align-self: flex-start;
`;
