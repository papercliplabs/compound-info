import { RefObject, useEffect, useRef } from "react";

// From uniswap hooks
export function useClickOutside<T extends HTMLElement>(
	node: RefObject<T | undefined>,
	handler: undefined | (() => void)
) {
	const handlerRef = useRef<undefined | (() => void)>(handler);
	useEffect(() => {
		handlerRef.current = handler;
	}, [handler]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (node.current?.contains(e.target as Node) ?? false) {
				return;
			}
			if (handlerRef.current) handlerRef.current();
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [node]);
}
