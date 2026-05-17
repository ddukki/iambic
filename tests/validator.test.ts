import { describe, it, expect } from 'vitest'
import { validatePoem } from '../src/validator'

describe('validatePoem', () => {
  it('should return valid for a correct minimal poem', () => {
    const result = validatePoem({ stanzas: [{ lines: [{ fragments: [{ text: 'Hi' }] }] }] })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject missing stanzas', () => {
    const result = validatePoem({})
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should reject empty stanzas', () => {
    const result = validatePoem({ stanzas: [] })
    expect(result.valid).toBe(false)
  })

  it('should reject stanza with empty lines', () => {
    const result = validatePoem({ stanzas: [{ lines: [] }] })
    expect(result.valid).toBe(false)
  })

  it('should reject line with empty fragments', () => {
    const result = validatePoem({ stanzas: [{ lines: [{ fragments: [] }] }] })
    expect(result.valid).toBe(false)
  })

  it('should reject fragment with empty text', () => {
    const result = validatePoem({ stanzas: [{ lines: [{ fragments: [{ text: '' }] }] }] })
    expect(result.valid).toBe(false)
  })

  it('should reject whitespace-only text', () => {
    const result = validatePoem({ stanzas: [{ lines: [{ fragments: [{ text: '   ' }] }] }] })
    expect(result.valid).toBe(false)
  })

  it('should reject negative indent', () => {
    const result = validatePoem({ stanzas: [{ lines: [{ indent: -1, fragments: [{ text: 'a' }] }] }] })
    expect(result.valid).toBe(false)
  })

  it('should reject null input', () => {
    const result = validatePoem(null)
    expect(result.valid).toBe(false)
  })

  it('should reject non-object input', () => {
    const result = validatePoem('not a poem')
    expect(result.valid).toBe(false)
  })
})
