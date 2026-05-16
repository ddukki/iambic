import type { ComputedWord, BackgroundLayer } from './types'

export function generateWordStyles(word: ComputedWord): string {
  const parts: string[] = []

  parts.push(`font-size: ${word.size ?? 16}px`)
  parts.push(`font-weight: ${word.weight ?? 400}`)
  parts.push(`font-style: ${word.style ?? 'normal'}`)
  parts.push(`position: absolute`)

  if (word.gradient) {
    parts.push(`background: linear-gradient(${word.gradient.angle}deg, ${word.gradient.colors.join(', ')})`)
    parts.push(`-webkit-background-clip: text`)
    parts.push(`-webkit-text-fill-color: transparent`)
    parts.push(`background-clip: text`)
  } else {
    parts.push(`color: ${word.color ?? '#000000'}`)
  }

  if (word.x !== 0 || word.y !== 0) {
    parts.push(`left: ${word.x}px`)
    parts.push(`top: ${word.y}px`)
  }

  return parts.join('; ')
}

export function generatePoemStyles(poemCanvas: { width: number; background: string }): string {
  const parts: string[] = [
    `width: ${poemCanvas.width}px`,
    `position: relative`,
    `overflow: hidden`,
    `background: ${poemCanvas.background}`,
    `font-family: Georgia, 'Times New Roman', serif`,
  ]
  return parts.join('; ')
}

export function generateBackgroundStyles(background: BackgroundLayer): string {
  switch (background.type) {
    case 'solid':
      return `background: ${background.color}; position: absolute; inset: 0;${background.opacity !== undefined ? ` opacity: ${background.opacity};` : ''}`
    case 'gradient': {
      const colors = background.colors.join(', ')
      return `background: linear-gradient(${background.angle ?? 180}deg, ${colors}); position: absolute; inset: 0;${background.opacity !== undefined ? ` opacity: ${background.opacity};` : ''}`
    }
    case 'image':
      return `background-image: url(${background.url}); background-size: ${background.fit ?? 'cover'}; background-position: center; position: absolute; inset: 0;${background.opacity !== undefined ? ` opacity: ${background.opacity};` : ''}`
    default:
      return `position: absolute; inset: 0;`
  }
}
