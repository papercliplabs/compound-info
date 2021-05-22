import React from 'react'
import styled from 'styled-components'
import { RowSpaced } from 'components/Row'
import Column from 'components/Column'
import { Link } from 'react-router-dom'
import { Typography } from 'theme'
import { formatNumber, camelCaseToSentenceCase } from 'utils'
import CoinLogo from 'components/CoinLogo'


const StyledTableRow = styled(RowSpaced)`
	padding: 20px 0;
`;

const LinkWrapper = styled(Link)`
	text-decoration: none;		
	display: flex;
	width: 100%;
	:hover {
    	cursor: pointer;
    	opacity: 0.7;
  	}
`;

const RowEntry = styled(Typography.body)`
	display: flex;
	flex-direction: row;
	justify-content: ${({ left }) => left ? 'flex-begin' : 'flex-end'};
	align-items: center;
	width: 100%;
`;

const Break = styled.div`
	height: ${({ theme }) => theme.border.thickness};
	background-color: ${({ theme }) => theme.color.border1};
	width: 100%;
`;


function TableRow({ rowData, keysAndUnits }) {
	const keyData = keysAndUnits.map((obj, i) => {
		return <RowEntry key={i}>{formatNumber(rowData[obj.key], obj.unit)}</RowEntry>;
	});

	return (
		<>
		<Break />
		<LinkWrapper to={'/' + rowData.name} >
			<StyledTableRow>
				<RowEntry left>
					<CoinLogo name={rowData.name} />
					{rowData.name}
				</RowEntry>
				{keyData}
			</StyledTableRow>
		</LinkWrapper>
		</>
	);
}

export default function CoinTable({ data, keysAndUnits }) {
	const sortedData = sortData(data, 'totalSupply', false); // Sorting based on totalSupply, desc 
	const keys = keysAndUnits.map((obj) => obj.key);

	const keyTitles = keys.map((keyName, i) => {
		return (
			<RowEntry key={i}>
				<Typography.header>{camelCaseToSentenceCase(keyName)}</Typography.header>
			</RowEntry>
		);
	});

	const rows = sortedData.map((rowData, i) => {
		return (
			<TableRow key={i} rowData={rowData} keysAndUnits={keysAndUnits} />
		);
	})

	return (
		<Column>
			<StyledTableRow>
				<RowEntry left>
					<Typography.header>Asset</Typography.header>
				</RowEntry>
				{keyTitles}
			</StyledTableRow>

			{rows}
		</Column>
	);
}


// Helper function 
function sortData(data, key, asc=true) {
	const sortedData = data.sort((a,b) => {
		let val = a[key] > b[key] ? 1 : -1;
		return asc ? val : -val;
	});
	return sortedData;
}
