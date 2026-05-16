import type { Poem, Canvas, Stanza, Line, Word } from './types'

const DEFAULT_CANVAS = { width: 800, height: 'auto' as const, background: '#ffffff' }
const DEFAULT_WORD = { size: 16, weight: 400, style: 'normal' as const, color: '#000000', offsetX: 0, offsetY: 0 }
const DEFAULT_LINE: Omit<Line, 'words'> = { indent: 0, alignment: 'left' as const, spacing: 1.5 }
const DEFAULT_STANZA: Omit<Stanza, 'lines'> = { spacingAfter: 24 }

export function normalizeCanvas(canvas?: Canvas) {
  return { ...DEFAULT_CANVAS, ...canvas }
}

export function normalizeWord(word: Word) {
  return { ...DEFAULT_WORD, ...word }
}

export function normalizeLine(line: Line) {
  return {
    ...DEFAULT_LINE,
    ...line,
    words: line.words.map(normalizeWord),
  }
}

export function normalizeStanza(stanza: Stanza) {
  return {
    ...DEFAULT_STANZA,
    ...stanza,
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
