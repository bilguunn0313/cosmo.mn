export function repeatToFill<T>(items: T[], minCount: number) {
  if (items.length === 0) {
    return [];
  }

  const filled = [...items];

  while (filled.length < minCount) {
    filled.push(...items);
  }

  return filled;
}
