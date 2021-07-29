import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Overview from 'pages/Overview';
import Market from 'pages/Market';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import GoogleAnalyticsReporter from 'components/analytics/GoogleAnalyticsReporter';

const HeaderWrapper = styled.div`
	position: fixed;
	width: 100%;
	z-index: 2;
	top: 0;
`;

const FooterWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	> * {
		max-width: 1200px;
	}
`;

const StyledBody = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 40px;
	padding-top: 100px;
	column-gap: ${({ theme }) => theme.spacing.md};
	row-gap: ${({ theme }) => theme.spacing.md};

	> * {
		max-width: 1200px;
	}

	${({ theme }) => theme.mediaWidth.small`
		padding-left: 15px;
		padding-right: 15px;
		column-gap: ${({ theme }) => theme.spacing.xs};
		row-gap: ${({ theme }) => theme.spacing.xs};
	`}
`;

function App() {
	return (
		<HashRouter>
			<Route component={GoogleAnalyticsReporter} />
			<HeaderWrapper>
				<Header />
			</HeaderWrapper>
			<StyledBody>
				<Switch>
					<Route exact strict path="/" component={Overview} />
					<Route exact strict path="/:coin" component={Market} />
				</Switch>
			</StyledBody>
			<FooterWrapper>
				<Footer />
			</FooterWrapper>
		</HashRouter>
	);
}

export default App;
