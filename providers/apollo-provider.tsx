'use client';

import { ApolloProvider } from '@apollo/client';

import { createApolloClient } from '@/graphql/apollo-client';

export const ApolloProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ApolloProvider client={createApolloClient()}>{children}</ApolloProvider>
  );
};
