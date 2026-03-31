/**
 * studio/src/structure/index.ts
 * Custom Studio desk structure.
 *
 * Sanity Studio Structure Rules applied:
 * - Singletons first (Site Settings)
 * - S.divider() between logical groups
 * - Singletons excluded from generic documentTypeList to prevent duplicates
 * - Singleton uses fixed documentId matching the type name
 */
import type { StructureResolver } from "sanity/structure";
import { CogIcon, DocumentIcon, UserIcon, TagIcon } from "@sanity/icons";

// Types enforced as singletons via fixed documentId
const SINGLETON_TYPES = ["siteSettings"] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // ── 1. Posts ────────────────────────────
      S.listItem()
        .title("Gebouwen")
        .icon(DocumentIcon)
        .child(
          S.documentTypeList("post")
            .title("Gebouwen")
            .defaultOrdering([{ field: "ordering", direction: "asc" }]),
        ),

      S.divider(),

      // ── 2. Website Content (Singleton) ──────────────────
      S.listItem().title("Website Inhoud").icon(CogIcon).child(
        S.document()
          .schemaType("pageContent")
          // Fixed ID = singleton — only one document can exist
          .documentId("pageContent")
          .title("Website Inhoud"),
      ),

      S.divider(),

      // ── 2. Global Settings (Singleton) ──────────────────
      S.listItem().title("Site Settings").icon(CogIcon).child(
        S.document()
          .schemaType("siteSettings")
          // Fixed ID = singleton — only one document can exist
          .documentId("siteSettings")
          .title("Site Settings"),
      ),
    ]);
