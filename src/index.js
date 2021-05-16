import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import Theme, {GlobalStyle} from './theme'
import GlobalStoreProvider from './store'

ReactDOM.render(
	<GlobalStoreProvider>
		<Theme>
			<GlobalStyle />
			<App />
		</Theme>
	</GlobalStoreProvider>,
	document.getElementById('root')
);
