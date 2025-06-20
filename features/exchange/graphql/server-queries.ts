import { createApolloClient } from '@/graphql/apollo-client';
import { TOKEN_DATA_QUERY, TOKEN_PAIR_QUERY } from '@/lib/apollo/dex-query';

/**
 * Fetches token data by symbol
 */
export async function fetchTokenData(symbol: string) {
  const client = createApolloClient();

  const result = await client.query({
    query: TOKEN_DATA_QUERY,
    variables: {
      id: symbol.toUpperCase(),
    },
    context: {
      headers: {
        cookie: 'houdini=SSR',
      },
    },
  });

  return result.data.token;
}

/**
 * Fetches token pair data for a given token
 */
export async function fetchTokenPairs(token: any, limit = 4) {
  const client = createApolloClient();

  const result = await client.query({
    query: TOKEN_PAIR_QUERY,
    variables: {
      filters: { symbol: token.symbol, chain: token.chain },
      limit,
    },
    context: {
      headers: {
        cookie: 'houdini=SSR',
      },
    },
  });

  return result.data.pairs.pairs;
}

/**
 * Fetches all exchange data for a token pair
 */
export async function fetchExchangePageData(
  fromSymbol: string,
  toSymbol: string
) {
  try {
    const fromToken = await fetchTokenData(fromSymbol);
    const toToken = await fetchTokenData(toSymbol);
    const pairs = await fetchTokenPairs(fromToken);

    return {
      fromToken,
      toToken,
      pairs,
    };
  } catch (error) {
    throw error;
  }
}
