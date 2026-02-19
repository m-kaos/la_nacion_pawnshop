import { gql } from 'urql';

export const ADD_ITEM_TO_ORDER = gql`
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      ... on Order {
        id
        code
        totalWithTax
        lines {
          id
          quantity
          productVariant {
            id
            name
            priceWithTax
          }
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const GET_ACTIVE_ORDER = gql`
  query GetActiveOrder {
    activeOrder {
      id
      code
      state
      totalWithTax
      totalQuantity
      lines {
        id
        quantity
        linePrice
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
      customer {
        id
        firstName
        lastName
        emailAddress
      }
    }
  }
`;

export const SET_SHIPPING_ADDRESS = gql`
  mutation SetShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ... on Order {
        id
        shippingAddress {
          fullName
          streetLine1
          city
          postalCode
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const GET_ELIGIBLE_SHIPPING_METHODS = gql`
  query GetEligibleShippingMethods {
    eligibleShippingMethods {
      id
      name
      description
      priceWithTax
    }
  }
`;

export const SET_SHIPPING_METHOD = gql`
  mutation SetShippingMethod($shippingMethodId: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
      ... on Order {
        id
        shipping
        shippingWithTax
        totalWithTax
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const ADD_PAYMENT_TO_ORDER = gql`
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ... on Order {
        id
        code
        state
        totalWithTax
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const TRANSITION_TO_STATE = gql`
  mutation TransitionToState($state: String!) {
    transitionOrderToState(state: $state) {
      ... on Order {
        id
        state
      }
      ... on OrderStateTransitionError {
        errorCode
        message
        transitionError
      }
    }
  }
`;
