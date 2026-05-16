import { describe, it, expect } from 'vitest'
import { computeLayout } from '../src/layout'
import { normalizePoem } from '../src/schema'

describe('computeLayout', () => {
  it('should compute positions for a single word', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ words: [{ text: 'Hello', size: 16 }] }] }],
      canvas: { width: 800 },
    })
    const layout = computeLayout(poem)
    expect(layout.stanzas).toHaveLength(1)
    expect(layout.stanzas[0].lines).toHaveLength(1)
    expect(layout.stanzas[0].lines[0].words).toHaveLength(1)
    const word = layout.stanzas[0].lines[0].words[0]
    expect(word.text).toBe('Hello')
    expect(word.x).toBe(0)
    expect(word.y).toBe(0)
    expect(word.width).toBeGreaterThan(0)
    expect(word.height).toBeGreaterThan(0)
  })

  it('should indent the second line', () => {
    const poem = normalizePoem({
      canvas: { width: 800 },
      stanzas: [{
        lines: [
          { words: [{ text: 'First', size: 16 }] },
          { indent: 4, words: [{ text: 'Second', size: 16 }] },
        ],
      }],
    })
    const layout = computeLayout(poem)
    const lines = layout.stanzas[0].lines
    expect(lines[1].y).toBeGreaterThan(lines[0].y)
  })

  it('should respect center alignment', () => {
    const poem = normalizePoem({
      canvas: { width: 800 },
      stanzas: [{
        lines: [
          { alignment: 'center', words: [{ text: 'Center', size: 16 }] },
        ],
      }],
    })
    const layout = computeLayout(poem)
    const word = layout.stanzas[0].lines[0].words[0]
    const expectedCenter = (800 - word.width) / 2
    expect(word.x).toBeCloseTo(expectedCenter)
  })

  it('should layout multiple stanzas with spacing', () => {
    const poem = normalizePoem({
      canvas: { width: 800 },
      stanzas: [
        { lines: [{ words: [{ text: 'Stanza One', size: 16 }] }] },
        { spacingAfter: 48, lines: [{ words: [{ text: 'Stanza Two', size: 16 }] }] },
      ],
    })
    const layout = computeLayout(poem)
    expect(layout.stanzas[1].y).toBeGreaterThan(layout.stanzas[0].y)
  })

  it('should apply word offset', () => {
    const poem = normalizePoem({
      canvas: { width: 800 },
      stanzas: [{
        lines: [{
          words: [
            { text: 'Normal', size: 16 },
            { text: 'Offset', size: 16, offsetX: 50, offsetY: -10 },
          ],
        }],
      }],
    })
    const layout = computeLayout(poem)
    const words = layout.stanzas[0].lines[0].words
    const gap = 16 * 0.3
    expect(words[1].x).toBeCloseTo(words[0].x + words[0].width + gap + 50)
    expect(words[1].y).toBe(words[0].y - 10)
  })

  it('should report total layout dimensions', () => {
    const poem = normalizePoem({
      canvas: { width: 400 },
      stanzas: [{
        lines: [{ words: [{ text: 'Hello world', size: 16 }] }],
      }],
    })
    const layout = computeLayout(poem)
    expect(layout.width).toBe(400)
    expect(layout.height).toBeGreaterThan(0)
  })

  it('should handle multiple words on the same line', () => {
    const poem = normalizePoem({
      canvas: { width: 800 },
      stanzas: [{
        lines: [{
          words: [
            { text: 'Word1', size: 16 },
            { text: 'Word2', size: 16 },
            { text: 'Word3', size: 16 },
          ],
        }],
      }],
    })
    const layout = computeLayout(poem)
    const words = layout.stanzas[0].lines[0].words
    expect(words[0].x).toBeLessThan(words[1].x)
    expect(words[1].x).toBeLessThan(words[2].x)
  })

  it('should handle missing canvas gracefully', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ words: [{ text: 'No canvas' }] }] }],
    })
    const layout = computeLayout(poem)
    expect(layout.width).toBe(800)
    expect(layout.canvas.width).toBe(800)
    expect(layout.canvas.background).toBe('#ffffff')
  })

  it('should respect right alignment', () => {
    const poem = normalizePoem({
      canvas: { width: 800 },
      stanzas: [{
        lines: [
          { alignment: 'right', words: [{ text: 'Right', size: 16 }] },
        ],
      }],
    })
    const layout = computeLayout(poem)
    const word = layout.stanzas[0].lines[0].words[0]
    expect(word.x).toBeGreaterThan(0)
    expect(word.x + word.width).toBeLessThanOrEqual(layout.width)
  })
})
