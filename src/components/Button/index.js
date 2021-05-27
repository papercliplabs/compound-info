import styled, { css } from 'styled-components';

const Button = styled.button`
	background: none;
	border: none;
	padding: 0;
`;

export default Button;

export const OptionButton = styled.button`
	padding: ${({ padding }) => padding ?? '6px'};
	border-radius: ${({ theme }) => theme.border.radius};
	border: solid ${({ theme }) => theme.border.thickness + ' ' + theme.color.border1};
	background-color: ${({ active, theme }) => (active ? theme.color.active1 : theme.color.bg1)};
	width: ${({ width }) => width ?? 'auto'};
	display: inline;

	${({ active }) =>
		active &&
		css`
			color: ${({ theme }) => theme.color.active};
		`}
`;
