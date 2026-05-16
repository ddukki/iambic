import { describe, it, expect } from 'vitest'
import { normalizePoem } from '../src/schema'

const minimal: Parameters<typeof normalizePoem>[0] = {
  stanzas: [{ lines: [{ words: [{ text: 'Hello' }] }] }],
}

describe('normalizePoem', () => {
  it('should fill default values for missing fields', () => {
    const result = normalizePoem(minimal)
    expect(result.canvas).toEqual({ width: 800, height: 'auto', background: '#ffffff' })
    expect(result.stanzas[0].spacingAfter).toBe(24)
    expect(result.stanzas[0].lines[0].indent).toBe(0)
    expect(result.stanzas[0].lines[0].alignment).toBe('left')
    expect(result.stanzas[0].lines[0].spacing).toBe(1.5)
    expect(result.stanzas[0].lines[0].words[0].size).toBe(16)
    expect(result.stanzas[0].lines[0].words[0].weight).toBe(400)
    expect(result.stanzas[0].lines[0].words[0].style).toBe('normal')
  })

  it('should preserve explicitly set values', () => {
    const poem = {
      canvas: { width: 500, height: 1000, background: '#000' },
      stanzas: [{
        spacingAfter: 48,
        lines: [{
          indent: 4,
          alignment: 'center' as const,
          spacing: 2.0,
          words: [{ text: 'Hi', size: 32, weight: 700, style: 'italic' as const }],
        }],
      }],
    }
    const result = normalizePoem(poem)
    expect(result.canvas.width).toBe(500)
    expect(result.canvas.height).toBe(1000)
    expect(result.stanzas[0].spacingAfter).toBe(48)
    expect(result.stanzas[0].lines[0].indent).toBe(4)
    expect(result.stanzas[0].lines[0].words[0].size).toBe(32)
  })

  it('should handle explicit undefined without dropping defaults', () => {
    const poem = {
      canvas: { width: undefined as any, height: undefined as any, background: undefined as any },
      stanzas: [{
        lines: [{
          words: [{ text: 'Hi', size: undefined as any, weight: undefined as any }],
        }],
      }],
    }
    const result = normalizePoem(poem as any)
    expect(result.canvas.width).toBe(800)
    expect(result.canvas.height).toBe('auto')
    expect(result.stanzas[0].lines[0].words[0].size).toBe(16)
    expect(result.stanzas[0].lines[0].words[0].weight).toBe(400)
  })

  it('should default backgrounds and meta when omitted', () => {
    const result = normalizePoem({ stanzas: [{ lines: [{ words: [{ text: 'a' }] }] }] })
    expect(result.backgrounds).toEqual([])
    expect(result.meta).toEqual({})
  })

  it('should preserve text gradient when set', () => {
    const poem = {
      stanzas: [{
        lines: [{
          words: [{ text: 'Gradient', gradient: { colors: ['red', 'blue'], angle: 90 } }],
        }],
      }],
    }
    const result = normalizePoem(poem)
    expect(result.stanzas[0].lines[0].words[0].gradient).toEqual({ colors: ['red', 'blue'], angle: 90 })
  })
})
