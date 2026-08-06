#!/usr/bin/env node

import { createReadline, confirm } from "./cli/prompt.js";
import { getOpencodeVersion } from "./cli/version.js";
import { findOpencodeConfig } from "./cli/config.js";
import { createSpritzConfig } from "./cli/settings.js";
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

if (!command || command === "help" || command === "--help" || command === "-h") {
  printHelp();
  process.exit(0);
} else if (command === "install") {
  install().then(() => process.exit(0));
} else if (command === "uninstall") {
  uninstall().then(() => process.exit(0));
} else {
  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

function printHelp(): void {
  console.log(`
spritz-opencode - Spritz Finance plugin for OpenCode

Commands:
  install     Configure Spritz MCP server and plugin
  uninstall   Remove Spritz configuration

Examples:
  bunx @spritz-finance/opencode install
  bunx @spritz-finance/opencode uninstall
`);
}

async function install(): Promise<void> {
  console.log("\n  Spritz Finance — OpenCode Setup\n");

  // --- Detect OpenCode ---
  const version = getOpencodeVersion();
  if (version) {
    console.log(`  Detected OpenCode v${version}`);
  } else {
    console.log("  OpenCode not detected (will configure anyway)");
  }

  // Store only non-secret plugin settings. Credentials remain in the Spritz
  // CLI keychain and are injected into the fixed MCP child by `spritz auth mcp`.
  createSpritzConfig();

  // --- Configure OpenCode ---
  console.log("\n  Configuring OpenCode...");

  const configPath = findOpencodeConfig();

  if (configPath) {
    console.log(`  Found config at ${configPath}`);
    const ok1 = addPluginToConfig(configPath);
    const ok2 = addMcpServerToConfig(configPath);
    const ok3 = addInstructionsUrl(configPath);
    if (ok1 && ok2 && ok3) {
      console.log("  Updated OpenCode config");
    } else {
      console.error("  Warning: Could not parse config. You may need to add Spritz manually.");
    }
  } else {
    console.log("  No OpenCode config found, creating one...");
    createNewConfig();
  }

  console.log(`
  OpenCode configuration installed.

  A human workspace administrator must now:
    1. Enroll the legal entity at https://console.spritz.finance
    2. Accept the Developer Terms and choose Sandbox, Live Test, or Production
    3. Run: spritz auth device start --access developer
    4. Approve the requested scopes in the browser
    5. Run: spritz auth device complete

  The current device flow is a user-account flow, not a Developer Access
  workspace grant, so Developer Access and the local MCP server remain
  fail-closed until the platform endpoints are deployed. Do not give an AI
  agent a raw user or Production key to bypass this boundary.

  Restart OpenCode after the human completes approval.
`);
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
