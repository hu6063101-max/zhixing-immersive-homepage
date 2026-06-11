export function createMapState(quotes, options = {}) {
  const currentNumber = options.currentNumber ?? null;
  const theme = options.theme ?? "all";
  const query = options.query ?? "";
  const normalized = query.trim().toLowerCase();
  const visible = quotes.filter((quote) => {
    const matchesTheme = theme === "all" || quote.theme === theme;
    const matchesQuery = !normalized || quote.text.toLowerCase().includes(normalized);
    return matchesTheme && matchesQuery;
  });
  const current = quotes.find((quote) => quote.number === currentNumber) ?? null;

  const nextState = (changes) => createMapState(quotes, { currentNumber, theme, query, ...changes });
  const move = (offset) => {
    if (!current) return nextState({ currentNumber: visible[0]?.number ?? null });
    const source = visible.length ? visible : quotes;
    const index = source.findIndex((quote) => quote.number === current.number);
    const nextIndex = (Math.max(index, 0) + offset + source.length) % source.length;
    return nextState({ currentNumber: source[nextIndex].number });
  };

  return {
    current,
    theme,
    query,
    visible,
    open: (number) => nextState({ currentNumber: number }),
    close: () => nextState({ currentNumber: null }),
    next: () => move(1),
    previous: () => move(-1),
    filterTheme: (nextTheme) => nextState({ theme: nextTheme, currentNumber: null }),
    search: (nextQuery) => nextState({ query: nextQuery, currentNumber: null }),
  };
}

