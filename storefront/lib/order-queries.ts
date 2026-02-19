import { gql } from 'urql';

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
      id
      code
      state
      active
      orderPlacedAt
      updatedAt
      totalWithTax
      shippingWithTax
      subTotalWithTax
      currencyCode
      customer {
        id
        firstName
        lastName
        emailAddress
      }
      shippingAddress {
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
      }
      billingAddress {
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
      }
      lines {
        id
        quantity
        linePriceWithTax
        productVariant {
          id
          name
          sku
          priceWithTax
          product {
            name
            featuredAsset {
              preview
            }
          }
        }
      }
      shippingLines {
        shippingMethod {
          id
          name
          code
          description
        }
        priceWithTax
      }
      payments {
        id
        transactionId
        amount
        method
        state
        errorMessage
        metadata
        createdAt
      }
      fulfillments {
        id
        state
        method
        trackingCode
        createdAt
        updatedAt
      }
      history {
        items {
          id
          type
          createdAt
          data
        }
      }
    }
  }
`;

export const GET_ACTIVE_CUSTOMER_ORDERS = gql`
  query GetActiveCustomerOrders($options: OrderListOptions) {
    activeCustomer {
      id
      orders(options: $options) {
        items {
          id
          code
          state
          orderPlacedAt
          totalWithTax
          currencyCode
          lines {
            id
            quantity
            productVariant {
              id
              name
              product {
                name
                featuredAsset {
                  preview
                }
              }
            }
          }
        }
        totalItems
      }
    }
  }
`;
