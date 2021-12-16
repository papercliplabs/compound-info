import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import { URLS } from "common/constants";

export const compoundInfoSubgraphClient = new ApolloClient({
	uri: URLS.SUBGRAPH_API,
	cache: new InMemoryCache(),
});
