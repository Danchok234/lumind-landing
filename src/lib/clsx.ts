/**
 * Minimal className utility — joins truthy strings, no extra deps.
 * Handles strings, undefined, null, false.
 */
export function clsx(
  ...inputs: (string | undefined | null | false | 0)[]
): string {
  return inputs.filter(Boolean).join(' ');
}
