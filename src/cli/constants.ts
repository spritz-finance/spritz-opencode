import { join } from "node:path";
import { homedir } from "node:os";

export const OPENCODE_CONFIG_DIR = join(homedir(), ".config", "opencode");
export const SPRITZ_CONFIG_PATH = join(OPENCODE_CONFIG_DIR, "spritz.json");
export const PLUGIN_NAME = "@spritz-finance/opencode@0.1.4";
export const PLUGIN_PACKAGE = "@spritz-finance/opencode";
export const LEGACY_SPRITZ_INSTRUCTIONS_URL =
  "https://raw.githubusercontent.com/spritz-finance/spritz-opencode/main/instructions/spritz-mcp-instructions.md";
