import { describe, expect, it } from "vitest";
import { createCommitmentStore } from "../src/commitment-store.js";

describe("commitment store", () => {
  it("saves and reads trimmed commitments", () => {
    const memory = new Map();
    const storage = {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => memory.set(key, value),
    };
    const store = createCommitmentStore(storage);

    store.save("  今天完成第一步  ");

    expect(store.read()).toBe("今天完成第一步");
  });
});

