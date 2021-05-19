import styled, { css } from 'styled-components'

const OptionButton = styled.button`
	padding: 6px;
	border-radius: ${({ theme }) => theme.border.radius};
	border: solid ${({ theme })  => theme.border.thickness + ' ' + theme.color.border1};
	background-color: ${({ active, theme }) => active ? theme.color.active1 : theme.color.bg1};

	${({ active }) => active && css`
		color: ${({ theme }) => theme.color.active}
	`}
`;


export default OptionButton;
