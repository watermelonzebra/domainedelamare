import { defineType, defineArrayMember, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { imageValidation } from "../validators/imageValidation";

export default defineField({
  name: "contentImage",
  title: "Image",
  type: "image",
  options: {
    hotspot: true,
    accept: "image/*", // Accept all image types
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative Text",
      type: "string",
      description:
        "Describe the image for screen readers. Required for accessibility.",
      validation: (rule) =>
        rule
          .required()
          .warning("Alt text is required for accessibility compliance."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  validation: imageValidation,
  preview: {
    select: {
      title: "asset.originalFilename",
      media: "asset",
      alt: "alt",
    },
    prepare(selection) {
      const { title, media, alt } = selection;
      return {
        title: title || "Untitled Image",
        subtitle: alt ? `File alt: ${alt}` : "Unknown file type",
        media: media,
      };
    },
  },
});
