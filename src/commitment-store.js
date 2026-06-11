const KEY = "zhixing-commitment";

export function createCommitmentStore(storage) {
  return {
    save(value) {
      const normalized = value.trim();
      storage.setItem(KEY, normalized);
      return normalized;
    },
    read() {
      return storage.getItem(KEY) ?? "";
    },
  };
}

