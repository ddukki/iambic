import { describe, it, expect } from 'vitest'
import { generateWordStyles, generateBackgroundStyles, generatePoemStyles } from '../src/css'
import type { ComputedWord } from '../src/types'

const baseWord: ComputedWord = {
  text: 'Hello', x: 0, y: 0, width: 48, height: 22,
  size: 16, weight: 400, style: 'normal',
}

describe('generateWordStyles', () => {
  it('should generate basic word styles', () => {
    const styles = generateWordStyles({ ...baseWord, color: '#000000' })
    expect(styles).toContain('font-size: 16px')
    expect(styles).toContain('font-weight: 400')
    expect(styles).toContain('color: #000000')
  })

  it('should include text gradient', () => {
    const styles = generateWordStyles({
      ...baseWord, text: 'Colorful',
      gradient: { colors: ['#ff0000', '#0000ff'], angle: 90 },
    })
    expect(styles).toContain('background: linear-gradient(90deg')
    expect(styles).toContain('-webkit-background-clip: text')
  })

  it('should include italic style', () => {
    const styles = generateWordStyles({ ...baseWord, style: 'italic' })
    expect(styles).toContain('font-style: italic')
  })

  it('should include position when offset is present', () => {
    const styles = generateWordStyles({ ...baseWord, x: 100, y: 50 })
    expect(styles).toContain('left: 100px')
    expect(styles).toContain('top: 50px')
  })
})

describe('generatePoemStyles', () => {
  it('should generate container styles', () => {
    const styles = generatePoemStyles({ width: 800, background: '#f0f0f0' })
    expect(styles).toContain('width: 800px')
    expect(styles).toContain('background: #f0f0f0')
  })
})

describe('generateBackgroundStyles', () => {
  it('should generate solid background styles', () => {
    const styles = generateBackgroundStyles({ type: 'solid', color: '#ff0000' })
    expect(styles).toContain('background: #ff0000')
  })

  it('should generate gradient background styles', () => {
    const styles = generateBackgroundStyles({ type: 'gradient', colors: ['#ff0000', '#0000ff'], angle: 180 })
    expect(styles).toContain('linear-gradient(180deg')
  })
})
