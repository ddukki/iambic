import { describe, it, expect } from 'vitest'
import { sanitizeColor, sanitizeUrl, sanitizeNumber } from '../src/sanitize'

describe('sanitizeColor', () => {
  it('passes through valid hex colors', () => {
    expect(sanitizeColor('#ff0000')).toBe('#ff0000')
    expect(sanitizeColor('#f00')).toBe('#f00')
    expect(sanitizeColor('#ff0000ff')).toBe('#ff0000ff')
  })

  it('passes through valid named colors', () => {
    expect(sanitizeColor('red')).toBe('red')
    expect(sanitizeColor('transparent')).toBe('transparent')
    expect(sanitizeColor('currentColor')).toBe('currentColor')
  })

  it('strips CSS injection characters', () => {
    expect(sanitizeColor('red; background: url(evil.com)')).toBe('red background: url(evil.com)')
    expect(sanitizeColor('#ff0000}')).toBe('#ff0000')
    expect(sanitizeColor('red"')).toBe('red')
    expect(sanitizeColor("red'")).toBe('red')
  })

  it('falls back to #000000 for empty result', () => {
    expect(sanitizeColor(';{}"\'')).toBe('#000000')
    expect(sanitizeColor('')).toBe('#000000')
  })

  it('passes through rgba and hsla safely', () => {
    expect(sanitizeColor('rgba(255, 0, 0, 0.5)')).toBe('rgba(255, 0, 0, 0.5)')
    expect(sanitizeColor('hsl(120, 50%, 50%)')).toBe('hsl(120, 50%, 50%)')
  })

  it('handles newlines in color strings', () => {
    expect(sanitizeColor('red\n')).toBe('red')
    expect(sanitizeColor('rgb(255,\n0,\n0)')).toBe('rgb(255,0,0)')
  })
})

describe('sanitizeUrl', () => {
  it('passes through https URLs', () => {
    expect(sanitizeUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
    expect(sanitizeUrl('http://example.com/image.png')).toBe('http://example.com/image.png')
  })

  it('passes through relative URLs', () => {
    expect(sanitizeUrl('/images/poem.png')).toBe('/images/poem.png')
  })

  it('rejects javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('')
  })

  it('sanitizes data: URLs (strips parens that would break url() context)', () => {
    const result = sanitizeUrl('data:text/html,<script>alert(1)</script>')
    expect(result).not.toContain('(')
    expect(result).not.toContain(')')
    expect(result).toContain('data:text/html')
  })

  it('removes characters that break CSS url() context', () => {
    expect(sanitizeUrl('https://evil.com/"); color: red')).toBe('https://evil.com/ color: red')
    const result = sanitizeUrl('https://evil.com/){; color: red')
    expect(result).not.toContain(')')
    expect(result).not.toContain('{')
    expect(result).not.toContain(';')
  })

  it('returns empty for empty input', () => {
    expect(sanitizeUrl('')).toBe('')
    expect(sanitizeUrl('";{}()')).toBe('')
  })
})

describe('sanitizeNumber', () => {
  it('passes through valid numbers', () => {
    expect(sanitizeNumber(16, 12)).toBe(16)
    expect(sanitizeNumber(0, 12)).toBe(0)
    expect(sanitizeNumber(-5, 12)).toBe(-5)
  })

  it('falls back for invalid values', () => {
    expect(sanitizeNumber(undefined, 12)).toBe(12)
    expect(sanitizeNumber(Infinity, 12)).toBe(12)
    expect(sanitizeNumber(NaN, 12)).toBe(12)
  })
})
