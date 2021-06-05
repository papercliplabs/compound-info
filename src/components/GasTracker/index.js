import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import Card from 'components/Card';
import { StyledExternalLink, StyledLogo, Break } from 'theme/components';
import Row from 'components/Row';
import { useGasData, useEthToUsd } from 'store/hooks';
import { formatNumber, weiToGwei } from 'utils';
import gasLogo from 'assets/gas.svg';
import dropDownIcon from 'assets/dropDownIcon.svg';
import Button, { OptionButton, OptionButtonVariantBackdrop } from 'components/Button';
import { Typography } from 'theme';
import { URLS, SPEED_SELECTORS, GAS_USED } from 'constants/index';
import { useClickOutside } from 'hooks/useClickOutside';

const GasTrackerWrapper = styled.div`
	positon: relative;
`;

const Overlay = styled.span`
	display: ${({ open }) => (open ? 'block' : 'none')};
	position: absolute;
	top: 5rem;
	right: 1.5rem;
	max-width: 500px;
`;

const RowEntry = styled(Typography.body)`
	display: flex;
	flex-direction: row;
	justify-content: ${({ left }) => (left ? 'flex-begin' : 'flex-end')};
	align-items: center;
	width: 100%;
`;

export default function GasTracker({}) {
	const theme = useTheme();
	const [overlayIsOpen, setOverlayIsOpen] = useState(false);
	const [speedSelector, setSpeedSelector] = useState(SPEED_SELECTORS[0]);
	const gasData = useGasData();
	const ethToUsd = useEthToUsd();
	const fastPrice = gasData ? gasData.fast : 0;
	const node = useRef();
	useClickOutside(node, open ? () => setOverlayIsOpen(false) : undefined);

	const speedSelectorButtons = useMemo(() => {
		if (!gasData) return null;

		const width = parseInt(100 / SPEED_SELECTORS.length).toString() + '%';
		return SPEED_SELECTORS.map((selector, i) => {
			const buttonContent = (
				<Row justify="center">
					<Typography.header>{selector.name}</Typography.header>
					<Typography.subheader>({prettyGwei(gasData[selector.key])} gwei)</Typography.subheader>
				</Row>
			);
			return (
				<OptionButton
					buttonContent={buttonContent}
					width={width}
					key={i}
					active={selector === speedSelector}
					onClick={() => setSpeedSelector(selector)}
					variant
				/>
			);
		});
	}, [gasData, speedSelector]);

	const tableRows = useMemo(() => {
		if (!gasData || !ethToUsd) return null;

		return GAS_USED.map((obj, i) => {
			const price = weiToGwei(gasData[speedSelector.key]) * obj.gasUsed * 10 ** -9 * ethToUsd;
			return (
				<React.Fragment key={i}>
					<Break />
					<Row justify="space-between">
						<RowEntry left>{obj.action}</RowEntry>
						<RowEntry>{obj.gasUsed}</RowEntry>
						<RowEntry>{formatNumber(price, '$')}</RowEntry>
					</Row>
				</React.Fragment>
			);
		});
	}, [gasData, speedSelector, ethToUsd]);

	return (
		<GasTrackerWrapper ref={node}>
			<Card height="48px" width="" padding={theme.spacing.sm}>
				<Row justify="space-between">
					<StyledLogo src={gasLogo} size="20px" borderRadius="0" marginRight="0" />
					{prettyGwei(fastPrice)}
					<Button onClick={() => setOverlayIsOpen(!overlayIsOpen)}>
						<StyledLogo src={dropDownIcon} size="10px" borderRadius="0" marginRight="0" />
					</Button>
				</Row>
			</Card>
			<Overlay open={overlayIsOpen}>
				<Card column>
					<Row>
						<Typography.displayM>Realtime Cost of Compound</Typography.displayM>
					</Row>
					<Row>
						<Typography.subheader>These values change based on how busy the Ethereum network is.</Typography.subheader>
					</Row>
					<Row justify="space-between" padding="10px 0">
						<OptionButtonVariantBackdrop width="100%">{speedSelectorButtons}</OptionButtonVariantBackdrop>
					</Row>
					<Row justify="space-between">
						<RowEntry left>
							<Typography.header>Action</Typography.header>
						</RowEntry>
						<RowEntry>
							<Typography.header>Gas Used</Typography.header>
						</RowEntry>
						<RowEntry>
							<Typography.header>Cost</Typography.header>
						</RowEntry>
					</Row>
					{tableRows}
					<Break />
					<Typography.caption>
						Provided by
						<StyledExternalLink href="https://www.gasnow.org"> gasnow.org</StyledExternalLink>
					</Typography.caption>
				</Card>
			</Overlay>
		</GasTrackerWrapper>
	);
}

// Example of gasData: (values in gwei)
// {rapid: 46, fast: 29.000001123, standard: 28, slow: 28, timestamp: 1622068173908}

// Helpers
function prettyGwei(wei) {
	return formatNumber(weiToGwei(wei), '', 0);
}
