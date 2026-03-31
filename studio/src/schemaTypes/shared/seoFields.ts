/**
 * studio/src/schemaTypes/shared/seoFields.ts
 * Reusable SEO field group — spread into any document schema.
 *
 * Usage:
 *   import { seoFields } from '../shared/seoFields'
 *   fields: [ ...seoFields ]
 */
import { defineField } from "sanity";
import image from "../objects/image";

export const seoFields = [
  defineField({
    name: "seo",
    title: "SEO",
    type: "object",
    description:
      "Controls how this page appears in search engines and social previews.",
    fields: [
      defineField({
        name: "title",
        title: "SEO Title",
        type: "string",
        description:
          "Overrides the page title in search results. 50-60 chars recommended.",
        validation: (rule) =>
          rule
            .max(70)
            .warning("SEO titles over 70 characters are truncated by Google."),
      }),
      defineField({
        name: "description",
        title: "Meta Description",
        type: "text",
        rows: 3,
        description:
          "Brief summary shown in search results. 120-160 chars recommended.",
        validation: (rule) =>
          rule
            .max(160)
            .warning("Meta descriptions over 160 characters are truncated."),
      }),
      defineField({
        ...image,
        name: "ogImage",
        title: "Social Share Image (OG Image)",
        description:
          "Displayed when shared on social media. Optimal size: 1200x630px.",
      }),
    ],
    options: {
      collapsible: true,
      collapsed: true,
    },
  }),
];
