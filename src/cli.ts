#!/usr/bin/env node

import { createReadline, confirm, prompt } from "./cli/prompt.js";
import { getOpencodeVersion } from "./cli/version.js";
import { findOpencodeConfig } from "./cli/config.js";
import { storeApiKey, createSpritzConfig } from "./cli/api-key.js";
import {
  addPluginToConfig,
  addMcpServerToConfig,
  addInstructionsUrl,
  createNewConfig,
} from "./cli/mcp.js";
import {
  removeMcpFromConfig,
  removePluginFromConfig,
  removeInstructionsFromConfig,
  removeSpritzConfig,
} from "./cli/cleanup.js";

const args = process.argv.slice(2);
const command = args[0];

if (command === "install") {
  await install();
} else if (command === "uninstall") {
  await uninstall();
} else {
  printHelp();
}

function printHelp(): void {
  console.log(`
spritz-opencode - Spritz Finance plugin for OpenCode

Commands:
  install     Configure Spritz MCP server and plugin
  uninstall   Remove Spritz configuration

Options:
  --api-key <key>   Provide API key non-interactively
  --no-tui          Non-interactive mode (requires --api-key)

Examples:
  bunx @spritz-finance/opencode install
  bunx @spritz-finance/opencode install --api-key sk_live_...
  bunx @spritz-finance/opencode uninstall
`);
}

async function install(): Promise<void> {
  console.log("\n  Spritz Finance — OpenCode Setup\n");

  const noTui = args.includes("--no-tui");
  const apiKeyIdx = args.indexOf("--api-key");

  // --- Detect OpenCode ---
  const version = getOpencodeVersion();
  if (version) {
    console.log(`  Detected OpenCode v${version}`);
  } else {
    console.log("  OpenCode not detected (will configure anyway)");
  }

  // --- Get API key ---
  let apiKey = apiKeyIdx !== -1 ? args[apiKeyIdx + 1] : undefined;

  if (!apiKey) {
    if (noTui) {
      console.error("  Error: --no-tui requires --api-key");
      process.exit(1);
    }

    const rl = createReadline();
    console.log("  Get your API key from https://app.spritz.finance\n");
    apiKey = await prompt(rl, "  Spritz API key");
    rl.close();

    if (!apiKey) {
      console.error("  Error: API key is required");
      process.exit(1);
    }
  }

  // --- Store API key ---
  console.log("\n  Storing API key...");
  storeApiKey(apiKey);
  createSpritzConfig(apiKey);

  // --- Configure OpenCode ---
  console.log("\n  Configuring OpenCode...");

  const configPath = findOpencodeConfig();

  if (configPath) {
    console.log(`  Found config at ${configPath}`);
    addPluginToConfig(configPath);
    addMcpServerToConfig(configPath, apiKey);
    addInstructionsUrl(configPath);
    console.log("  Updated OpenCode config");
  } else {
    console.log("  No OpenCode config found, creating one...");
    createNewConfig(apiKey);
  }

  console.log("\n  Setup complete! Restart OpenCode to activate Spritz.\n");
}

async function uninstall(): Promise<void> {
  console.log("\n  Spritz Finance — Uninstall\n");

  const noTui = args.includes("--no-tui");
  let confirmed = noTui;

  if (!confirmed) {
    const rl = createReadline();
    confirmed = await confirm(
      rl,
      "  Remove Spritz configuration from OpenCode?",
    );
    rl.close();
  }

  if (!confirmed) {
    console.log("  Cancelled.");
    return;
  }

  console.log("  Removing Spritz configuration...");
  removeMcpFromConfig();
  removePluginFromConfig();
  removeInstructionsFromConfig();
  removeSpritzConfig();

  console.log("\n  Uninstall complete. Restart OpenCode to apply changes.\n");
}
