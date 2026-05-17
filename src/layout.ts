import type { Poem, ComputedLayout, ComputedStanza, ComputedLine, ComputedFragment } from './types'

const FONT_FAMILY = 'Georgia, "Times New Roman", serif'

let _ctx: CanvasRenderingContext2D | null = null
function measureText(text: string, size: number, weight?: number, style?: string): number {
  if (typeof document !== 'undefined') {
    if (!_ctx) {
      const c = document.createElement('canvas')
      _ctx = c.getContext('2d')
    }
    if (_ctx) {
      const w = weight ?? 400
      const s = style ?? 'normal'
      _ctx.font = `${s} ${w} ${size}px ${FONT_FAMILY}`
      return _ctx.measureText(text).width
    }
  }
  return text.length * size * 0.6
}

export { measureText }

export function findSplitIndex(text: string, size: number, weight: number, style: string, x: number): number {
  if (!text || text.length <= 1) return 1
  let best = 1
  let bestDist = Math.abs(x - measureText(text[0], size, weight, style))
  for (let i = 2; i < text.length; i++) {
    const w = measureText(text.slice(0, i), size, weight, style)
    const dist = Math.abs(x - w)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  return Math.max(1, Math.min(text.length - 1, best))
}

export function computeLayout(poem: Poem): ComputedLayout {
  const width = poem.canvas?.width ?? 800
  let currentY = 0
  const stanzas: ComputedStanza[] = []

  for (const stanza of poem.stanzas) {
    const lines: ComputedLine[] = []
    const stanzaStartY = currentY

    for (const line of stanza.lines) {
      const lineHeight = (line.spacing ?? 1.5) * (line.fragments[0]?.size ?? 16)
      const lineIndent = (line.indent ?? 0) * (line.fragments[0]?.size ?? 16) * 0.6
      const alignment = line.alignment ?? 'left'
      const fragments: ComputedFragment[] = []

      let totalFragmentWidth = 0
      for (const f of line.fragments) {
        totalFragmentWidth += measureText(f.text, f.size ?? 16, f.weight, f.style)
      }

      let xOffset: number
      if (alignment === 'center') {
        xOffset = (width - totalFragmentWidth) / 2
      } else if (alignment === 'right') {
        xOffset = width - totalFragmentWidth
      } else {
        xOffset = lineIndent
      }

      for (let fi = 0; fi < line.fragments.length; fi++) {
        const f = line.fragments[fi]
        const fs = f.size ?? 16
        const fw = measureText(f.text, fs, f.weight, f.style)
        const fh = fs * 1.4
        const offsetX = f.offsetX ?? 0
        const offsetY = f.offsetY ?? 0

        fragments.push({
          text: f.text,
          size: fs,
          weight: f.weight ?? 400,
          style: f.style ?? 'normal',
          color: f.color ?? '#000000',
          gradient: f.gradient,
          x: xOffset + offsetX,
          y: currentY + offsetY,
          width: fw,
          height: fh,
          offsetX: f.offsetX,
          offsetY: f.offsetY,
        })

        xOffset += fw + fs * 0.3
      }

      lines.push({ fragments, y: currentY, height: lineHeight, alignment })
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
