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
		bg0: darkMode ? '#1B191D' : '#FFFFFF',
		bg1: darkMode ? '#27272B' : '#FFFFFF',
		bg2: darkMode ? '#333338' : '#FFFFFF',

		primary1: darkMode ? '#FFFFFF' : '#212B36',
		secondary1: darkMode ? '#AAAAAA' : '#586069',

		active1: darkMode ? '#000000' : '#0366D6',

		border1: darkMode ? '#272B31' : '#DEDFE1',

		linkInternal: darkMode ? '#0095D5' : '#0095D5',
		linkExternal: darkMode ? '#808994' : '#586069',
	},

	border: {
		thickness: '1px',
		radius: '16px',
	},

	mediaWidth: mediaQueries,

	spacing: {
		default: '8px',
		medium: '12px',
		card: '16px',
		large: '24px',
	},
});

// Typography theme
const StyledText = styled.div`
	color: ${({ color, theme }) => theme.color[color]};
	font-size: ${({ fontSize }) => fontSize}px;
	font-weight: ${({ fontWeight }) => fontWeight};
	line-height: ${({ lineHeight }) => lineHeight}px;
`;

export const Typography = {
	displayXL(props) {
		return <StyledText fontSize={42} fontWeight={600} color={'primary1'} lineHeight={44} {...props} />;
	},
	displayL(props) {
		return <StyledText fontSize={28} fontWeight={500} color={'primary1'} lineHeight={32} {...props} />;
	},
	displayM(props) {
		return <StyledText fontSize={26} fontWeight={600} color={'primary1'} lineHeight={32} {...props} />;
	},
	displayS(props) {
		return <StyledText fontSize={20} fontWeight={600} color={'primary1'} lineHeight={28} {...props} />;
	},
	header(props) {
		return <StyledText fontSize={16} fontWeight={500} color={'primary1'} lineHeight={24} {...props} />;
	},
	subheader(props) {
		return <StyledText fontSize={14} fontWeight={400} color={'secondary1'} lineHeight={28} {...props} />;
	},
	body(props) {
		return <StyledText fontSize={16} fontWeight={400} color={'primary1'} lineHeight={28} {...props} />;
	},
	caption(props) {
		return <StyledText fontSize={14} fontWeight={500} color={'primary1'} lineHeight={28} {...props} />;
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
		color: ${({ theme }) => theme.color.primary1};
		-webkit-font-smoothing: antialiased;
  		-moz-osx-font-smoothing: grayscale;
		background: 
			radial-gradient(100% 30% at 100% 0%, rgba(173, 0, 255, 0.1) 0%, rgba(27, 25, 29, 0) 100%), 
			radial-gradient(100% 30% at 0% 0%, rgba(0, 255, 194, 0.1) 0%, rgba(27, 25, 29, 0) 100%);
		background-color: ${({ theme }) => theme.color.bg0};
		background-repeat: no-repeat;
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
