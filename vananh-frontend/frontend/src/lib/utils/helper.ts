export function isValidDate(d: unknown) {
  return d instanceof Date && !isNaN(d as any);
}
