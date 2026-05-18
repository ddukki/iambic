import { normalizePoem } from './schema'
import { renderPoemHTML, renderFullDocument } from './html'
import type { Poem, RenderOptions } from './types'

export type * from './types'
export { normalizePoem } from './schema'
export { validatePoem } from './validator'
export type { ValidationResult, ValidationError } from './validator'
export { renderPoemHTML, renderFullDocument } from './html'
export { mountPoem } from './dom'

export function render(poem: Poem, options?: RenderOptions): string {
  return renderPoemHTML(normalizePoem(poem), options)
}

export function exportFile(poem: Poem, options?: RenderOptions): string {
  return renderFullDocument(normalizePoem(poem), options)
}
