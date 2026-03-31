import { defineField, defineType } from "sanity";
import image from "../objects/image";

export default defineType({
  name: "pageContent",
  title: "Pagina Inhoud",
  type: "document",
  fieldsets: [
    {
      name: "newsletter",
      title: "Nieuwsbrief",
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
    {
      name: "region",
      title: "Buurt",
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
    {
      name: "contact",
      title: "Contactgegevens",
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    defineField({
      name: "newsletter",
      title: "Nieuwsbrief",
      type: "object",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          ...image,
        }),
        defineField({
          name: "title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        // ── Body ──────────────────────────────────────────────
        defineField({
          name: "body",
          title: "Body",
          type: "blockContent",
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    defineField({
      name: "region",
      title: "Buurt",
      type: "object",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          ...image,
        }),
        defineField({
          name: "title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        // ── Body ──────────────────────────────────────────────
        defineField({
          name: "body",
          title: "Body",
          type: "blockContent",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "contactData",
      title: "Contact gegevens",
      type: "object",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "name",
          title: "Naam",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "phone",
          title: "Telefoonnummer",
          type: "string",
          // validation for phone number (prefix) 0486 05 32 68, +32 486 05 32 68
          validation: (Rule) =>
            Rule.required()
              .regex(
                /^(?:\+32\s?|0)[1-9]\d{2}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}$/,
                {
                  name: "phone number",
                  invert: false,
                },
              )
              .error(
                "Vul een geldig telefoonnummer in. Bijv. 0486 05 32 68 of +32 486 05 32 68",
              ),
        }),
        defineField({
          name: "email",
          title: "E-mailadres",
          type: "string",
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: "contactHours",
          title: "Contact uren",
          type: "string",
          description: "Bijv. Ma-Vr: 9:00 - 17:00",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "socialMedia",
      title: "Sociale media links",
      type: "object",
      fields: [
        defineField({
          name: "facebook",
          title: "Facebook URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({
              scheme: ["http", "https"],
            }),
        }),
        defineField({
          name: "instagram",
          title: "Instagram URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({
              scheme: ["http", "https"],
            }),
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({
              scheme: ["http", "https"],
            }),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Pagina Inhoud",
      };
    },
  },
});
