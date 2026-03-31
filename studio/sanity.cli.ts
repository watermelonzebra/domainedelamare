/**
 * studio/sanity.cli.ts
 * Sanity CLI config with TypeGen enabled.
 *
 * TypeGen workflow:
 * - Automatic: types regenerate on every `sanity dev` / `sanity build`
 * - Manual:    npm run typegen  (in studio directory)
 *
 * Output file: ../astro-app/sanity.types.ts
 * Scans:       ../astro-app/src/**\/*.{ts,tsx,astro}
 */
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineCliConfig({
  api: { projectId, dataset },

  deployment: { autoUpdates: true, appId: "gavop4inb4652pehyhpjytbe" },

  typegen: {
    // Automatically regenerate during sanity dev / sanity build

    // Scan all TS, TSX, and Astro files in the frontend
    path: "../astro-app/src/sanity/*/*.queries.ts",

    // Where to write the generated types
    generates: "../astro-app/sanity.types.ts",

    // Makes client.fetch() return typed results when used with defineQuery()
    overloadClientMethods: true,
  },
});
