import React from "react";
import styled, { useTheme } from "styled-components";

import { StyledInternalLink } from "components/Link";
import Row from "components/Row";
import Column from "components/Column";
import GasTracker from "components/GasTracker";
import { Typography } from "theme";
import { HideSmall } from "components/shared";
import { IconButton } from "components/Button/iconButton";

const StyledHeader = styled(Row)`
	width: 100%;
	background-color: ${({ theme }) => theme.color.bg0};
	justify-content: space-between;
	padding: ${({ theme }) => theme.spacing.sm + " " + theme.spacing.md};
	align-items: center;
	z-index: 999;
`;

const DataErrorBanner = styled(Row)`
	width: 100%;
	color: ${({ theme }) => theme.color.warning};
	padding: ${({ theme }) => theme.spacing.md};
	justify-content: center;
	background-color: ${({ theme }) => theme.color.warning2};
	text-align: center;
`;

export default function Header({ showDataErrorWarning }: { showDataErrorWarning: boolean }): JSX.Element {
	const theme = useTheme();

	return (
		<>
			<DataErrorBanner>
				<Typography.header color={theme.color.warning1}>
					This site is currently experiencing data issues and we are actively working on a fix.
				</Typography.header>
			</DataErrorBanner>
			<StyledHeader>
				<StyledInternalLink to="/">
					<Typography.displayL>Compound Info</Typography.displayL>
				</StyledInternalLink>
				<HideSmall>
					<Row>
						<IconButton />
						{/* <GasTracker /> */}
					</Row>
				</HideSmall>
			</StyledHeader>
		</>
	);
}
