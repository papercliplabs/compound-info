import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { isMobile } from 'react-device-detect';
import App from 'app';
import Theme, { GlobalStyle } from 'theme';
import GlobalStoreProvider from 'store';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';

// Google Analytics
const trackingId = 'UA-199555486-1';

ReactGA.initialize(trackingId);
ReactGA.set({
	customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular',
});

window.addEventListener('error', (error) => {
	ReactGA.exception({
		description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
		fatal: true,
	});
});

// Render app
ReactDOM.render(
	<StrictMode>
		<GlobalStoreProvider>
			<Theme darkMode={true}>
				<GlobalStyle />
				<App />
			</Theme>
		</GlobalStoreProvider>
	</StrictMode>,
	document.getElementById('root')
);
