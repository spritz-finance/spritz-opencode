import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const CONFIG_DIR = join(homedir(), ".config", "opencode");
const CONFIG_FILES = [
  join(CONFIG_DIR, "spritz.jsonc"),
  join(CONFIG_DIR, "spritz.json"),
];

const API_KEY_PATH = join(homedir(), ".config", "spritz", "api_key");

interface SpritzConfig {
  apiKey?: string;
  keywords?: {
    enabled?: boolean;
    patterns?: string[];
  };
}

const DEFAULTS = {
  keywords: {
    enabled: true,
    patterns: [] as string[],
  },
};

function stripJsoncComments(content: string): string {
  let result = "";
  let inString = false;
  let escape = false;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i + 1];

    if (escape) { result += ch; escape = false; continue; }
    if (inString) {
      if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      result += ch;
      continue;
    }
    if (ch === '"') { inString = true; result += ch; }
    else if (ch === "/" && next === "/") { while (i < content.length && content[i] !== "\n") i++; i--; }
    else if (ch === "/" && next === "*") { i += 2; while (i < content.length && !(content[i] === "*" && content[i + 1] === "/")) i++; i++; }
    else { result += ch; }
  }

  return result.replace(/,\s*([\]}])/g, "$1");
}

function loadConfig(): SpritzConfig {
  for (const path of CONFIG_FILES) {
    if (existsSync(path)) {
      try {
        const content = readFileSync(path, "utf-8");
        const json = stripJsoncComments(content);
        return JSON.parse(json) as SpritzConfig;
      } catch {
        // Invalid config, continue to next
      }
    }
  }
  return {};
}

function loadApiKey(): string | undefined {
  if (existsSync(API_KEY_PATH)) {
    try {
      return readFileSync(API_KEY_PATH, "utf-8").trim();
    } catch {
      // Can't read key file
    }
  }
  return undefined;
}

const fileConfig = loadConfig();

export const SPRITZ_API_KEY =
  fileConfig.apiKey ?? process.env.SPRITZ_API_KEY ?? loadApiKey();

export const CONFIG = {
  keywords: {
    enabled: fileConfig.keywords?.enabled ?? DEFAULTS.keywords.enabled,
    customPatterns: fileConfig.keywords?.patterns ?? [],
  },
};

export function isConfigured(): boolean {
  return !!SPRITZ_API_KEY;
}

export function getConfigDir(): string {
  return CONFIG_DIR;
}
