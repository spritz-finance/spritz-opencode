import { existsSync, unlinkSync } from "node:fs";
import {
  SPRITZ_CONFIG_PATH,
  PLUGIN_PACKAGE,
  LEGACY_SPRITZ_INSTRUCTIONS_URL,
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

  const plugin = config.plugin as string[] | undefined;
  if (plugin) {
    config.plugin = plugin.filter(
      (entry) => entry !== PLUGIN_PACKAGE && !entry.startsWith(`${PLUGIN_PACKAGE}@`),
    );
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
    const nextInstructions = instructions.filter(
      (url) => url !== LEGACY_SPRITZ_INSTRUCTIONS_URL,
    );
    config.instructions = nextInstructions;
    if (nextInstructions.length !== instructions.length) {
      console.log("  Removed legacy Spritz instructions URL from config");
    }
  }

  return writeConfig(configPath, config);
}

export function removeSpritzConfig(): void {
  if (existsSync(SPRITZ_CONFIG_PATH)) {
    unlinkSync(SPRITZ_CONFIG_PATH);
    console.log(`  Removed ${SPRITZ_CONFIG_PATH}`);
  }
}
