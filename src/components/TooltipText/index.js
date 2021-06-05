import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import Portal from '@reach/portal';
import { usePopper } from 'react-popper';
import { Typography } from 'theme';
import Card from 'components/Card';

const Tooltip = styled.div`
	display: ${({ show }) => (show ? 'flex' : 'none')};
	background-color: ${({ theme }) => theme.color.bg2};
	border: solid ${({ theme }) => theme.border.thickness + ' ' + theme.color.bg3};
	border-radius: ${({ theme }) => theme.radius.lg};
	padding: ${({ theme }) => theme.spacing.md};
	box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1), inset 0px 1px 6px rgba(255, 255, 255, 0.05);
	z-index: 9999;
`;

const TooltipContainer = styled(Typography.caption)`
	color: ${({ theme }) => theme.color.text2};
`;

const ReferenceElement = styled.div`
	display: inline-block;
	border-bottom: dotted 2px;
	border-color: ${({ active, theme }) => (active ? theme.color.white : theme.color.bg3)};

	:hover {
		cursor: pointer;
	}
`;

const ReferenceText = styled(Typography.caption)`
	color: ${({ theme }) => theme.color.text2};
`;

export default function TooltipText({ baseText, tooltipContent }) {
	const [referenceElement, setReferenceElement] = useState(null);
	const [popperElement, setPopperElement] = useState(null);
	const [arrowElement, setArrowElement] = useState(null);
	const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
		placement: 'auto',
		strategy: 'fixed',
		modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
	});
	const [show, setShow] = useState(false);

	const open = useCallback(() => {
		update();
		setShow(true);
	}, [setShow, update]);

	const close = useCallback(() => setShow(false), [setShow]);

	return (
		<>
			<ReferenceElement ref={setReferenceElement} active={show} onClick={open} onMouseEnter={open} onMouseLeave={close}>
				{baseText}
			</ReferenceElement>
			<Portal>
				<Tooltip ref={setPopperElement} style={styles.popper} show={show} {...attributes.popper}>
					<TooltipContainer>{tooltipContent}</TooltipContainer>
				</Tooltip>
			</Portal>
		</>
	);
}
