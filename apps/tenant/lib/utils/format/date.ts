/**
 * Date/Time Formatting Utilities
 * Inspired by Minimals.cc format-time.ts
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ============================================
// DATE FORMATTERS
// ============================================

/**
 * Format date
 * @example fDate('2024-01-15') => "15/01/2024"
 */
export function fDate(date: Date | string | number, formatStr: string = 'dd/MM/yyyy'): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(parsedDate, formatStr, { locale: ptBR });
}

/**
 * Format date and time
 * @example fDateTime('2024-01-15T10:30:00') => "15/01/2024 10:30"
 */
export function fDateTime(
  date: Date | string | number,
  formatStr: string = 'dd/MM/yyyy HH:mm'
): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(parsedDate, formatStr, { locale: ptBR });
}

/**
 * Format time only
 * @example fTime('2024-01-15T10:30:00') => "10:30"
 */
export function fTime(date: Date | string | number, formatStr: string = 'HH:mm'): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(parsedDate, formatStr, { locale: ptBR });
}

/**
 * Format relative time
 * @example fToNow('2024-01-15') => "há 3 dias"
 */
export function fToNow(date: Date | string | number): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return formatDistanceToNow(parsedDate, {
    addSuffix: true,
    locale: ptBR,
  });
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string | number): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  const today = new Date();
  return parsedDate.toDateString() === today.toDateString();
}

/**
 * Check if date is this week
 */
export function isThisWeek(date: Date | string | number): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return parsedDate >= weekAgo && parsedDate <= today;
}
