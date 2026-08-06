import { describe, expect, test } from "bun:test";
import { SPRITZ_NUDGE_MESSAGE } from "./keywords.js";

describe("Spritz access guidance", () => {
  test("keeps End User and Developer workspace principals separate", () => {
    expect(SPRITZ_NUDGE_MESSAGE).toContain("Spritz End User account");
    expect(SPRITZ_NUDGE_MESSAGE).toContain("Developer HMAC credential");
    expect(SPRITZ_NUDGE_MESSAGE).not.toContain("complete Developer Access");
    expect(SPRITZ_NUDGE_MESSAGE).not.toContain("accept Developer Terms");
  });
});
