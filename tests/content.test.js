import { describe, expect, it } from "vitest";
import { themes, quotes } from "../src/content.js";

describe("site content", () => {
  it("contains twelve themed chapters", () => {
    expect(themes).toHaveLength(12);
    expect(new Set(themes.map((theme) => theme.id)).size).toBe(12);
  });

  it("contains every quote from 1 to 100 exactly once", () => {
    expect(quotes).toHaveLength(100);
    expect(quotes.map((quote) => quote.number)).toEqual(
      Array.from({ length: 100 }, (_, index) => index + 1),
    );
  });

  it("assigns every quote to an existing theme", () => {
    const themeIds = new Set(themes.map((theme) => theme.id));
    expect(quotes.every((quote) => themeIds.has(quote.theme))).toBe(true);
  });
});
