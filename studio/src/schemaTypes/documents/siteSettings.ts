/**
 * studio/src/schemaTypes/documents/siteSettings.ts
 * Global site settings — enforced as a singleton via Studio structure.
 * SEO fields are embedded (page-specific object, not a reference).
 */
import { defineType, defineField } from 'sanity';
import { CogIcon } from '@sanity/icons';
import { seoFields } from '../shared/seoFields';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  // No __experimental_actions needed — singleton enforced via structure
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      description: 'Used as the default meta description for all pages.',
    }),
    // Spread shared SEO fields
    ...seoFields,
  ],
  preview: {
    select: { title: 'siteName' },
  },
});
