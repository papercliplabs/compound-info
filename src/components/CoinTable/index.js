import React, { useState } from 'react';
import styled from 'styled-components';
import Row from 'components/Row';
import Column from 'components/Column';
import { Link } from 'react-router-dom';
import { Typography } from 'theme';
import { formatNumber, camelCaseToSentenceCase } from 'utils';
import CoinLogo from 'components/CoinLogo';
import { Break } from 'theme/components';
import { SortButton } from 'components/Button';

const StyledTableRow = styled(Row)`
	justify-content: space-between;
	padding: ${({ theme }) => theme.spacing.md} 0;

	${({ theme }) => theme.mediaWidth.small`
		> *:nth-child(2n) {
			display: none;
		}
	`}
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
	justify-content: ${({ left }) => (left ? 'flex-begin' : 'flex-end')};
	align-items: center;
	width: 100%;
`;

function TableRow({ rowData, keysAndUnits }) {
	const keyData = keysAndUnits.map((obj, i) => {
		return <RowEntry key={i}>{formatNumber(rowData[obj.key], obj.unit)}</RowEntry>;
	});

	return (
		<>
			<Break />
			<LinkWrapper to={'/' + rowData.name}>
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
	let keys = keysAndUnits.map((obj) => obj.key);
	const [sortKey, setSortKey] = useState(keys[0]);
	keys = ['name', ...keys];
	const [asc, setAsc] = useState(false); // If the sort is asc of desc
	const sortedData = sortData(data, sortKey, asc); // Sorting based on totalSupply, desc

	const sortButtons = keys.map((keyName, i) => {
		const buttonName = keyName === 'name' ? 'asset' : keyName; // Alias name as asset for displaying on the table
		return (
			<RowEntry key={i} left={i === 0}>
				<SortButton
					name={camelCaseToSentenceCase(buttonName)}
					isActive={keyName === sortKey}
					handleClick={() => {
						if (sortKey === keyName) {
							setAsc(!asc);
						} else {
							setAsc(false);
							setSortKey(keyName);
						}
					}}
					isAsc={asc}
				/>
			</RowEntry>
		);
	});

	const rows = sortedData.map((rowData, i) => {
		return <TableRow key={i} rowData={rowData} keysAndUnits={keysAndUnits} />;
	});

	return (
		<Column>
			<StyledTableRow>{sortButtons}</StyledTableRow>
			{rows}
		</Column>
	);
}

// Helper function
function sortData(data, key, asc = true) {
	const sortedData = data.sort((a, b) => {
		let val = a[key] > b[key] ? 1 : -1;
		return asc ? val : -val;
	});
	return sortedData;
}
