import { describe, expect, test } from "bun:test";
import { SPRITZ_NUDGE_MESSAGE } from "./keywords.js";

describe("Spritz access guidance", () => {
  test("keeps End User and Developer workspace principals separate", () => {
    expect(SPRITZ_NUDGE_MESSAGE).toContain("Spritz End User account");
    expect(SPRITZ_NUDGE_MESSAGE).toContain("Developer HMAC credential");
    expect(SPRITZ_NUDGE_MESSAGE).not.toContain("complete Developer Access");
    expect(SPRITZ_NUDGE_MESSAGE).not.toContain("accept Developer Terms");
  });

  test("advertises only the GET-only MCP surface", () => {
    expect(SPRITZ_NUDGE_MESSAGE).toContain("list_bank_accounts");
    expect(SPRITZ_NUDGE_MESSAGE).toContain("list_off_ramps");
    expect(SPRITZ_NUDGE_MESSAGE).toContain("get_off_ramp_quote");
    expect(SPRITZ_NUDGE_MESSAGE).not.toContain("create_bank_account");
    expect(SPRITZ_NUDGE_MESSAGE).not.toContain("delete_bank_account");
    expect(SPRITZ_NUDGE_MESSAGE).not.toContain("create_off_ramp_quote");
    expect(SPRITZ_NUDGE_MESSAGE).not.toContain("get_off_ramp_transaction");
    expect(SPRITZ_NUDGE_MESSAGE).toContain("intentionally fail-closed");
  });
});
