import { graphqlClient } from './graphql-client';
import { gql } from 'urql';

const REMOVE_ALL_ORDER_LINES = gql`
  mutation RemoveAllOrderLines($orderLineIds: [ID!]!) {
    removeOrderLine(orderLineId: $orderLineIds) {
      ... on Order {
        id
        state
        lines {
          id
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

const GET_ACTIVE_ORDER_LINES = gql`
  query GetActiveOrderLines {
    activeOrder {
      id
      state
      lines {
        id
      }
    }
  }
`;

/**
 * Clears a stuck order by removing all line items
 * This forces Vendure to allow a new order to be created
 */
export async function clearStuckOrder(): Promise<boolean> {
  try {
    console.log('[CLEAR STUCK ORDER] Checking for active order...');

    const orderCheck = await graphqlClient.query(GET_ACTIVE_ORDER_LINES, {}, {
      requestPolicy: 'network-only',
    });

    const activeOrder = orderCheck.data?.activeOrder;

    if (!activeOrder) {
      console.log('[CLEAR STUCK ORDER] No active order found');
      return true;
    }

    console.log('[CLEAR STUCK ORDER] Found order:', activeOrder.id, 'State:', activeOrder.state);

    if (activeOrder.lines && activeOrder.lines.length > 0) {
      console.log('[CLEAR STUCK ORDER] Removing', activeOrder.lines.length, 'line items...');

      // Remove each line item
      for (const line of activeOrder.lines) {
        console.log('[CLEAR STUCK ORDER] Removing line:', line.id);

        await graphqlClient.mutation(gql`
          mutation RemoveOrderLine($orderLineId: ID!) {
            removeOrderLine(orderLineId: $orderLineId) {
              ... on Order {
                id
              }
              ... on ErrorResult {
                errorCode
                message
              }
            }
          }
        `, {
          orderLineId: line.id,
        });
      }

      console.log('[CLEAR STUCK ORDER] ✅ All items removed');
    }

    // Clear browser session to force new order
    console.log('[CLEAR STUCK ORDER] Clearing session cookies...');
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log('[CLEAR STUCK ORDER] ✅ Session cleared');
    return true;

  } catch (error) {
    console.error('[CLEAR STUCK ORDER] ❌ Error:', error);
    return false;
  }
}
