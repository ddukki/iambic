import { describe, it, expect } from 'vitest'
import { generateFragmentStyles, generateBackgroundStyles, generatePoemStyles } from '../src/css'
import type { ComputedFragment } from '../src/types'

const baseFragment: ComputedFragment = {
  text: 'Hello', x: 0, y: 0, width: 48, height: 22,
  size: 16, weight: 400, style: 'normal',
}

describe('generateFragmentStyles', () => {
  it('should generate basic fragment styles', () => {
    const styles = generateFragmentStyles({ ...baseFragment, color: '#000000' })
    expect(styles).toContain('font-size: 16px')
    expect(styles).toContain('font-weight: 400')
    expect(styles).toContain('color: #000000')
  })

  it('should include text gradient', () => {
    const styles = generateFragmentStyles({
      ...baseFragment, text: 'Colorful',
      gradient: { colors: ['#ff0000', '#0000ff'], angle: 90 },
    })
    expect(styles).toContain('background: linear-gradient(90deg')
    expect(styles).toContain('-webkit-background-clip: text')
  })

  it('should include italic style', () => {
    const styles = generateFragmentStyles({ ...baseFragment, style: 'italic' })
    expect(styles).toContain('font-style: italic')
  })

  it('should include position when offset is present', () => {
    const styles = generateFragmentStyles({ ...baseFragment, x: 100, y: 50 })
    expect(styles).toContain('left: 100px')
    expect(styles).toContain('top: 50px')
  })
})

describe('generatePoemStyles', () => {
  it('should generate container styles', () => {
    const styles = generatePoemStyles({ width: 800, height: 200, background: '#f0f0f0' })
    expect(styles).toContain('width: 800px')
    expect(styles).toContain('height: 200px')
    expect(styles).toContain('background: #f0f0f0')
    expect(styles).toContain('border-radius: 12px')
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

  it('rejected javascript: image URLs yield safe CSS', () => {
    const styles = generateBackgroundStyles({ type: 'image', url: 'javascript:alert(1)', fit: 'cover' })
    expect(styles).not.toContain('javascript')
    expect(styles).not.toContain('url(')
  })

  it('sanitizes CSS injection in solid color', () => {
    const styles = generateBackgroundStyles({ type: 'solid', color: 'red; background-image: url(evil.com)' })
    expect(styles).toContain('background: red background-image: url(evil.com)')
    expect(styles).not.toContain('; background-image:')
  })

  it('sanitizes CSS injection in gradient colors', () => {
    const styles = generateBackgroundStyles({ type: 'gradient', colors: ['#ff0000; color: red', '#0000ff'] })
    expect(styles).toContain('#ff0000 color: red')
    expect(styles).not.toContain('; color: red')
  })

  it('sanitizes CSS injection in fragment color', () => {
    const fragment: ComputedFragment = {
      text: 'test', x: 0, y: 0, width: 20, height: 16,
      size: 16, weight: 400, style: 'normal',
      color: 'red; background: red',
    }
    const styles = generateFragmentStyles(fragment)
    expect(styles).toContain('color: red background: red')
    expect(styles).not.toContain('; background: red')
  })

  it('sanitizes gradient angle injection', () => {
    const fragment: ComputedFragment = {
      text: 'test', x: 0, y: 0, width: 20, height: 16,
      size: 16, weight: 400, style: 'normal',
      gradient: { colors: ['#ff0000'], angle: NaN },
    }
    const styles = generateFragmentStyles(fragment)
    expect(styles).toContain('linear-gradient(180deg')
  })
})
