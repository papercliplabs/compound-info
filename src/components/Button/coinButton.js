import React from 'react';
import styled, { css } from 'styled-components';
import OptionButton from './';
import { Typography } from 'theme';
import closeIcon from 'assets/closeIcon.svg';
import CoinLogo from 'components/CoinLogo';

const StyledCoinButton = styled(OptionButton)`
	background-color: ${({ theme }) => theme.color.bg1};
	width: 104px;
	height: 50px;
	display: flex;

	${({ active }) =>
		active &&
		css`
			width: ${({ allowDeselect }) => (allowDeselect ? '143px' : '120px')};
			border-width: 2px;
			border-color: ${({ selectedColor }) => selectedColor};
		`}
`;

const HidingContainer = styled.div`
	display: flex;
	box-sizing: content-box;
	height: 100%;
	float: left;
	opacity: 1;
	width: 12px;
	padding-left: 4px;
	padding-right: 4px;

	${({ hidden }) =>
		hidden &&
		css`
			opacity: 0;
			width: 0;
			padding: 0;
		`}
`;

const SelectedIndicator = styled.div`
	background-color: ${({ selectedColor }) => selectedColor};
	width: 12px;
	height: 12px;
	border-radius: 6px;
	margin: auto;
`;

const CoinLogoContainer = styled.div`
	padding-left: 5px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
`;

const CoinInfo = styled.div`
	display: flex;
	box-sizing: content-box;
	flex-direction: column;
	width: 50px;
	padding-left: 5px;
`;

const CoinName = styled.div`
	display: flex;
	height: 50%;
	align-items: flex-end;
`;

const CoinValue = styled.div`
	height: 50%;
	text-align: left;
`;

const CloseIndicator = styled.img`
	height: 16px;
	width: 16px;
	margin: auto;
`;

function CoinButton({ name, value, color, selected, allowDeselect, onClick }) {
	return (
		<StyledCoinButton selectedColor={color} active={selected} onClick={onClick} allowDeselect={allowDeselect}>
			<HidingContainer hidden={!selected}>
				<SelectedIndicator selectedColor={color} />
			</HidingContainer>
			<CoinLogoContainer>
				<CoinLogo name={name} />
			</CoinLogoContainer>
			<CoinInfo>
				<CoinName>
					<Typography.header>{name}</Typography.header>
				</CoinName>
				<CoinValue>
					<Typography.subheader>{value}</Typography.subheader>
				</CoinValue>
			</CoinInfo>
			<HidingContainer hidden={!selected || !allowDeselect}>
				<CloseIndicator src={closeIcon} />
			</HidingContainer>
		</StyledCoinButton>
	);
}

export default CoinButton;
