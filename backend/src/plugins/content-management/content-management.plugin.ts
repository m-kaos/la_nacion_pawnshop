import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'graphql-tag';

import { ContentResolver } from './content.resolver';
import { contentCustomFields } from './custom-fields';

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [ContentResolver],
  configuration: (config) => {
    // Add custom fields to GlobalSettings
    config.customFields.GlobalSettings = [
      ...config.customFields.GlobalSettings || [],
      ...contentCustomFields,
    ];
    return config;
  },
  shopApiExtensions: {
    schema: gql`
      extend type Query {
        siteContent: SiteContent!
      }

      type SiteContent {
        supportEmail: String!
        contactEmail: String!
        aboutUs: String
        shippingPolicy: String
        returnPolicy: String
        faqContent: String
        legalContent: String
        privacyPolicy: String
        termsOfService: String
        socialMedia: SocialMedia
      }

      type SocialMedia {
        facebook: String
        instagram: String
        twitter: String
      }
    `,
    resolvers: [ContentResolver],
  },
})
export class ContentManagementPlugin {}
