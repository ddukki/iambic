import type { ComputedFragment, BackgroundLayer } from './types'
import { sanitizeColor, sanitizeUrl, sanitizeNumber } from './sanitize'

export function generateFragmentStyles(fragment: ComputedFragment): string {
  const parts: string[] = []

  parts.push(`font-size: ${sanitizeNumber(fragment.size, 16)}px`)
  parts.push(`font-weight: ${sanitizeNumber(fragment.weight, 400)}`)
  parts.push(`font-style: ${fragment.style ?? 'normal'}`)
  parts.push(`position: absolute`)
  parts.push(`white-space: nowrap`)
  parts.push(`overflow: hidden`)

  if (fragment.text) {
    parts.push(`width: ${sanitizeNumber(fragment.width, 0)}px`)
  } else {
    parts.push(`min-width: ${sanitizeNumber(fragment.size, 16) * 2}px`)
  }

  if (fragment.gradient) {
    parts.push(`background: linear-gradient(${sanitizeNumber(fragment.gradient.angle, 180)}deg, ${fragment.gradient.colors.map(sanitizeColor).join(', ')})`)
    parts.push(`-webkit-background-clip: text`)
    parts.push(`-webkit-text-fill-color: transparent`)
    parts.push(`background-clip: text`)
  } else {
    parts.push(`color: ${sanitizeColor(fragment.color ?? '#000000')}`)
  }

  parts.push(`left: ${sanitizeNumber(fragment.x, 0)}px`)
  parts.push(`top: ${sanitizeNumber(fragment.y, 0)}px`)

  return parts.join('; ')
}

export function generatePoemStyles(poemCanvas: { width: number; height: number; background: string }): string {
  const parts: string[] = [
    `width: ${sanitizeNumber(poemCanvas.width, 800)}px`,
    `height: ${sanitizeNumber(poemCanvas.height, 200)}px`,
    `position: relative`,
    `overflow: hidden`,
    `background: ${sanitizeColor(poemCanvas.background)}`,
    `font-family: Georgia, 'Times New Roman', serif`,
    `border-radius: 12px`,
  ]
  return parts.join('; ')
}

export function generateBackgroundStyles(background: BackgroundLayer): string {
  switch (background.type) {
    case 'solid':
      return `background: ${sanitizeColor(background.color)}; position: absolute; inset: 0;${background.opacity !== undefined ? ` opacity: ${sanitizeNumber(background.opacity, 1)};` : ''}`
    case 'gradient': {
      const colors = background.colors.map(sanitizeColor).join(', ')
      return `background: linear-gradient(${sanitizeNumber(background.angle, 180)}deg, ${colors}); position: absolute; inset: 0;${background.opacity !== undefined ? ` opacity: ${sanitizeNumber(background.opacity, 1)};` : ''}`
    }
    case 'image': {
      const url = sanitizeUrl(background.url)
      return url
        ? `background-image: url(${url}); background-size: ${background.fit ?? 'cover'}; background-position: center; position: absolute; inset: 0;${background.opacity !== undefined ? ` opacity: ${sanitizeNumber(background.opacity, 1)};` : ''}`
        : 'position: absolute; inset: 0;'
    }
    default:
      return `position: absolute; inset: 0;`
  }
}
