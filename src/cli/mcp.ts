import { mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  OPENCODE_CONFIG_DIR,
  PLUGIN_NAME,
  MCP_PACKAGE,
  SPRITZ_INSTRUCTIONS_URL,
} from "./constants.js";
import { findOpencodeConfig, readConfig, writeConfig } from "./config.js";

export function addPluginToConfig(configPath: string): boolean {
  const config = readConfig(configPath);
  if (!config) return false;

  const plugins = (config.plugins ?? []) as string[];
  if (!plugins.includes(PLUGIN_NAME)) {
    plugins.push(PLUGIN_NAME);
  }
  config.plugins = plugins;

  return writeConfig(configPath, config);
}

export function addMcpServerToConfig(
  configPath: string,
  apiKey: string,
): boolean {
  const config = readConfig(configPath);
  if (!config) return false;

  const mcp = (config.mcp ?? {}) as Record<string, unknown>;
  mcp.spritz = {
    command: "npx",
    args: ["-y", MCP_PACKAGE],
    env: {
      SPRITZ_API_KEY: apiKey,
    },
  };
  config.mcp = mcp;

  return writeConfig(configPath, config);
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

export function createNewConfig(apiKey: string): boolean {
  mkdirSync(OPENCODE_CONFIG_DIR, { recursive: true });

  const configPath = join(OPENCODE_CONFIG_DIR, "opencode.json");
  const config = {
    plugins: [PLUGIN_NAME],
    mcp: {
      spritz: {
        command: "npx",
        args: ["-y", MCP_PACKAGE],
        env: {
          SPRITZ_API_KEY: apiKey,
        },
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
