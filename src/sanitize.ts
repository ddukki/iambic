export const CSS_COLOR_UNSAFE = /[;"'`{}\n\r]/g
export const CSS_URL_UNSAFE = /[;"'`{}()\n\r]/g

export function sanitizeColor(color: string): string {
  const safe = color.replace(CSS_COLOR_UNSAFE, '').trim()
  return safe || '#000000'
}

export function sanitizeUrl(url: string): string {
  const trimmed = url.trim()
  const safe = trimmed.replace(CSS_URL_UNSAFE, '')
  if (/^(https?:\/\/|\/|data:)/i.test(safe)) return safe
  return ''
}

export function sanitizeNumber(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || !isFinite(value)) return fallback
  return value
}
