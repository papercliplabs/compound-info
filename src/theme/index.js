import React from 'react';
import styled, { css, createGlobalStyle, ThemeProvider } from 'styled-components';

// Media queries
const mediaQuerySizes = {
	extraSmall: 500,
	small: 700,
	medium: 960,
	large: 1280,
};

const mediaQueries = Object.keys(mediaQuerySizes).reduce((acc, key) => {
	acc[key] = (...args) => css`
		@media (max-width: ${mediaQuerySizes[key]}px) {
			${css(...args)};
		}
	`;
	return acc;
}, {});

// General theme
const theme = (darkMode) => ({
	color: {
		bg0: darkMode ? '#000000' : '#FFFFFF',
		bg1: darkMode ? '#19191A' : '#FFFFFF',

		primary1: darkMode ? '#FFFFFF' : '#212B36',
		secondary1: darkMode ? '#808994' : '#586069',

		active1: darkMode ? '#000000' : '#0366D6',

		border1: darkMode ? '#272B31' : '#DEDFE1',

		linkInternal: darkMode ? '#0095D5' : '#0095D5',
		linkExternal: darkMode ? '#808994' : '#586069',
	},

	border: {
		thickness: '1px',
		radius: '6px',
	},

	mediaWidth: mediaQueries,

	spacing: {
		default: '5px',
		card: '10px',
		roomy: '30px',
	},
});

// Typography theme
const StyledText = styled.div`
	color: ${({ color, theme }) => theme.color[color]};
	font-size: ${({ fontSize }) => fontSize}px;
	font-weight: ${({ fontWeight }) => fontWeight};
`;

export const Typography = {
	displayXL(props) {
		return <StyledText fontSize={42} fontWeight={600} color={'primary1'} {...props} />;
	},
	displayL(props) {
		return <StyledText fontSize={28} fontWeight={600} color={'primary1'} {...props} />;
	},
	displayM(props) {
		return <StyledText fontSize={26} fontWeight={600} color={'primary1'} {...props} />;
	},
	displayS(props) {
		return <StyledText fontSize={20} fontWeight={600} color={'primary1'} {...props} />;
	},
	header(props) {
		return <StyledText fontSize={16} fontWeight={400} color={'primary1'} {...props} />;
	},
	subheader(props) {
		return <StyledText fontSize={14} fontWeight={400} color={'secondary1'} {...props} />;
	},
	body(props) {
		return <StyledText fontSize={16} fontWeight={400} color={'primary1'} {...props} />;
	},
	caption(props) {
		return <StyledText fontSize={14} fontWeight={500} color={'primary1'} {...props} />;
	},
};

// Everything that is child of theme, gets theme as its props, so it can be used everywhere
export default function Theme({ darkMode, children }) {
	return <ThemeProvider theme={theme(darkMode)}>{children}</ThemeProvider>;
}

// Fonts are imported in index.html
export const GlobalStyle = createGlobalStyle`
	html, div {
		font-family: 'Inter', sans-serif;
	}

	html, body, #root {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		font-weight: 400;
		overflow-x: hidden;
		color: ${({ theme }) => theme.color.primary1};
		background-color: ${({ theme }) => theme.color.bg0};
	}

	* {
		box-sizing: border-box;
	}
	
	.hidden {
		opacity: 0;
	}

	a {
		color: ${({ theme }) => theme.color.linkInternal}
	}
`;
