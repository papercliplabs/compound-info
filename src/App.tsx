// @ts-nocheck
import React, { useEffect, useState } from "react";
import Market from "pages/Market";
import styled, { css } from "styled-components";
import { HashRouter, Route, Routes, useSearchParams } from "react-router-dom";
import smoothscroll from "smoothscroll-polyfill";
import { matchPath } from "react-router";

import GoogleAnalyticsReporter from "components/analytics/GoogleAnalyticsReporter";
import Header from "components/Header";
import Footer from "components/Footer";
import Overview from "pages/Overview";
import Loader from "components/Loader";
import { useDataStatus, usePrefetchData } from "data/hooks";

const loadingScreenTimeMs = 1000; // ms to hold in loading screen on app load

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

const StyledBody = styled.div<{
	dataError: boolean;
	embedded: boolean;
}>`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 40px;
	padding-top: ${({ dataError }) => (dataError ? "150px" : "100px")};
	column-gap: ${({ theme }) => theme.spacing.md};
	row-gap: ${({ theme }) => theme.spacing.md};

	> * {
		max-width: 1200px;
	}

	${({ theme, dataError, embedded }) => theme.mediaWidth.small`
		padding-left: 15px;
		padding-right: 15px;
		padding-top: ${dataError ? (embedded ? "100px" : "180px") : embedded ? "10px" : "80px"};
		column-gap: ${theme.spacing.xs};
		row-gap: ${theme.spacing.xs};
	`}

	${({ embedded }) =>
		embedded &&
		css`
			padding: 10px;
		`}
`;

export default function App(): JSX.Element {
	const [loading, setLoading] = useState<boolean>(true);
	const searchParams = new URLSearchParams(document.location.search);
	const embedded = searchParams.get("embedded") !== null;

	// Triggers data fetching on the first call during the loading state
	usePrefetchData();
	const { dataError, lastSyncedDate } = useDataStatus();

	useEffect(() => {
		setTimeout(() => setLoading(false), loadingScreenTimeMs);
	}, []);

	smoothscroll.polyfill();

	return (
		<>
			{loading ? (
				<Loader size="200px" />
			) : (
				<HashRouter>
					{!embedded && (
						<HeaderWrapper>
							<Header dataError={dataError} lastSyncedDate={lastSyncedDate} />
						</HeaderWrapper>
					)}
					<StyledBody dataError={dataError} embedded={embedded}>
						<Routes>
							<Route exact strict path="/" element={<Overview />} />
							<Route exact strict path="/:token" element={<Market />} />
							<Route component={<GoogleAnalyticsReporter />} />
						</Routes>
					</StyledBody>
					{!embedded && (
						<FooterWrapper>
							<Footer />
						</FooterWrapper>
					)}
				</HashRouter>
			)}
		</>
	);
}
