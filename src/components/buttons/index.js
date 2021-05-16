import styled from 'styled-components'

const OptionButton = styled.button`
	padding: 6px;
	border-radius: ${({ theme }) => theme.border.radius};
	border: solid ${({ theme })  => theme.border.thickness + ' ' + theme.color.border1};
	background-color: ${({ active, theme }) => active ? theme.color.active1 : theme.color.bg1};
	color: ${({ active, theme }) => active ? theme.color.bg1: theme.color.secondary1};
	font-size: ${({ theme }) => theme.fontSize.subheading};
	line-height: 20px;
`;


export default OptionButton;
