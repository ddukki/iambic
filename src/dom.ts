import type { Poem } from './types'
import { renderPoemHTML } from './html'

export function mountPoem(poem: Poem, container: HTMLElement): () => void {
  const html = renderPoemHTML(poem)
  container.innerHTML = html

  return () => {
    container.innerHTML = ''
  }
}
