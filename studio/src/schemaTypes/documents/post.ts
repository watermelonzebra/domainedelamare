/**
 * studio/src/schemaTypes/documents/post.ts
 *
 * Sanity Schema Best Practices applied:
 * - defineType + defineField + defineArrayMember throughout
 * - @sanity/icons for the document icon
 * - References for author and categories (reusable, independently editable)
 * - Object (not reference) for SEO fields (page-specific)
 * - Validation on required fields + length warnings
 * - Slug uniqueness check via async validation
 * - publishedAt for controlled publish date (not _createdAt)
 * - Alt text required on mainImage (accessibility)
 * - Boolean -> status list for future-proofing
 */
import { defineType, defineField, defineArrayMember } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";
import { seoFields } from "../shared/seoFields";
import image from "../objects/image";
import { fileValidation } from "../validators/fileValidation";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,

  fields: [
    // ── Core content ──────────────────────────────────────
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(10).max(100),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return "Slug is required.";
          if (!/^[a-z0-9-]+$/.test(slug.current)) {
            return "Slug must be lowercase letters, numbers, and hyphens only.";
          }
          // Uniqueness check — excludes the current document's own ID
          const { document, getClient } = context;

          const client = getClient({ apiVersion: "2026-01-01" });
          const id = document?._id?.replace(/^drafts\./, "");
          const count = await client.fetch<number>(
            `count(*[_type == "post" && slug.current == $slug && !(_id in [$id, "drafts." + $id])])`,
            { slug: slug.current, id },
          );
          return count === 0 || "This slug is already taken by another post.";
        }),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description:
        "Brief summary shown in post listings and as the meta description fallback.",
      validation: (rule) =>
        rule
          .max(200)
          .warning("Keep excerpts under 200 characters for best results."),
    }),

    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) =>
        Rule.min(0).error("Price must be a positive number"),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      options: {
        collapsible: true,
      },
      fields: [
        {
          name: "street",
          title: "Street",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "number",
          title: "Street Number",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "postalCode",
          title: "Postal Code",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "city",
          title: "City",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "country",
          title: "Country",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    defineField({
      name: "features",
      title: "Features",
      type: "object",
      options: {
        collapsible: true,
      },
      fields: [
        defineField({
          name: "bedrooms",
          title: "Bedrooms",
          type: "number",
          validation: (Rule) =>
            Rule.min(0).error("Number of bedrooms must be a positive number"),
        }),
        defineField({
          name: "bathrooms",
          title: "Bathrooms",
          type: "number",
          validation: (Rule) =>
            Rule.min(0).error("Number of bathrooms must be a positive number"),
        }),
        defineField({
          name: "garage",
          title: "Garage",
          type: "number",
          validation: (Rule) =>
            Rule.min(0).error("Number of garages must be a positive number"),
        }),
        defineField({
          name: "livableArea",
          title: "Livable Area (m²)",
          type: "number",
          validation: (Rule) =>
            Rule.min(0).error("Livable area must be a positive number"),
        }),
        defineField({
          name: "landArea",
          title: "Land Area (m²)",
          type: "number",
          validation: (Rule) =>
            Rule.min(0).error("Land area must be a positive number"),
        }),
      ],
    }),

    // ── Media ─────────────────────────────────────────────
    defineField({
      ...image,
      name: "contentImage",
      title: "Cover Image",
    }),
    defineField({
      name: "imageGallery",
      title: "Image Gallery",
      type: "array",
      of: [image],
      options: {
        layout: "list",
        sortable: true,
        modal: {
          type: "dialog",
        },
      },
    }),
    defineField({
      name: "floorplan",
      type: "file",
      options: {
        accept: ".pdf",
      },
      validation: fileValidation,
      description: "Upload a PDF file for the floorplan",
      preview: {
        select: {
          title: "asset.originalFilename",
          media: "asset",
        },
        prepare(selection) {
          const { title, media } = selection;
          const filetype = media ? media._ref.split(".").pop() : "unknown";
          return {
            title: title || "Untitled Floorplan",
            subtitle: filetype ? `File type: ${filetype}` : "Unknown file type",
            media: media,
          };
        },
      },
    }),

    // ── Body ──────────────────────────────────────────────
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ordering",
      title: "Ordering",
      type: "number",
      description:
        "Determines the order of posts in listings. Lower numbers appear first.",
      validation: (Rule) =>
        Rule.min(0).error("Ordering must be a positive number"),
    }),

    // ── SEO (object — page-specific, not shared) ──────────
    ...seoFields,
  ],

  // Studio list preview — shows title, author name, and cover image
  preview: {
    select: {
      title: "title",
      media: "contentImage",
    },
    prepare({ title, media }) {
      return {
        title,
        media,
      };
    },
  },

  orderings: [
    {
      title: "Ordering Ascending",
      name: "orderingAsc",
      by: [{ field: "ordering", direction: "asc" }],
    },
    {
      title: "Ordering Descending",
      name: "orderingDesc",
      by: [{ field: "ordering", direction: "desc" }],
    },
  ],
});
