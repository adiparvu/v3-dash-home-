/**
 * Format a date string or Date object into a human-readable date string.
 * Output example: "Jun 17, 2026"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

/**
 * Format a date as a long-form string with time.
 * Output example: "June 17, 2026 at 3:45 PM"
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d)
}

/**
 * Format a date relative to now.
 * Output examples: "just now", "2 minutes ago", "3 hours ago",
 *                  "yesterday", "5 days ago", "Jun 17, 2026"
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 30) {
    return 'just now'
  }
  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`
  }
  if (diffMinutes === 1) {
    return '1 minute ago'
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`
  }
  if (diffHours === 1) {
    return '1 hour ago'
  }
  if (diffHours < 24) {
    return `${diffHours} hours ago`
  }
  if (diffDays === 1) {
    return 'yesterday'
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }

  // Fall back to formatted date for older entries
  return formatDate(d)
}

/**
 * Format a numeric amount as a currency string.
 *
 * @param amount   - The numeric value to format
 * @param currency - ISO 4217 currency code (default: "USD")
 * @param locale   - BCP 47 locale string (default: "en-US")
 *
 * Output example: formatCurrency(1234.5) → "$1,234.50"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a square-metre area value with thousand separators and the m² unit.
 *
 * @param sqm - Area in square metres
 *
 * Output examples:
 *   formatArea(1234)   → "1,234 m²"
 *   formatArea(0.5)    → "0.5 m²"
 *   formatArea(10000)  → "10,000 m²"
 */
export function formatArea(sqm: number): string {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(sqm)
  return `${formatted} m²`
}

/**
 * Format a file size in bytes to a human-readable string.
 * Output examples: "512 B", "1.5 KB", "3.2 MB", "1.1 GB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  const formatted =
    i === 0
      ? value.toString()
      : new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(
          value
        )
  return `${formatted} ${units[i]}`
}

/**
 * Format a decimal number as a percentage string.
 * Input is a fraction (0–1) or a whole percentage (0–100).
 *
 * @param value      - The percentage value
 * @param asFraction - If true, multiplies value by 100 before formatting
 *
 * Output examples:
 *   formatPercent(0.754)          → "75.4%"
 *   formatPercent(75.4, false)    → "75.4%"
 */
export function formatPercent(
  value: number,
  asFraction: boolean = true
): string {
  const pct = asFraction ? value * 100 : value
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(pct)}%`
}
