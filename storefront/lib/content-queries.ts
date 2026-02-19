import { gql } from 'urql';

export const GET_SITE_CONTENT = gql`
  query GetSiteContent {
    siteContent {
      supportEmail
      contactEmail
      aboutUs
      shippingPolicy
      returnPolicy
      faqContent
      legalContent
      privacyPolicy
      termsOfService
      socialMedia {
        facebook
        instagram
        twitter
      }
    }
  }
`;

export interface SiteContent {
  supportEmail: string;
  contactEmail: string;
  aboutUs?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  faqContent?: string;
  legalContent?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}
