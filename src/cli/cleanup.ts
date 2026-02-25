import { existsSync, unlinkSync, rmSync } from "node:fs";
import {
  SPRITZ_CONFIG_PATH,
  SPRITZ_API_KEY_PATH,
  SPRITZ_API_KEY_DIR,
  PLUGIN_NAME,
  SPRITZ_INSTRUCTIONS_URL,
} from "./constants.js";
import { findOpencodeConfig, readConfig, writeConfig } from "./config.js";

export function removeMcpFromConfig(): boolean {
  const configPath = findOpencodeConfig();
  if (!configPath) return false;

  const config = readConfig(configPath);
  if (!config) return false;

  const mcp = config.mcp as Record<string, unknown> | undefined;
  if (mcp && "spritz" in mcp) {
    delete mcp.spritz;
    config.mcp = mcp;
    console.log("  Removed spritz MCP server from config");
  }

  return writeConfig(configPath, config);
}

export function removePluginFromConfig(): boolean {
  const configPath = findOpencodeConfig();
  if (!configPath) return false;

  const config = readConfig(configPath);
  if (!config) return false;

  const plugins = config.plugins as string[] | undefined;
  if (plugins) {
    config.plugins = plugins.filter((p) => p !== PLUGIN_NAME);
    console.log("  Removed spritz plugin from config");
  }

  return writeConfig(configPath, config);
}

export function removeInstructionsFromConfig(): boolean {
  const configPath = findOpencodeConfig();
  if (!configPath) return false;

  const config = readConfig(configPath);
  if (!config) return false;

  const instructions = config.instructions as string[] | undefined;
  if (instructions) {
    config.instructions = instructions.filter(
      (url) => url !== SPRITZ_INSTRUCTIONS_URL,
    );
    console.log("  Removed spritz instructions URL from config");
  }

  return writeConfig(configPath, config);
}

export function removeSpritzConfig(): void {
  if (existsSync(SPRITZ_CONFIG_PATH)) {
    unlinkSync(SPRITZ_CONFIG_PATH);
    console.log(`  Removed ${SPRITZ_CONFIG_PATH}`);
  }

  if (existsSync(SPRITZ_API_KEY_PATH)) {
    unlinkSync(SPRITZ_API_KEY_PATH);
    console.log(`  Removed ${SPRITZ_API_KEY_PATH}`);
  }

  if (existsSync(SPRITZ_API_KEY_DIR)) {
    try {
      rmSync(SPRITZ_API_KEY_DIR, { recursive: true });
    } catch {
      // Directory may not be empty if user has other files
    }
  }
}
