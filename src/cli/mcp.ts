import { mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  OPENCODE_CONFIG_DIR,
  PLUGIN_NAME,
  SPRITZ_INSTRUCTIONS_URL,
} from "./constants.js";
import { findOpencodeConfig, readConfig, writeConfig } from "./config.js";

export function addPluginToConfig(configPath: string): boolean {
  const config = readConfig(configPath);
  if (!config) return false;

  const plugin = (config.plugin ?? []) as string[];
  if (!plugin.includes(PLUGIN_NAME)) {
    plugin.push(PLUGIN_NAME);
  }
  config.plugin = plugin;

  return writeConfig(configPath, config);
}

export function addMcpServerToConfig(
  configPath: string,
): boolean {
  const config = readConfig(configPath);
  if (!config) return false;

  const mcp = (config.mcp ?? {}) as Record<string, unknown>;
  mcp.spritz = createSpritzMcpEntry();
  config.mcp = mcp;

  return writeConfig(configPath, config);
}

export function createSpritzMcpEntry(): Record<string, unknown> {
  return {
    type: "local",
    command: ["spritz", "auth", "mcp", "--access", "user"],
  };
}

export function addInstructionsUrl(configPath: string): boolean {
  const config = readConfig(configPath);
  if (!config) return false;

  const instructions = (config.instructions ?? []) as string[];
  if (!instructions.includes(SPRITZ_INSTRUCTIONS_URL)) {
    instructions.push(SPRITZ_INSTRUCTIONS_URL);
  }
  config.instructions = instructions;

  return writeConfig(configPath, config);
}

export function createNewConfig(): boolean {
  mkdirSync(OPENCODE_CONFIG_DIR, { recursive: true });

  const configPath = join(OPENCODE_CONFIG_DIR, "opencode.json");
  const config = {
    plugin: [PLUGIN_NAME],
    mcp: {
      spritz: {
        ...createSpritzMcpEntry(),
      },
    },
    instructions: [SPRITZ_INSTRUCTIONS_URL],
  };

  const ok = writeConfig(configPath, config);
  if (ok) {
    console.log(`  Created ${configPath}`);
  }
  return ok;
}
