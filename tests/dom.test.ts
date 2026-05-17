import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mountPoem } from '../src/dom'
import { normalizePoem } from '../src/schema'

describe('mountPoem', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it('should mount poem HTML into container', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ fragments: [{ text: 'Hello', size: 16 }] }] }],
    })
    mountPoem(poem, container)
    expect(container.querySelector('.iambic-poem')).not.toBeNull()
    expect(container.textContent).toContain('Hello')
  })

  it('should return an unmount function', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ fragments: [{ text: 'Test' }] }] }],
    })
    const unmount = mountPoem(poem, container)
    expect(typeof unmount).toBe('function')
    unmount()
    expect(container.querySelector('.iambic-poem')).toBeNull()
  })
})
