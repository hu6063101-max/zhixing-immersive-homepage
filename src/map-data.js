function seeded(number, salt) {
  const value = Math.sin(number * 9283.41 + salt * 77.17) * 43758.5453;
  return value - Math.floor(value);
}

export function createMapPoints(quotes, themes) {
  const themeIndex = new Map(themes.map((theme, index) => [theme.id, index]));

  return quotes.map((quote) => {
    const index = themeIndex.get(quote.theme) ?? 0;
    const column = index % 4;
    const row = Math.floor(index / 4);
    const centerX = 14 + column * 24;
    const centerY = 19 + row * 30;
    const angle = seeded(quote.number, 1) * Math.PI * 2;
    const radius = 3 + seeded(quote.number, 2) * 8;

    return {
      ...quote,
      id: `point-${String(quote.number).padStart(3, "0")}`,
      x: Number(Math.min(95, Math.max(5, centerX + Math.cos(angle) * radius)).toFixed(3)),
      y: Number(Math.min(92, Math.max(8, centerY + Math.sin(angle) * radius)).toFixed(3)),
      elevation: Number((0.4 + seeded(quote.number, 3) * 1.8).toFixed(3)),
    };
  });
}
