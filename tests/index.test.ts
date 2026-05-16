import { describe, it, expect } from 'vitest'
import { render, exportFile } from '../src/index'

describe('index exports', () => {
  it('render should normalize and render a raw poem', () => {
    const html = render({ stanzas: [{ lines: [{ words: [{ text: 'Hi' }] }] }] })
    expect(html).toContain('Hi')
    expect(html).toContain('class="iambic-poem"')
  })

  it('exportFile should produce a full HTML document', () => {
    const doc = exportFile({ stanzas: [{ lines: [{ words: [{ text: 'Hi' }] }] }] })
    expect(doc).toContain('<!DOCTYPE html>')
    expect(doc).toContain('<html')
  })
})
