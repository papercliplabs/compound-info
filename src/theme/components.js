import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const StyledLink = styled.a`
	text-decoration: none;	
`;


// React router Link with style
export const StyledInternalLink = styled(Link)`
	text-decoration: none;
	color: ${({ theme }) => theme.color.linkInternal};
`;

export const StyledExternalLink = styled.a`
	text-decoration: none;
	color: ${({ theme }) => theme.color.linkExternal};
`;
