import { describe, expect, it } from "vitest";
import { createMapState } from "../src/map-state.js";
import { quotes } from "../src/content.js";

describe("map state", () => {
  it("opens, closes, and navigates notes", () => {
    let state = createMapState(quotes);
    state = state.open(5);
    expect(state.current.number).toBe(5);
    state = state.next();
    expect(state.current.number).toBe(6);
    state = state.previous();
    expect(state.current.number).toBe(5);
    state = state.close();
    expect(state.current).toBeNull();
  });

  it("filters by theme and search query", () => {
    let state = createMapState(quotes);
    state = state.filterTheme("action");
    expect(state.visible.every((quote) => quote.theme === "action")).toBe(true);
    state = state.search("作品");
    expect(state.visible.map((quote) => quote.number)).toContain(35);
  });
});

