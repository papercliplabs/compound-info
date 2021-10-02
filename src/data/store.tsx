import React, { useState, createContext, useContext, useCallback } from "react";

const GlobalStoreContext = createContext(null);

// To wrap components in this at the top level
export default function GlobalStoreProvider(props: any) {
	const [store, setStore] = useState({});

	// Interfaces used by hooks to update the store on first requests
	const updateStore = useCallback((key: string, data: any) => {
		setStore((prevStore) => ({ ...prevStore, [key]: data }));
	}, []);

	return <GlobalStoreContext.Provider value={[store, { updateStore }]} {...props} />;
}

export function useGlobalStore() {
	return useContext(GlobalStoreContext);
}
