import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { v4 as uuidv4 } from 'uuid';

import { BASE_URLS } from '@/constants/urls';
import { getPartnerId } from '@/utils/get-stored-partner-id';

// Generate a unique identifier for the client
export const clientId = uuidv4();

const authUserLink = setContext((_, { headers }) => {
  const isServer = typeof window === 'undefined';
  let partnerId: string | undefined;

  if (isServer) {
    // Get partnerId from cookies, headers, or environment
    // Example: from a custom header or process.env
    partnerId = '';
  } else {
    partnerId = getPartnerId();
  }

  return {
    headers: {
      ...headers,
      'user-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      'partner-id': partnerId,
      ...(isServer ? { ssr: process.env.NEXT_APP_INTERNAL_API_SECRET } : {}),
    },
  };
});

const isServer = typeof window === 'undefined';

const httpLink = new HttpLink({
  uri: isServer
    ? process.env.NEXT_PUBLIC_GQL_HTTP_URL
    : BASE_URLS.GQL_INTERNAL_API,
  credentials: 'include',
});

// Create a WebSocket link for subscriptions
const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: BASE_URLS.GQL_WS,
          connectionParams: () => ({ clientId }),
        })
      )
    : null;

// Use split to send data to each link depending on the operation type
const splitLink = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink
    )
  : httpLink;

export const createApolloClient = (
  initialState: NormalizedCacheObject | null = null
) => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([authUserLink, splitLink]),
    cache: new InMemoryCache().restore(initialState || {}),
    credentials: 'include',
    connectToDevTools: process.env.NODE_ENV !== 'production',
  });
};
