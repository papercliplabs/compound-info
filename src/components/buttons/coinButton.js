import React from 'react'
import styled, { css } from 'styled-components'
import OptionButton from './'


const StyledCoinButton = styled(OptionButton)`
	background-color: ${props => props.theme.color.bg1};
	width: 104px;
	height: 48px;
	display: flex;

	${props => props.active && css`
		width: ${props => props.allowDeselect ? '143px' : '120px'};
		border-width: 2px;	
		border-color: ${props => props.selectedColor};
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

	${props => props.hidden && css`
		opacity: 0;	
		width: 0;
		padding: 0;
	`}
`;

const SelectedIndicator = styled.div`
	background-color: ${props => props.selectedColor};	
	width: 12px;
	height: 12px;
	border-radius: 6px;
	margin: auto;
`;

const CoinLogoContainer = styled.div`
	padding-left: 5px;
	display: flex;
	box-sizing: content-box;
	height: 100%;
	width: 24px;
`;

const CoinLogo = styled.img`
	width: 24px;
	height: 24px;
	float: left;
	margin: auto;
`;

const CoinInfo = styled.div`
	display: flex;
	box-sizing: content-box;
	flex-direction: column;
	width: 50px;
	padding-left: 5px;
	font-size: ${props => props.theme.fontSize.subheading};
`;

const CoinName = styled.div`
	color: ${props => props.theme.color.primary1};
	display: flex;
	height: 50%;	
	align-items: flex-end;
`;

const CoinValue = styled.div`
	color: ${props => props.theme.color.secondary1};
	height: 50%;
	text-align: left;
`;

const CloseIndicator = styled.img`
	height: 16px;
	width: 16px;
	margin: auto;
`;


function CoinButton(props) {
	return (
		<StyledCoinButton 
			selectedColor={props.color} 
			active={props.selected}
			onClick={props.onClick}
			allowDeselect={props.allowDeselect}	
		>
			<HidingContainer hidden={!props.selected}>
				<SelectedIndicator selectedColor={props.color} />
			</HidingContainer>
			<CoinLogoContainer>
				<CoinLogo src={process.env.PUBLIC_URL + `img/coins/${props.name}.svg`} />				
			</CoinLogoContainer>
			<CoinInfo>
				<CoinName>{props.name}</CoinName>
				<CoinValue>{props.value}</CoinValue>
			</CoinInfo>
			<HidingContainer hidden={!props.selected || !props.allowDeselect}>
				<CloseIndicator src={process.env.PUBLIC_URL + 'img/closeIcon.svg'} />
			</HidingContainer>
		</StyledCoinButton>
	);
}

export default CoinButton;
