import { Client, cacheExchange, fetchExchange } from 'urql';

// Use 'backend' service name when running server-side in Docker
// Use 'localhost' when running client-side in browser
const isServer = typeof window === 'undefined';
const VENDURE_SHOP_API_URL = isServer
  ? 'http://backend:3001/shop-api'
  : (process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || 'http://localhost:3001/shop-api');

export const graphqlClient = new Client({
  url: VENDURE_SHOP_API_URL,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies with requests
    };
  },
});
