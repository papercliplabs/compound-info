import React from 'react';
import styled, { css } from 'styled-components';
import { OptionButton } from './';
import { Typography } from 'theme';
import closeIcon from 'assets/closeIcon.svg';
import CoinLogo from 'components/CoinLogo';

const StyledCoinButton = styled(OptionButton)`
	background-color: ${({ theme }) => theme.color.bg1};
	width: 104px;
	height: 50px;
	display: flex;
	align-items: center;

	${({ active }) =>
		active &&
		css`
			width: ${({ allowDeselect }) => (allowDeselect ? '143px' : '120px')};
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
	display: flex;
	flex-direction: column;
	text-align: left;
`;

const CloseIndicator = styled.img`
	display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
	height: 16px;
	width: 16px;
	margin-left: ${({ theme }) => theme.spacing.default};
`;

function CoinButton({ name, imgSrc, value, color, selected, allowDeselect, onClick }) {
	return (
		<StyledCoinButton selectedColor={color} active={selected} onClick={onClick} allowDeselect={allowDeselect}>
			<SelectedIndicator selectedColor={color} hidden={!selected} />
			<CoinLogo name={name} />
			<CoinInfo>
				<Typography.header useDefaultLineHeight>{name}</Typography.header>
				<Typography.subheader useDefaultLineHeight>{value}</Typography.subheader>
			</CoinInfo>
			<CloseIndicator src={closeIcon} hidden={!selected || !allowDeselect} />
		</StyledCoinButton>
	);
}

export default CoinButton;
