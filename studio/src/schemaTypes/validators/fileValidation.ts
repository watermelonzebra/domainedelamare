import { FileAsset, FileRule, Rule } from "sanity";

export function fileValidation(rule: FileRule): FileRule {
  return rule
    .custom<FileAsset>((file) => {
      if (!file) return true; // Skip if no file

      const fileSize = file.size || 0; // Get file size, default to 0 if not available

      if (fileSize > 1 * 1024 * 1024) {
        return { message: "File size must be under 2MB" };
      }

      return true; // Valid file size
    })
    .warning(
      "Sanity cannot validate file size at this stage. Please ensure files are under 2MB.",
    );
}
