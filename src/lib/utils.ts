import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스 병합 유틸리티
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 지갑 주소 형식으로 포맷 (이더스캔 느낌)
 */
export function formatAsAddress(text: string): string {
  const hash = text
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(16)
    .padStart(40, "0")
    .slice(0, 40);
  return `0x${hash}`;
}

/**
 * 날짜를 블록 번호처럼 표시
 */
export function dateToBlock(dateStr: string): string {
  const [year, month] = dateStr.split(".");
  const blockNum = (parseInt(year) - 2019) * 12 + parseInt(month || "1");
  return `#${blockNum.toString().padStart(4, "0")}`;
}

/**
 * Generate a deterministic hash-like string from an input
 */
export function generateHash(input: string, length: number = 40): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const hexChars = '0123456789abcdef';
  let result = '';
  let seed = Math.abs(hash);

  for (let i = 0; i < length; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    result += hexChars[seed % 16];
  }

  return result;
}

/**
 * Generate block hash from experience id
 */
export function generateBlockHash(id: string): string {
  return `0x${generateHash(`block-${id}`, 64)}`;
}

/**
 * Generate transaction hash from project id
 */
export function generateTxHash(id: string): string {
  return `0x${generateHash(`tx-${id}`, 64)}`;
}

/**
 * Shorten hash for display
 */
export function shortenHash(hash: string, chars: number = 8): string {
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Generate block number from period
 */
export function generateBlockNumber(period: string, index: number): number {
  const year = parseInt(period.split('.')[0]) || 2020;
  const month = parseInt(period.split('.')[1]) || 1;
  return year * 10000 + month * 100 + index;
}

/**
 * Calculate "gas" (effort/hours) based on duration
 */
export function calculateGas(period: string): string {
  const parts = period.split(' ~ ');
  if (parts.length !== 2) return 'N/A';

  const start = parts[0];
  const end = parts[1] === 'Present' ? new Date().toISOString().slice(0, 7).replace('-', '.') : parts[1];

  const [startYear, startMonth] = start.split('.').map(Number);
  const [endYear, endMonth] = end.split('.').map(Number);

  const months = (endYear - startYear) * 12 + (endMonth - startMonth);
  const hours = months * 160; // 월 160시간 기준

  return `${hours.toLocaleString()}+ hrs`;
}
