import type { Poem, Canvas, Stanza, Line, Fragment } from './types'

const DEFAULTS = {
  canvas: { width: 800, height: 'auto' as const, background: '#ffffff' },
  fragment: { size: 16, weight: 400, style: 'normal' as const, color: '#000000', offsetX: 0, offsetY: 0 },
  line: { indent: 0, alignment: 'left' as const, spacing: 1.5 },
  stanza: { spacingAfter: 24 },
}

export function normalizeCanvas(canvas?: Canvas) {
  return {
    width: canvas?.width ?? DEFAULTS.canvas.width,
    height: canvas?.height ?? DEFAULTS.canvas.height,
    background: canvas?.background ?? DEFAULTS.canvas.background,
  }
}

export function normalizeFragment(fragment: Fragment) {
  return {
    text: fragment.text,
    size: fragment.size ?? DEFAULTS.fragment.size,
    weight: fragment.weight ?? DEFAULTS.fragment.weight,
    style: fragment.style ?? DEFAULTS.fragment.style,
    color: fragment.color ?? DEFAULTS.fragment.color,
    offsetX: fragment.offsetX ?? DEFAULTS.fragment.offsetX,
    offsetY: fragment.offsetY ?? DEFAULTS.fragment.offsetY,
    gradient: fragment.gradient,
  }
}

export function normalizeLine(line: Line) {
  return {
    indent: line.indent ?? DEFAULTS.line.indent,
    alignment: line.alignment ?? DEFAULTS.line.alignment,
    spacing: line.spacing ?? DEFAULTS.line.spacing,
    fragments: line.fragments.map(normalizeFragment),
  }
}

export function normalizeStanza(stanza: Stanza) {
  return {
    spacingAfter: stanza.spacingAfter ?? DEFAULTS.stanza.spacingAfter,
    lines: stanza.lines.map(normalizeLine),
  }
}

export function normalizePoem(poem: Poem) {
  return {
    meta: poem.meta ?? {},
    canvas: normalizeCanvas(poem.canvas),
    stanzas: poem.stanzas.map(normalizeStanza),
    backgrounds: poem.backgrounds ?? [],
  }
}
