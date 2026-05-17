import { describe, it, expect } from 'vitest'
import { computeLayout } from '../src/layout'
import { normalizePoem } from '../src/schema'

describe('computeLayout', () => {
  it('should compute positions for a single word', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ fragments: [{ text: 'Hello', size: 16 }] }] }],
      canvas: { width: 800 },
    })
    const layout = computeLayout(poem)
    expect(layout.stanzas).toHaveLength(1)
    expect(layout.stanzas[0].lines).toHaveLength(1)
    expect(layout.stanzas[0].lines[0].fragments).toHaveLength(1)
    const fragment = layout.stanzas[0].lines[0].fragments[0]
    expect(fragment.text).toBe('Hello')
    expect(fragment.x).toBe(0)
    expect(fragment.y).toBe(0)
    expect(fragment.width).toBeGreaterThan(0)
    expect(fragment.height).toBeGreaterThan(0)
  })

  it('should indent the second line', () => {
    const poem = normalizePoem({
      canvas: { width: 800 },
      stanzas: [{
        lines: [
          { fragments: [{ text: 'First', size: 16 }] },
          { indent: 4, fragments: [{ text: 'Second', size: 16 }] },
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
          { alignment: 'center', fragments: [{ text: 'Center', size: 16 }] },
        ],
      }],
    })
    const layout = computeLayout(poem)
    const fragment = layout.stanzas[0].lines[0].fragments[0]
    const expectedCenter = (800 - fragment.width) / 2
    expect(fragment.x).toBeCloseTo(expectedCenter)
  })

  it('should layout multiple stanzas with spacing', () => {
    const poem = normalizePoem({
      canvas: { width: 800 },
      stanzas: [
        { lines: [{ fragments: [{ text: 'Stanza One', size: 16 }] }] },
        { spacingAfter: 48, lines: [{ fragments: [{ text: 'Stanza Two', size: 16 }] }] },
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
          fragments: [
            { text: 'Normal', size: 16 },
            { text: 'Offset', size: 16, offsetX: 50, offsetY: -10 },
          ],
        }],
      }],
    })
    const layout = computeLayout(poem)
    const fragments = layout.stanzas[0].lines[0].fragments
    const gap = 16 * 0.3
    expect(fragments[1].x).toBeCloseTo(fragments[0].x + fragments[0].width + gap + 50)
    expect(fragments[1].y).toBe(fragments[0].y - 10)
  })

  it('should report total layout dimensions', () => {
    const poem = normalizePoem({
      canvas: { width: 400 },
      stanzas: [{
        lines: [{ fragments: [{ text: 'Hello world', size: 16 }] }],
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
          fragments: [
            { text: 'Word1', size: 16 },
            { text: 'Word2', size: 16 },
            { text: 'Word3', size: 16 },
          ],
        }],
      }],
    })
    const layout = computeLayout(poem)
    const fragments = layout.stanzas[0].lines[0].fragments
    expect(fragments[0].x).toBeLessThan(fragments[1].x)
    expect(fragments[1].x).toBeLessThan(fragments[2].x)
  })

  it('should handle missing canvas gracefully', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ fragments: [{ text: 'No canvas' }] }] }],
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
          { alignment: 'right', fragments: [{ text: 'Right', size: 16 }] },
        ],
      }],
    })
    const layout = computeLayout(poem)
    const fragment = layout.stanzas[0].lines[0].fragments[0]
    expect(fragment.x).toBeGreaterThan(0)
    expect(fragment.x + fragment.width).toBeLessThanOrEqual(layout.width)
  })
})
