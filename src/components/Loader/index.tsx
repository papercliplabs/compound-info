import React from "react";
import styled, { keyframes } from "styled-components";

import paperclip from "assets/paperclip.svg";
import Column from "components/Column";
import Logo from "components/Logo";

const pulse = keyframes`
    0% { 
        transform: scale(1);
        opacity: 0.7; 
    }
    60% { 
        transform: scale(1.2);
        opacity: 1.0;

    }
    100% { 
        transform: scale(1); 
        opacity: 0.7;
    }
`;

const AnimatedImg = styled.div`
	animation: ${pulse} 1000ms linear infinite;
`;

export default function Loader({ size }: { size: string }): JSX.Element {
	return (
		<Column height="100%" justify="center">
			<AnimatedImg>
				<Logo src={paperclip} size={size} />
			</AnimatedImg>
		</Column>
	);
}
