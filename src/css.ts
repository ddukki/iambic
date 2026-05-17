import type { ComputedFragment, BackgroundLayer } from './types'

export function generateFragmentStyles(fragment: ComputedFragment): string {
  const parts: string[] = []

  parts.push(`font-size: ${fragment.size ?? 16}px`)
  parts.push(`font-weight: ${fragment.weight ?? 400}`)
  parts.push(`font-style: ${fragment.style ?? 'normal'}`)
  parts.push(`position: absolute`)
  parts.push(`white-space: nowrap`)
  parts.push(`overflow: hidden`)

  if (fragment.text) {
    parts.push(`width: ${fragment.width}px`)
  } else {
    parts.push(`min-width: ${(fragment.size ?? 16) * 2}px`)
  }

  if (fragment.gradient) {
    parts.push(`background: linear-gradient(${fragment.gradient.angle}deg, ${fragment.gradient.colors.join(', ')})`)
    parts.push(`-webkit-background-clip: text`)
    parts.push(`-webkit-text-fill-color: transparent`)
    parts.push(`background-clip: text`)
  } else {
    parts.push(`color: ${fragment.color ?? '#000000'}`)
  }

  parts.push(`left: ${fragment.x}px`)
  parts.push(`top: ${fragment.y}px`)

  return parts.join('; ')
}

export function generatePoemStyles(poemCanvas: { width: number; height: number; background: string }): string {
  const parts: string[] = [
    `width: ${poemCanvas.width}px`,
    `height: ${poemCanvas.height}px`,
    `position: relative`,
    `overflow: hidden`,
    `background: ${poemCanvas.background}`,
    `font-family: Georgia, 'Times New Roman', serif`,
    `border-radius: 12px`,
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
