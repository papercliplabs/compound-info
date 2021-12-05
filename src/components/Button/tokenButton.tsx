import React from "react";
import styled, { css } from "styled-components";

import { Typography } from "theme";
import { CoinLogo } from "components/Logo";
import { StyledInternalLink } from "components/Link";
import closeIcon from "assets/closeIcon.svg";
import { Token } from "common/enums";
import { TOKEN_INFO } from "common/constants";
import { formatNumber } from "common/utils";

const StyledCoinButton = styled.button<{
	active: boolean;
	selectedColor: string;
}>`
	background-color: ${({ theme }) => theme.color.bg1};

	display: flex;
	align-items: center;
	border: solid ${({ theme }) => theme.border.thickness + " " + theme.color.border1};
	background-color: ${({ theme }) => theme.color.bg2};
	padding: "6px";
	border-radius: ${({ theme }) => theme.radius.lg};
	height: 100%;
	box-shadow: ${({ theme }) => theme.shadow.card};

	:hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.color.bg3};
	}

	${({ active, selectedColor }) =>
		active &&
		css`
			border-width: 2px;
			border-color: ${selectedColor};
			:hover {
				background-color: ${({ theme }) => theme.color.bg2};
			}
		`}
`;

const SelectedIndicator = styled.div<{ selectedColor: string }>`
	display: ${({ hidden }) => (hidden ? "none" : "flex")};
	background-color: ${({ selectedColor }) => selectedColor};
	width: 8px;
	height: 8px;
	border-radius: ${({ theme }) => theme.radius.lg};
	margin-right: ${({ theme }) => theme.spacing.xs};
`;

const CoinInfo = styled.div`
	min-width: 50px;
	display: flex;
	flex-direction: column;
	text-align: left;
	margin-right: ${({ theme }) => theme.spacing.xs};
`;

const CloseIndicator = styled.img<{
	hidden: boolean;
}>`
	display: ${({ hidden }) => (hidden ? "none" : "flex")};
	border-radius: 4px;
	margin-left: ${({ theme }) => theme.spacing.xs};
	opacity: 0.7;
	padding: 4px;

	:hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.color.bg3};
		opacity: 1;
	}
`;

const HoverText = styled.span`
	:hover {
		color: ${({ theme }) => theme.color.text2};
	}
`;

export function TokenButton({
	token,
	value,
	color,
	selected,
	allowDeselect,
	clickCallback,
}: {
	token: Token;
	value: number;
	color: string;
	selected: boolean;
	allowDeselect: boolean;
	clickCallback: () => void;
}): JSX.Element | null {
	const open = selected ? undefined : clickCallback;
	const coinName = TOKEN_INFO[token].symbol;
	return (
		<StyledCoinButton selectedColor={color} active={selected} onClick={open}>
			<SelectedIndicator selectedColor={color} hidden={!selected} />
			<CoinLogo token={token} />
			<CoinInfo>
				{selected && allowDeselect ? (
					<StyledInternalLink to={"/" + coinName}>
						<Typography.header useDefaultLineHeight>
							<HoverText>{coinName}</HoverText>
						</Typography.header>
					</StyledInternalLink>
				) : (
					<Typography.header useDefaultLineHeight>{coinName}</Typography.header>
				)}
				<Typography.caption useDefaultLineHeight>{formatNumber(value, "%")}</Typography.caption>
			</CoinInfo>
			<CloseIndicator src={closeIcon} onClick={clickCallback} hidden={!selected || !allowDeselect} />
		</StyledCoinButton>
	);
}
