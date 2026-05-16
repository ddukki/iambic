import type { Poem, ComputedLayout, ComputedStanza, ComputedLine, ComputedWord } from './types'

function measureText(text: string, size: number): number {
  return text.length * size * 0.6
}

export function computeLayout(poem: Poem): ComputedLayout {
  const width = poem.canvas?.width ?? 800
  let currentY = 0
  const stanzas: ComputedStanza[] = []

  for (const stanza of poem.stanzas) {
    const lines: ComputedLine[] = []
    const stanzaStartY = currentY

    for (const line of stanza.lines) {
      const lineHeight = (line.spacing ?? 1.5) * (line.words[0]?.size ?? 16)
      const lineIndent = (line.indent ?? 0) * (line.words[0]?.size ?? 16) * 0.6
      const alignment = line.alignment ?? 'left'
      const words: ComputedWord[] = []

      let totalWordWidth = 0
      for (const w of line.words) {
        totalWordWidth += measureText(w.text, w.size ?? 16)
      }

      let xOffset: number
      if (alignment === 'center') {
        xOffset = (width - totalWordWidth) / 2
      } else if (alignment === 'right') {
        xOffset = width - totalWordWidth
      } else {
        xOffset = lineIndent
      }

      for (let wi = 0; wi < line.words.length; wi++) {
        const w = line.words[wi]
        const ws = w.size ?? 16
        const ww = measureText(w.text, ws)
        const wh = ws * 1.4
        const offsetX = w.offsetX ?? 0
        const offsetY = w.offsetY ?? 0

        words.push({
          text: w.text,
          size: ws,
          weight: w.weight ?? 400,
          style: w.style ?? 'normal',
          x: xOffset + offsetX,
          y: currentY + offsetY,
          width: ww,
          height: wh,
        })

        xOffset += ww + ws * 0.3
      }

      lines.push({ words, y: currentY, height: lineHeight, alignment })
      currentY += lineHeight
    }

    const stanzaHeight = currentY - stanzaStartY
    stanzas.push({ lines, y: stanzaStartY, height: stanzaHeight })
    currentY += stanza.spacingAfter ?? 24
  }

  const canvas = {
    width: poem.canvas?.width ?? 800,
    height: poem.canvas?.height ?? 'auto' as const,
    background: poem.canvas?.background ?? '#ffffff',
  }

  return {
    width,
    height: currentY,
    stanzas,
    backgrounds: poem.backgrounds ?? [],
    canvas,
  }
}
