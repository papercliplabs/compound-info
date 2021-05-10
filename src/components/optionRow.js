import React from 'react'
import styled, { css } from 'styled-components'

const OptionRow = styled.div`
	width: 100%;
	overflow-x: scroll;
	overflow-y: hidden;
	white-space: nowrap;
	padding: 10px 0;
	display: flex;
	flex-direction: row;
	justify-content: ${props => props.justify};

	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}

	& > * {
		margin: 2px; 
	}
`;

export default OptionRow;
