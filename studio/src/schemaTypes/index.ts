/**
 * studio/src/schemaTypes/index.ts
 * Register all schema types. Order here controls Studio document type order.
 */
import pageContent from "./documents/pageContent";
import { post } from "./documents/post";

import { siteSettings } from "./documents/siteSettings";
import { blockContent } from "./objects/blockContent";
import image from "./objects/image";

export const schemaTypes = [
  // Documents
  post,
  siteSettings,
  pageContent,
  // Objects (no top-level documents — referenced by documents above)
  blockContent,
  image,
];
