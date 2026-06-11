import { describe, expect, it } from "vitest";
import { navigationPages, resolvePage } from "../src/site-pages.js";

describe("site pages", () => {
  it("contains all public thematic pages without login or chat", () => {
    expect(navigationPages.map((page) => page.path)).toEqual([
      "/",
      "/map",
      "/system",
      "/practice",
      "/journal",
      "/commitment",
      "/models",
      "/proof",
      "/principles",
    ]);
    expect(JSON.stringify(navigationPages)).not.toMatch(/login|chat/i);
  });

  it("resolves nested GitHub Pages paths and unknown pages", () => {
    expect(resolvePage("/zhixing-immersive-homepage/map/").id).toBe("map");
    expect(resolvePage("/principles").id).toBe("principles");
    expect(resolvePage("/not-found").id).toBe("home");
  });
});

