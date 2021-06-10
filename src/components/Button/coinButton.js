import React from 'react';
import styled, { css } from 'styled-components';
import Button from './';
import { Typography } from 'theme';
import closeIcon from 'assets/closeIcon.svg';
import CoinLogo from 'components/CoinLogo';
import { StyledInternalLink } from 'theme/components';

const StyledCoinButton = styled.button`
	background-color: ${({ theme }) => theme.color.bg1};

	display: flex;
	align-items: center;
	border: solid ${({ theme }) => theme.border.thickness + ' ' + theme.color.border1};
	background-color: ${({ theme }) => theme.color.bg2};
	padding: ${({ padding }) => padding ?? '6px'};
	border-radius: ${({ theme }) => theme.radius.lg};
	box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1), inset 0px 1px 6px rgba(255, 255, 255, 0.05);
	height: 100%;

	:hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.color.bg3};
	}

	${({ active }) =>
		active &&
		css`
			border-width: 2px;
			border-color: ${({ selectedColor }) => selectedColor};
			:hover {
				background-color: ${({ theme }) => theme.color.bg2};
			}
		`}
`;

const SelectedIndicator = styled.div`
	display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
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
	margin-right: ${({ theme, marginRight }) => marginRight ?? theme.spacing.xs};
`;

const CloseIndicator = styled.img`
	display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
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

export function CoinButton({ name, imgSrc, value, color, selected, allowDeselect, onClick }) {
	const open = selected ? null : onClick;
	return (
		<StyledCoinButton selectedColor={color} active={selected} onClick={open} allowDeselect={allowDeselect}>
			<SelectedIndicator selectedColor={color} hidden={!selected} />
			<CoinLogo name={name} />
			<CoinInfo>
				{selected && allowDeselect ? (
					<StyledInternalLink to={'/' + name}>
						<Typography.header useDefaultLineHeight>
							<HoverText>{name}</HoverText>
						</Typography.header>
					</StyledInternalLink>
				) : (
					<Typography.header useDefaultLineHeight>{name}</Typography.header>
				)}
				<Typography.caption useDefaultLineHeight>{value}</Typography.caption>
			</CoinInfo>
			<CloseIndicator src={closeIcon} onClick={onClick} hidden={!selected || !allowDeselect} />
		</StyledCoinButton>
	);
}
