import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { OPENCODE_CONFIG_DIR } from "./constants.js";

export function stripJsoncComments(content: string): string {
  // Remove block comments, line comments (but not inside strings), and trailing commas
  let result = "";
  let inString = false;
  let escape = false;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i + 1];

    if (escape) {
      result += ch;
      escape = false;
      continue;
    }

    if (inString) {
      if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      result += ch;
      continue;
    }

    if (ch === '"') {
      inString = true;
      result += ch;
    } else if (ch === "/" && next === "/") {
      // Skip to end of line
      while (i < content.length && content[i] !== "\n") i++;
      i--; // loop increment will advance
    } else if (ch === "/" && next === "*") {
      i += 2;
      while (i < content.length && !(content[i] === "*" && content[i + 1] === "/")) i++;
      i++; // skip closing /
    } else {
      result += ch;
    }
  }

  // Remove trailing commas before ] or }
  return result.replace(/,\s*([\]}])/g, "$1");
}

export function findOpencodeConfig(): string | null {
  const jsonc = join(OPENCODE_CONFIG_DIR, "opencode.jsonc");
  const json = join(OPENCODE_CONFIG_DIR, "opencode.json");

  if (existsSync(jsonc)) return jsonc;
  if (existsSync(json)) return json;
  return null;
}

export function readConfig(
  configPath: string,
): Record<string, unknown> | null {
  try {
    const content = readFileSync(configPath, "utf-8");
    const json = stripJsoncComments(content);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function writeConfig(
  configPath: string,
  config: Record<string, unknown>,
): boolean {
  try {
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch {
    return false;
  }
}
