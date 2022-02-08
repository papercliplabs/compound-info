import React from "react";
import styled, { useTheme } from "styled-components";

import { StyledExternalLink } from "components/Link";
import { ResponsiveRow } from "components/Row";
import Column from "components/Column";
import { URLS } from "common/constants";
import { Typography } from "theme";
import { Break } from "components/shared";

const StyledFooter = styled.div`
	display: flex;
	height: 72px;
	width: 100%;
	align-items: center;
	padding-bottom: 30px;
	padding-top: 50px;
	margin-top: ${({ theme }) => theme.spacing.xl};

	${({ theme }) => theme.mediaWidth.small`
		padding-bottom: 180px;
	`}
`;

export default function Footer() {
	const theme = useTheme();

	return (
		<StyledFooter>
			<Column>
				<Break />
				<ResponsiveRow padding={theme.spacing.lg + " 0"} justify="space-between">
					<Typography.subheader color={theme.color.text2}>
						© 2021{" "}
						<StyledExternalLink href={URLS.PAPERCLIP_HOME} variant="secondary">
							Paperclip Labs
						</StyledExternalLink>
					</Typography.subheader>
					<Typography.subheader color={theme.color.text2}>
						<ResponsiveRow gap={"32px"}>
							<StyledExternalLink href={URLS.COMPOUND_GRANTS} variant="secondary">
								Compound Grants Batch 2
							</StyledExternalLink>
							<StyledExternalLink href={URLS.GITHUB} variant="secondary">
								Github
							</StyledExternalLink>
						</ResponsiveRow>
					</Typography.subheader>
				</ResponsiveRow>
			</Column>
		</StyledFooter>
	);
}
