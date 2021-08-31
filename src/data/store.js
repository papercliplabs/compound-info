import React, { useState, createContext, useContext, useCallback } from "react";

const GlobalStoreContext = createContext();

// To wrap components in this at the top level
export default function GlobalStoreProvider(props) {
	const [store, setStore] = useState({});

	// Interfaces used by hooks to update the store on first requests
	const updateStore = useCallback((key, data) => {
		setStore((prevStore) => ({ ...prevStore, [key]: data }));
	}, []);

	return <GlobalStoreContext.Provider value={[store, { updateStore }]} {...props} />;
}

export function useGlobalStore() {
	return useContext(GlobalStoreContext);
}
