export const stripNoSqlOperators = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripNoSqlOperators);
  }
  if (value !== null && typeof value === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      cleaned[key] = stripNoSqlOperators(val);
    }
    return cleaned;
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
};

export const escapeRegex = (input: string): string => {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
