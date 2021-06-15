import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { StyledExternalLink, StyledLogo, Break } from 'theme/components';
import Button from './';
import { Typography } from 'theme';
import Card from 'components/Card';
import Row from 'components/Row';
import questionIcon from 'assets/questionIcon.svg';
import { useClickOutside } from 'hooks/useClickOutside';
import { URLS } from 'constants/index';

const IconButtonWrapper = styled.div`
	positon: relative;
	border-radius: ${({ theme }) => theme.radius.md};
	:hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.color.bg3};
	}
`;

const StyledIconButton = styled.img`
	padding: ${({ theme }) => theme.spacing.sm};
	:hover {
		cursor: pointer;
	}
`;

const Overlay = styled.span`
	display: ${({ open }) => (open ? 'block' : 'none')};
	position: absolute;
	top: 5rem;
	right: 7rem;
	max-width: 400px;
`;

export function IconButton({}) {
	const [overlayIsOpen, setOverlayIsOpen] = useState(false);
	const node = useRef();
	useClickOutside(node, open ? () => setOverlayIsOpen(false) : undefined);

	return (
		<IconButtonWrapper ref={node}>
			<Button onClick={() => setOverlayIsOpen(!overlayIsOpen)}>
				<StyledIconButton src={questionIcon} />
			</Button>
			<Overlay open={overlayIsOpen}>
				<Card column>
					<Row>
						<Typography.caption>
							This app is an open-source standalone dashboard for the{' '}
							<StyledExternalLink href={URLS.COMPOUND_FINANCE} content="Compound protocol" />. It was built to provide
							transparency on historical market APYs to borrowers and lenders in hopes of improving investment
							decisions.
							<br />
							<br />
							Have a question? Want to improve the dashboard? Feel free to open an issue on{' '}
							<StyledExternalLink href={URLS.GITHUB} content="GitHub" />.
						</Typography.caption>
					</Row>
					<Break />
					<Typography.caption>
						Powered by <StyledExternalLink href={URLS.FLIPSIDE} content="Flipside Crypto" /> and{' '}
						<StyledExternalLink href={URLS.COMPOUND_DOCS} content="Compound API" />
					</Typography.caption>
				</Card>
			</Overlay>
		</IconButtonWrapper>
	);
}
