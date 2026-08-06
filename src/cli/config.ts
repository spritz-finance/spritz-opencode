import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  applyEdits,
  modify,
  parse,
  type FormattingOptions,
  type ParseError,
} from "jsonc-parser";
import { OPENCODE_CONFIG_DIR } from "./constants.js";

const formattingOptions: FormattingOptions = {
  insertSpaces: true,
  tabSize: 2,
  eol: "\n",
};

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
    const errors: ParseError[] = [];
    const value = parse(content, errors, {
      allowTrailingComma: true,
      disallowComments: false,
    });
    return errors.length === 0 && isRecord(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeConfig(
  configPath: string,
  config: Record<string, unknown>,
): boolean {
  try {
    if (!existsSync(configPath)) {
      writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
      return true;
    }

    const originalText = readFileSync(configPath, "utf-8");
    const original = readConfig(configPath);
    if (!original) return false;

    let updatedText = originalText;
    for (const change of diffValues(original, config)) {
      updatedText = applyEdits(
        updatedText,
        modify(updatedText, change.path, change.value, { formattingOptions }),
      );
    }
    writeFileSync(configPath, updatedText.endsWith("\n") ? updatedText : `${updatedText}\n`);
    return true;
  } catch {
    return false;
  }
}

interface ConfigChange {
  path: (string | number)[];
  value: unknown;
}

function diffValues(
  before: unknown,
  after: unknown,
  path: (string | number)[] = [],
): ConfigChange[] {
  if (isRecord(before) && isRecord(after)) {
    const changes: ConfigChange[] = [];
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      if (!(key in after)) {
        changes.push({ path: [...path, key], value: undefined });
      } else if (!(key in before)) {
        changes.push({ path: [...path, key], value: after[key] });
      } else {
        changes.push(...diffValues(before[key], after[key], [...path, key]));
      }
    }
    return changes;
  }

  return JSON.stringify(before) === JSON.stringify(after)
    ? []
    : [{ path, value: after }];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
