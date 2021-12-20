import React, { useEffect, useState } from "react";
import Market from "pages/Market";
import styled from "styled-components";
import { HashRouter, Route, Switch } from "react-router-dom";

import GoogleAnalyticsReporter from "components/analytics/GoogleAnalyticsReporter";
import Header from "components/Header";
import Footer from "components/Footer";
import Overview from "pages/Overview";
import Loader from "components/Loader";
import { usePrefetchData } from "data/hooks";

const loadingScreenTimeMs = 1500; // ms to hold in loading screen on app load

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
	padding-top: 150px;
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

export default function App(): JSX.Element {
	const [loading, setLoading] = useState<boolean>(true);

	// Triggers data fetching on the first call during the loading state
	usePrefetchData();

	useEffect(() => {
		setTimeout(() => setLoading(false), loadingScreenTimeMs);
	}, []);

	return (
		<>
			{loading ? (
				<Loader size="200px" />
			) : (
				<HashRouter>
					<Route component={GoogleAnalyticsReporter} />
					<HeaderWrapper>
						<Header />
					</HeaderWrapper>
					<StyledBody>
						<Switch>
							<Route exact strict path="/" component={Overview} />
							<Route exact strict path="/:token" component={Market} />
						</Switch>
					</StyledBody>
					<FooterWrapper>
						<Footer />
					</FooterWrapper>
				</HashRouter>
			)}
		</>
	);
}
