import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the appropriate text size class based on the input length
 * @param value - The string value to check
 * @param threshold - The character length threshold (default: 17)
 * @param smallerSize - The size class to use when over threshold (default: '12px')
 * @param defaultSize - The default size class (default: '24px')
 */
export function getDynamicTextSize(
  value: string,
  threshold = 17,
  smallerSize = '16px',
  defaultSize = '24px'
) {
  return value.length > threshold ? smallerSize : defaultSize;
}

/**
 * Formats a blockchain address by truncating it to a specified number of characters
 * @param address - The blockchain address to format
 * @param chars - The number of characters to display at the beginning and end of the address
 * @returns The formatted address with the specified number of characters at the beginning and end
 */
export function formatTruncatedAddress(
  address: string | undefined | null,
  chars: number = 4
): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Formats a number with specified decimal places and separators
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  options: {
    maxDecimals?: number;
    minDecimals?: number;
    thousandSeparator?: string;
    decimalSeparator?: string;
    showEllipsis?: boolean;
  } = {}
): string {
  const {
    maxDecimals = 6,
    minDecimals = 2,
    thousandSeparator = ',',
    decimalSeparator = '.',
    showEllipsis = true,
  } = options;

  const hasMore = hasMoreDecimals(value, maxDecimals);
  const formatted = value.toLocaleString(undefined, {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: minDecimals,
    useGrouping: true,
  });

  return hasMore && showEllipsis ? `${formatted}...` : formatted;
}

/**
 * Checks if a number has more decimal places than the specified threshold
 * @param value - The number to check
 * @param threshold - The maximum number of decimal places (default: 6)
 * @returns boolean indicating if the number has more decimal places than the threshold
 */
export function hasMoreDecimals(value: number, threshold: number = 6): boolean {
  return value.toString().split('.')[1]?.length > threshold;
}

/**
 * Shuffles an array in place
 * @param array - The array to shuffle
 * @returns The shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export type RoundingMode = 'up' | 'down' | 'nearest';

export function roundNumber(
  num: number,
  decimals: number,
  mode: RoundingMode = 'nearest'
): number {
  const factor = Math.pow(10, decimals);

  switch (mode) {
    case 'up':
      return Math.ceil(num * factor) / factor;
    case 'down':
      return Math.floor(num * factor) / factor;
    case 'nearest':
      return Math.round(num * factor) / factor;
    default:
      throw new Error('Invalid mode');
  }
}
