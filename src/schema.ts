import type { Poem, Canvas, Stanza, Line, Word } from './types'

const DEFAULTS = {
  canvas: { width: 800, height: 'auto' as const, background: '#ffffff' },
  word: { size: 16, weight: 400, style: 'normal' as const, color: '#000000', offsetX: 0, offsetY: 0 },
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

export function normalizeWord(word: Word) {
  return {
    text: word.text,
    size: word.size ?? DEFAULTS.word.size,
    weight: word.weight ?? DEFAULTS.word.weight,
    style: word.style ?? DEFAULTS.word.style,
    color: word.color ?? DEFAULTS.word.color,
    offsetX: word.offsetX ?? DEFAULTS.word.offsetX,
    offsetY: word.offsetY ?? DEFAULTS.word.offsetY,
    gradient: word.gradient,
  }
}

export function normalizeLine(line: Line) {
  return {
    indent: line.indent ?? DEFAULTS.line.indent,
    alignment: line.alignment ?? DEFAULTS.line.alignment,
    spacing: line.spacing ?? DEFAULTS.line.spacing,
    words: line.words.map(normalizeWord),
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
