import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from 'app';
import Theme, { GlobalStyle } from 'theme';
import GlobalStoreProvider from 'store';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';

const trackingId = 'UA-199555486-1';

// Google Analytics
ReactGA.initialize(trackingId);

const RouteChangeTracker = ({ history }) => {
	history.listen((location, action) => {
		ReactGA.set({ page: location.pathname });
		ReactGA.pageview(location.pathname);
	});
	return <div></div>;
};

ReactGA.exception({
	description: 'An error ocurred',
	fatal: true,
});

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

export default withRouter(RouteChangeTracker);
