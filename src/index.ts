import type { Plugin, PluginInput } from "@opencode-ai/plugin";
import type { Part } from "@opencode-ai/sdk";

import { detectKeyword, SPRITZ_NUDGE_MESSAGE } from "./keywords.js";
import { log } from "./services/logger.js";

export const SpritzPlugin: Plugin = async (ctx: PluginInput) => {
  const { directory } = ctx;

  log("Plugin initialized", { directory });

  return {
    "chat.message": async (input, output) => {
      const start = Date.now();

      try {
        const textParts = output.parts.filter(
          (p): p is Part & { type: "text"; text: string } => p.type === "text",
        );

        if (textParts.length === 0) {
          log("chat.message: no text parts found");
          return;
        }

        const userMessage = textParts.map((p) => p.text).join("\n");

        if (!userMessage.trim()) {
          log("chat.message: empty message, skipping");
          return;
        }

        // Never log user text or matched substrings: payment requests can contain
        // amounts, bank details, or other sensitive financial information.
        log("chat.message: processing", { partsCount: output.parts.length });

        const { type } = detectKeyword(userMessage);

        if (type) {
          log(`chat.message: ${type} keyword detected`);

          const nudgePart: Part = {
            id: `spritz-${type}-nudge-${Date.now()}`,
            sessionID: input.sessionID,
            messageID: output.message.id,
            type: "text",
            text: SPRITZ_NUDGE_MESSAGE,
            synthetic: true,
          };

          output.parts.push(nudgePart);

          const duration = Date.now() - start;
          log(`chat.message: ${type} nudge injected`, { duration });
        }
      } catch (error) {
        log("chat.message: ERROR", { error: String(error) });
      }
    },
  };
};

export default SpritzPlugin;
