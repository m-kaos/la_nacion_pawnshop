/**
 * Content Management Hook
 *
 * This hook fetches site content from the Vendure admin.
 * Content is managed via custom fields in the admin dashboard.
 *
 * Usage:
 * ```tsx
 * const { content, loading, error } = useContent();
 *
 * return (
 *   <a href={`mailto:${content.supportEmail}`}>
 *     Contact: {content.supportEmail}
 *   </a>
 * );
 * ```
 *
 * For more information, see ADMIN_CONTENT_MANAGEMENT.md
 */

import { useEffect, useState } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_SITE_CONTENT, SiteContent } from '@/lib/content-queries';

/**
 * Default Content Values
 *
 * These values are used as fallbacks if:
 * - Admin content is not set
 * - GraphQL query fails
 * - API is unavailable
 *
 * Update these to match your store's default contact information.
 */
const defaultContent: SiteContent = {
  supportEmail: 'soporte@kaostore.com',
  contactEmail: 'contacto@kaostore.com',
  aboutUs: undefined,
  shippingPolicy: undefined,
  returnPolicy: undefined,
  faqContent: undefined,
  legalContent: undefined,
  privacyPolicy: undefined,
  termsOfService: undefined,
  socialMedia: {
    facebook: undefined,
    instagram: undefined,
    twitter: undefined,
  },
};

/**
 * useContent Hook
 *
 * Fetches site content from the admin dashboard via GraphQL.
 * Content is cached in component state after first fetch.
 *
 * @returns Object containing:
 *   - content: Site content from admin (or defaults)
 *   - loading: Boolean indicating if content is being fetched
 *   - error: Error message if fetch failed (null otherwise)
 */
export function useContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        // Query the shop API for site content
        const result = await graphqlClient.query(GET_SITE_CONTENT, {});

        if (result.data?.siteContent) {
          // Use admin-configured content
          setContent(result.data.siteContent);
        } else {
          // Fall back to defaults
          setContent(defaultContent);
        }
      } catch (err) {
        console.error('Error fetching site content:', err);
        setError('Failed to load site content');
        // Use defaults on error
        setContent(defaultContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []); // Run once on mount

  return { content, loading, error };
}
