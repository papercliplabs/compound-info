import React, { useState, createContext, useContext, useCallback } from 'react';

const GlobalStoreContext = createContext();

// To wrap components in this at the top level
export default function GlobalStoreProvider(props) {
	const [store, setStore] = useState({});

	// Interfaces used by hooks to update the store on first requests
	const updateStore = useCallback(
		(key, data) => {
			let newStore = Object.assign({}, store); // Shallow copy
			newStore[key] = data;
			setStore(newStore);
		},
		[store]
	);

	return <GlobalStoreContext.Provider value={[store, { updateStore }]} {...props} />;
}

export function useGlobalStore() {
	return useContext(GlobalStoreContext);
}
