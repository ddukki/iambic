import { describe, it, expect } from 'vitest'
import { render, exportFile } from '../src/index'

describe('index exports', () => {
  it('render should normalize and render a raw poem', () => {
    const html = render({ stanzas: [{ lines: [{ fragments: [{ text: 'Hi' }] }] }] })
    expect(html).toContain('Hi')
    expect(html).toContain('class="iambic-poem"')
  })

  it('exportFile should produce a full HTML document', () => {
    const doc = exportFile({ stanzas: [{ lines: [{ fragments: [{ text: 'Hi' }] }] }] })
    expect(doc).toContain('<!DOCTYPE html>')
    expect(doc).toContain('<html')
  })

  it('render should pass options through', () => {
    const poem = {
      backgrounds: [{ type: 'image', url: 'https://example.com/bg.jpg' }],
      stanzas: [{ lines: [{ fragments: [{ text: 'Hi' }] }] }],
    }
    const html = render(poem, { allowExternalImages: true })
    expect(html).toContain('example.com')
    const htmlDefault = render(poem)
    expect(htmlDefault).not.toContain('example.com')
  })
})
