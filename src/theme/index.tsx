import React from "react";
import styled, { css, createGlobalStyle, ThemeProvider, DefaultTheme, ThemedCssFunction } from "styled-components";

import { colors_S } from "theme/styled";

// Media queries
export const mediaQuerySizes = {
	extraSmall: 575,
	small: 960,
	large: 1280,
};

const mediaQueries: { [width in keyof typeof mediaQuerySizes]: typeof css } = Object.keys(mediaQuerySizes).reduce(
	(accumulator, size) => {
		(accumulator as any)[size] = (a: any, b: any, c: any) => css`
			@media (max-width: ${(mediaQuerySizes as any)[size]}px) {
				${css(a, b, c)}
			}
		`;
		return accumulator;
	},
	{}
) as any;

// General theme
export function theme(darkMode: boolean): DefaultTheme {
	return {
		color: {
			white: "#FFFFFF",
			black: "#000000",

			bg0: darkMode ? "#171519" : "#FFFFFF",
			bg1: darkMode ? "#212024" : "#FFFFFF",
			bg2: darkMode ? "#302F36" : "#FFFFFF",
			bg3: darkMode ? "#4E4B57" : "#FFFFFF",
			bg4: darkMode ? "#A8A7AD" : "#FFFFFF",
			bg5: darkMode ? "#FFFFFF" : "#FFFFFF",

			text1: darkMode ? "#FFFFFF" : "#212B36",
			text2: darkMode ? "#A8A7AD" : "#586069",
			text3: darkMode ? "#605C6C" : "#586069",

			primary1: darkMode ? "#00CD9C" : "#0366D6",
			secondary1: darkMode ? "rgba(0, 205, 156, 0.10)" : "#0366D6",

			border1: darkMode ? "#272B31" : "#DEDFE1",
			border2: darkMode ? "#313131" : "#DEDFE1",

			linkInternal: darkMode ? "#00CD8F" : "#0095D5",
			linkExternal: darkMode ? "#808994" : "#586069",

			warning1: "#E1E15B",
			warning2: "#27291D",

			// The colors used for coin selection, and chart lines, these will only be this many allowed selected at a time, first is used as base color for charts and progress bar
			lineChartColors: darkMode
				? ["#00CD8F", "#885FB1", "#0095D5", "#F9A234", "#FF7EA8"]
				: ["#00CD8F", "#885FB1", "#0095D5", "#F9A234", "#FF7EA8"],
		},

		border: {
			thickness: "1px",
		},

		radius: {
			sm: "8px",
			md: "12px",
			lg: "16px",
		},

		mediaWidth: mediaQueries,

		spacing: {
			none: "none",
			xxs: "4px",
			xs: "8px",
			sm: "12px",
			md: "16px",
			lg: "24px",
			xl: "40px",
			xxl: "60px",
		},

		shadow: {
			none: "none",
			card: "0px 10px 10px rgba(0, 0, 0, 0.1), inset 0px 1px 6px rgba(255, 255, 255, 0.05);",
		},
	};
}

// Typography theme
const StyledText = styled.div<{
	color: keyof colors_S;
	fontSize: number;
	fontWeight: number;
	lineHeight: number;
	useDefaultLineHeight?: boolean;
}>`
	color: ${({ color, theme }) => color ?? theme.color["text1"]};
	font-size: ${({ fontSize }) => fontSize}px;
	font-weight: ${({ fontWeight }) => fontWeight};
	line-height: ${({ lineHeight, useDefaultLineHeight }) => (useDefaultLineHeight ? "auto" : lineHeight + "px")};
`;

export const Typography = {
	displayXL(props: any) {
		return <StyledText fontSize={42} fontWeight={600} lineHeight={44} {...props} />;
	},
	displayL(props: any) {
		return <StyledText fontSize={28} fontWeight={600} lineHeight={32} {...props} />;
	},
	displayM(props: any) {
		return <StyledText fontSize={26} fontWeight={600} lineHeight={32} {...props} />;
	},
	displayS(props: any) {
		return <StyledText fontSize={20} fontWeight={600} lineHeight={28} {...props} />;
	},
	header(props: any) {
		return <StyledText fontSize={16} fontWeight={500} lineHeight={24} {...props} />;
	},
	subheader(props: any) {
		return <StyledText fontSize={14} fontWeight={400} lineHeight={28} {...props} />;
	},
	body(props: any) {
		return <StyledText fontSize={16} fontWeight={400} lineHeight={24} {...props} />;
	},
	caption(props: any) {
		return <StyledText fontSize={14} fontWeight={400} lineHeight={20} {...props} />;
	},
};

// Everything that is child of theme, gets theme as its props, so it can be used everywhere
export default function Theme({ darkMode, children }: { darkMode: boolean; children: any }) {
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
		color: ${({ theme }) => theme.color.text1};
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
