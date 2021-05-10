import React from 'react'
import {createGlobalStyle, ThemeProvider} from 'styled-components'

const theme = (darkMode, color) => ({
	primaryWhite: '#FFFFFF',	

	color: {
		white: '#000000',
		black: '#FFFFFF',

		bg1: darkMode ? '#000000' : '#FFFFFF',

		primary1: darkMode ? '#' : '#212B36',

		secondary1: darkMode ? '#' : '#586069',

		active1: darkMode ? '#' : '#0366D6',

		border1: darkMode ? '#FFFFFF' : '#DEDFE1',
	},

	fontSize: {
		displayXL: '48px',
		displayL: '30px',
		displayM: '26px',
		displayS: '20px',
		
		heading: '18px',
		subheading: '14px',

		body: '16px',
	},

	border: {
		thickness: '1px',	
		radius: '6px',
	},

	mediaWidth: {
		upToExtraSmall: 500,
		upToSmall: 700,
		upToMedium: 960,
		upToLarge: 1280,
	}
});

// Everything that is child of theme, gets theme as its props, so it can be used everywhere
export default function Theme({children}) {
	const darkMode = false; // TODO: add darkmode functionality later

	return <ThemeProvider theme={theme(darkMode)}>{children}</ThemeProvider>;
};


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
		overflow: hidden;
	}

	div {
		box-sizing: border-box;
	}
	
	.hidden {
		opacity: 0;
	}
`;
