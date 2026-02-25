import { mkdirSync, writeFileSync } from "node:fs";
import {
  OPENCODE_CONFIG_DIR,
  SPRITZ_CONFIG_PATH,
  SPRITZ_API_KEY_DIR,
  SPRITZ_API_KEY_PATH,
} from "./constants.js";

export function storeApiKey(apiKey: string): boolean {
  try {
    mkdirSync(SPRITZ_API_KEY_DIR, { recursive: true });
    writeFileSync(SPRITZ_API_KEY_PATH, apiKey, { mode: 0o600 });
    console.log(`  Stored API key at ${SPRITZ_API_KEY_PATH}`);
    return true;
  } catch (err) {
    console.error("  Failed to store API key:", err);
    return false;
  }
}

export function createSpritzConfig(apiKey: string): boolean {
  try {
    mkdirSync(OPENCODE_CONFIG_DIR, { recursive: true });
    const config = { apiKey, keywords: { enabled: true } };
    writeFileSync(SPRITZ_CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log(`  Created ${SPRITZ_CONFIG_PATH}`);
    return true;
  } catch (err) {
    console.error("  Failed to create config:", err);
    return false;
  }
}
