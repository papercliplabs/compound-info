import React from 'react';
import Overview from 'pages/Overview';
import Market from 'pages/Market';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

const StyledBody = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 40px;
	column-gap: ${({ theme }) => theme.spacing.card};
	row-gap: ${({ theme }) => theme.spacing.card};

	> * {
		max-width: 1200px;
	}

	${({ theme }) => theme.mediaWidth.small`
		padding: 40px 15px;
	`}
`;

function App() {
	return (
		<HashRouter>
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
