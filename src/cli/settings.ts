import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { OPENCODE_CONFIG_DIR, SPRITZ_CONFIG_PATH } from "./constants.js";

/**
 * Write only non-secret plugin settings. This intentionally replaces legacy
 * spritz.json files that embedded an API key.
 */
export function createSpritzConfig(): boolean {
  try {
    mkdirSync(OPENCODE_CONFIG_DIR, { recursive: true });
    let existing: unknown = {};
    if (existsSync(SPRITZ_CONFIG_PATH)) {
      try {
        existing = JSON.parse(readFileSync(SPRITZ_CONFIG_PATH, "utf-8"));
      } catch {
        existing = {};
      }
    }
    const config = sanitizeSpritzSettings(existing);
    writeFileSync(SPRITZ_CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log(`  Created non-secret settings at ${SPRITZ_CONFIG_PATH}`);
    return true;
  } catch (err) {
    console.error("  Failed to create Spritz settings:", err);
    return false;
  }
}

export function sanitizeSpritzSettings(value: unknown): {
  keywords: { enabled: boolean; patterns?: string[] };
} {
  const root = isRecord(value) ? value : {};
  const keywords = isRecord(root.keywords) ? root.keywords : {};
  const patterns = Array.isArray(keywords.patterns)
    ? keywords.patterns.filter((item): item is string => typeof item === "string")
    : undefined;

  return {
    keywords: {
      enabled:
        typeof keywords.enabled === "boolean" ? keywords.enabled : true,
      ...(patterns && patterns.length > 0 ? { patterns } : {}),
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
