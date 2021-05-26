import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from 'app';
import Theme, { GlobalStyle } from 'theme';
import GlobalStoreProvider from 'store';

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
