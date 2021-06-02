import React from 'react';
import styled, { css } from 'styled-components';
import { OptionButtonStyle } from './';
import { Typography } from 'theme';
import closeIcon from 'assets/closeIcon.svg';
import CoinLogo from 'components/CoinLogo';
import { StyledInternalLink } from 'theme/components';
import Card from 'components/Card';

const StyledCoinButton = styled(Card)`
	background-color: ${({ theme }) => theme.color.bg1};
	height: 50px;
	display: flex;
	align-items: center;
	border: solid ${({ theme }) => theme.border.thickness + ' ' + theme.color.border1};
	background-color: ${({ theme }) => theme.color.bg2};
	padding: ${({ padding }) => padding ?? '6px'};

	${({ active }) =>
		active &&
		css`
			border-width: 2px;
			border-color: ${({ selectedColor }) => selectedColor};
		`}
`;

const SelectedIndicator = styled.div`
	display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
	background-color: ${({ selectedColor }) => selectedColor};
	width: 12px;
	height: 12px;
	border-radius: 6px;
	margin-right: ${({ theme }) => theme.spacing.default};
`;

const CoinInfo = styled.div`
	min-width: 50px;
	display: flex;
	flex-direction: column;
	text-align: left;
`;

const CloseIndicator = styled.img`
	display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
	height: 16px;
	width: 16px;
	margin-left: ${({ theme }) => theme.spacing.default};

	:hover {
		cursor: pointer;
	}
`;

const HoverText = styled.span`
	:hover {
		color: ${({ theme }) => theme.color.secondary1};
	}
`;

function CoinButton({ name, imgSrc, value, color, selected, allowDeselect, onClick }) {
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
				<Typography.subheader useDefaultLineHeight>{value}</Typography.subheader>
			</CoinInfo>
			<CloseIndicator src={closeIcon} onClick={onClick} hidden={!selected || !allowDeselect} />
		</StyledCoinButton>
	);
}

export default CoinButton;
