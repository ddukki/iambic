import { describe, it, expect } from 'vitest'
import { validatePoem } from '../src/validator'

describe('validatePoem', () => {
  it('should return valid for a correct minimal poem', () => {
    const result = validatePoem({ stanzas: [{ lines: [{ words: [{ text: 'Hi' }] }] }] })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject missing stanzas', () => {
    const result = validatePoem({} as any)
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

  it('should reject line with empty words', () => {
    const result = validatePoem({ stanzas: [{ lines: [{ words: [] }] }] })
    expect(result.valid).toBe(false)
  })

  it('should reject word with empty text', () => {
    const result = validatePoem({ stanzas: [{ lines: [{ words: [{ text: '' }] }] }] })
    expect(result.valid).toBe(false)
  })

  it('should reject negative indent', () => {
    const result = validatePoem({ stanzas: [{ lines: [{ indent: -1, words: [{ text: 'a' }] }] }] })
    expect(result.valid).toBe(false)
  })
})
