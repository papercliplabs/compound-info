// @ts-nocheck
import { useClickOutside } from "common/hooks/useClickOutside";
import Card from "components/Card";
import Column from "components/Column";
import Row from "components/Row";
import React, { useState, useRef } from "react";
import styled, { useTheme } from "styled-components";
import { Typography } from "theme";
import Button from ".";

import chevronDownIcon from "assets/chevronDown.svg";
import { rootCertificates } from "tls";

const DropdownButtonWrapper = styled(Button)`
	positon: relative;
	border-radius: ${({ theme }) => theme.radius.md};
	background-color: ${({ theme }) => theme.color.bg2};
	width: auto;
	padding: 0;
	overflow: hidden;
`;

const Base = styled.div`
	padding: 10px;
	:hover {
		cursor: pointer;
		background-color: ${({ theme }) => theme.color.bg3};
	}
`;

const DropdownItem = styled(Row)`
	padding: ${({ theme }) => theme.spacing.sm + " " + theme.spacing.md};
	border-radius: ${({ theme }) => theme.radius.md};
	:hover {
		background-color: ${({ theme }) => theme.color.bg3};
	}
`;

const Overlay = styled.div<{
	open: boolean;
	left: number;
	top: number;
}>`
	display: ${({ open }) => (open ? "block" : "none")};
	position: absolute;
	left: ${({ left }) => left};
	top: ${({ top }) => "calc(" + top + " - 100px"});
	overflow: auto;
	z-index: 999;
`;

const ChevronArrow = styled.img<{
	open?: boolean;
}>`
	transform: ${({ open }) => (open ? "rotate(-180deg)" : "rotate(0deg)")};
	transition: 300ms all;
`;

export default function DropdownButton({
	selectionList,
	setSelectionCallback,
	children,
}: {
	selectionList: string[];
	setSelectionCallback: (selection: string) => void;
	children: any;
}): JSX.Element {
	const theme = useTheme();
	const [overlayIsOpen, setOverlayIsOpen] = useState(false);
	const [position, setPosition] = useState({ left: 0, top: 0 });
	const node = useRef(null);
	useClickOutside(node, overlayIsOpen ? () => setOverlayIsOpen(false) : undefined);

	function handleToggle(event: any) {
		setOverlayIsOpen(!overlayIsOpen);
		const left = event.target.offsetLeft;
		const top = event.target.offsetTop + event.target.offsetHeight;
		setPosition({ left: left, top: top });
	}

	const items = selectionList.map((title, i) => {
		return (
			<DropdownItem key={i} onClick={() => setSelectionCallback(title)}>
				<Typography.header color={theme.color.text2}>{title}</Typography.header>
			</DropdownItem>
		);
	});

	return (
		<DropdownButtonWrapper>
			<Base onClick={(event) => handleToggle(event)}>
				<Row gap={theme.spacing.xxs}>
					{children}
					<ChevronArrow src={chevronDownIcon} open={overlayIsOpen} />
				</Row>
			</Base>
			<Overlay open={overlayIsOpen}>
				<Card padding={0} backgroundColor={theme.color.bg2}>
					<Column gap={theme.spacing.sm}>{items}</Column>
				</Card>
			</Overlay>
		</DropdownButtonWrapper>
	);
}
