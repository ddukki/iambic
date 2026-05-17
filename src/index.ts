import { normalizePoem } from './schema'
import { renderPoemHTML, renderFullDocument } from './html'
import type { Poem } from './types'

export type * from './types'
export { normalizePoem } from './schema'
export { validatePoem } from './validator'
export type { ValidationResult, ValidationError } from './validator'
export { renderPoemHTML, renderFullDocument } from './html'
export { mountPoem } from './dom'

export function render(poem: Poem): string {
  return renderPoemHTML(normalizePoem(poem))
}

export function exportFile(poem: Poem): string {
  return renderFullDocument(normalizePoem(poem))
}
