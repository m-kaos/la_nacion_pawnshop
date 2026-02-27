import { Client, cacheExchange, fetchExchange } from 'urql';

// SSR: use VENDURE_SHOP_API_URL if set (Vercel/Railway), otherwise Docker service name
// Browser: always use the public NEXT_PUBLIC_ var
const isServer = typeof window === 'undefined';
const VENDURE_SHOP_API_URL = isServer
  ? (process.env.VENDURE_SHOP_API_URL || 'http://backend:3001/shop-api')
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
