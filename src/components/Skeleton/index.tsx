import React, { useMemo } from "react";
import styled, { css, keyframes, useTheme } from "styled-components";

import Row from "components/Row";
import Column from "components/Column";

const shimmer = keyframes`
    0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const SkeletonWrapper = styled.div<{
	height?: string;
	width?: string;
	$variant?: string;
}>`
	background: ${({ theme }) => theme.color.bg2};
	border-radius: 10px;
	overflow: hidden;
	-webkit-mask-image: -webkit-radial-gradient(white, black);
	width: ${({ width }) => width ?? "100%"};
	height: ${({ height }) => height ?? "30px"};

	${({ $variant }) =>
		$variant == "light" &&
		css`
			background: ${({ theme }) => theme.color.bg3};
		`}
`;

const SkeletonInner = styled(Row)<{
	$variant?: string;
}>`
	animation: ${shimmer} 1.4s infinite;
	background: ${({ theme }) => `linear-gradient(
		90deg,
		${theme.color.bg3}00 0%,
		${theme.color.bg3}60 50%,
		${theme.color.bg3}00 100%
	)`};
	border-radius: ${({ theme }) => theme.radius.sm};
	padding: ${({ theme }) => theme.spacing.md};

	${({ $variant }) =>
		$variant == "light" &&
		css`
			background: ${({ theme }) => `linear-gradient(
                90deg,
                ${theme.color.bg4}00 0%,
                ${theme.color.bg4}60 50%,
                ${theme.color.bg4}00 100%
            )`};
		`}
`;

/**
 * Display loading skeleton
 * @param count number of skeletons to display, will display 1 if not provided
 * @param height height of the skeleton, defaults to 30px if not provided
 * @param width width of the skeleton, defaults to 100% if not provided
 * @param varient specify color variant to use, options are: "light"
 * @returns
 */
export default function Skeleton({
	count,
	height,
	width,
	variant,
}: {
	count?: number;
	height?: string;
	width?: string;
	variant?: string;
}): JSX.Element {
	const theme = useTheme();

	const skeletons = useMemo(() => {
		const numSkeletons = count ?? 1;
		const skeletons = [];
		for (let i = 0; i < numSkeletons; i++) {
			skeletons.push(
				<SkeletonWrapper key={i} width={width} height={height} $variant={variant}>
					<SkeletonInner $variant={variant} />
				</SkeletonWrapper>
			);
		}

		return skeletons;
	}, [count]);

	return <>{skeletons}</>;
}
