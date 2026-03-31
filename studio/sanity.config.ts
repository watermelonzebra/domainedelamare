/**
 * studio/sanity.config.ts
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import {
  defineLocations,
  DocumentResolver,
  presentationTool,
} from "sanity/presentation";
import { schemaTypes } from "./src/schemaTypes";
import { structure } from "./src/structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "your-project-id";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const websiteUrl = process.env.WEBSITE_URL ?? "https://domainedelamare.fr";

export default defineConfig({
  name: "astro-sanity-studio",
  title: "Astro + Sanity Studio",
  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        initial: websiteUrl,
        previewMode: {
          enable: "/api/draft-mode/enable", // your Astro API route
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
