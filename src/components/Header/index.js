import React from "react";
import styled, { useTheme } from "styled-components";

import { StyledInternalLink } from "components/Link";
import Row from "components/Row";
import GasTracker from "components/GasTracker";
import { Typography } from "theme";
import { HideSmall } from "components/shared";
import { IconButton } from "components/Button/iconButton";

// 'BF' on the background color uses RRGGBBAA, giving 75% alpha on the background color
const StyledHeader = styled.div`
	display: flex;
	height: 72px;
	width: 100%;
	background-color: ${({ theme }) => theme.color.bg0};
	align-items: center;
`;

export default function Header() {
	const theme = useTheme();

	return (
		<StyledHeader>
			<Row padding={"0 " + theme.spacing.lg} justify="space-between">
				<Row>
					<StyledInternalLink to="/">
						<Typography.displayL>Compound Info</Typography.displayL>
					</StyledInternalLink>
				</Row>
				<HideSmall>
					<Row>
						<IconButton />
						<GasTracker />
					</Row>
				</HideSmall>
			</Row>
		</StyledHeader>
	);
}
