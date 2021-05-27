import React from 'react';
import Header from 'components/Header';
import Overview from 'pages/Overview';
import Market from 'pages/Market';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
	position: fixed;
	width: 100%;
	z-index: 2;
`;

const StyledBody = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 40px;
	padding-top: 100px;
	column-gap: ${({ theme }) => theme.spacing.card};
	row-gap: ${({ theme }) => theme.spacing.card};

	> * {
		max-width: 1200px;
	}

	${({ theme }) => theme.mediaWidth.small`
		padding-left: 15px;
		padding-right: 15px;
		column-gap: ${({ theme }) => theme.spacing.default};
		row-gap: ${({ theme }) => theme.spacing.default};
	`}
`;

function App() {
	return (
		<HashRouter>
			<HeaderWrapper>
				<Header />
			</HeaderWrapper>
			<StyledBody>
				<Switch>
					<Route exact strict path="/" component={Overview} />
					<Route exact strict path="/:coin" component={Market} />
				</Switch>
			</StyledBody>
		</HashRouter>
	);
}

export default App;
