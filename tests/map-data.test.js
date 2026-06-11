import { describe, expect, it } from "vitest";
import { createMapPoints } from "../src/map-data.js";
import { quotes, themes } from "../src/content.js";

describe("cognition map data", () => {
  it("creates one stable unique point for every quote", () => {
    const first = createMapPoints(quotes, themes);
    const second = createMapPoints(quotes, themes);

    expect(first).toHaveLength(100);
    expect(first).toEqual(second);
    expect(new Set(first.map((point) => point.id)).size).toBe(100);
    expect(new Set(first.map((point) => `${point.x}:${point.y}`)).size).toBe(100);
  });

  it("places every point inside its theme region", () => {
    const themeIds = new Set(themes.map((theme) => theme.id));
    const points = createMapPoints(quotes, themes);

    expect(points.every((point) => themeIds.has(point.theme))).toBe(true);
    expect(points.every((point) => point.x >= 5 && point.x <= 95)).toBe(true);
    expect(points.every((point) => point.y >= 8 && point.y <= 92)).toBe(true);
  });
});

