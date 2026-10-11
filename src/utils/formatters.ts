/**
 * Utility functions for formatting addresses, transaction hashes, and blockchain identifiers.
 */

/**
 * Truncates a Stellar wallet address or contract ID to a readable shortened format.
 *
 * @param address The address string to truncate.
 * @param startChars Number of leading characters to keep (default: 4).
 * @param endChars Number of trailing characters to keep (default: 4).
 * @returns Truncated address string or empty string / original string if too short.
 */
export function formatAddress(
  address: string | null | undefined,
  startChars: number = 4,
  endChars: number = 4
): string {
  if (!address || typeof address !== 'string') {
    return '';
  }

  const trimmed = address.trim();
  if (trimmed.length <= startChars + endChars) {
    return trimmed;
  }

  return `${trimmed.slice(0, startChars)}...${trimmed.slice(-endChars)}`;
}

/**
 * Truncates a transaction hash or hex identifier with a trailing ellipsis.
 *
 * @param hash The transaction hash string.
 * @param keepChars Number of leading characters to keep (default: 6).
 * @returns Shortened hash string.
 */
export function formatHash(
  hash: string | null | undefined,
  keepChars: number = 6
): string {
  if (!hash || typeof hash !== 'string') {
    return '';
  }

  const trimmed = hash.trim();
  if (trimmed.length <= keepChars) {
    return trimmed;
  }

  return `${trimmed.slice(0, keepChars)}...`;
}
