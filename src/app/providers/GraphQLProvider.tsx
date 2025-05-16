import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import type { FC } from 'react';

const client = new ApolloClient({
  uri: import.meta.env.VITE_HASURA_GRAPHQL_URL,
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN_SECRET,
  },
});

export const GraphQLProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
