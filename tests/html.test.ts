import { describe, it, expect } from 'vitest'
import { renderPoemHTML, renderFullDocument } from '../src/html'
import { normalizePoem } from '../src/schema'

describe('renderPoemHTML', () => {
  it('should render a minimal poem as HTML string', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ fragments: [{ text: 'Hello', size: 16 }] }] }],
    })
    const html = renderPoemHTML(poem)
    expect(html).toContain('class="iambic-poem"')
    expect(html).toContain('Hello')
    expect(html).toContain('font-size: 16px')
  })

  it('should render multiple words', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ fragments: [{ text: 'Hello' }, { text: 'world' }] }] }],
    })
    const html = renderPoemHTML(poem)
    expect(html).toContain('Hello')
    expect(html).toContain('world')
  })

  it('should render multiple lines', () => {
    const poem = normalizePoem({
      stanzas: [{
        lines: [
          { fragments: [{ text: 'Line one' }] },
          { fragments: [{ text: 'Line two' }] },
        ],
      }],
    })
    const html = renderPoemHTML(poem)
    expect(html).toContain('Line one')
    expect(html).toContain('Line two')
  })

  it('should render background layers', () => {
    const poem = normalizePoem({
      backgrounds: [{ type: 'solid', color: '#ff0000' }],
      stanzas: [{ lines: [{ fragments: [{ text: 'Test' }] }] }],
    })
    const html = renderPoemHTML(poem)
    expect(html).toContain('background: #ff0000')
  })

  it('should render text gradients', () => {
    const poem = normalizePoem({
      stanzas: [{
        lines: [{
          fragments: [{
            text: 'Rainbow',
            gradient: { colors: ['#ff0000', '#00ff00'], angle: 90 },
          }],
        }],
      }],
    })
    const html = renderPoemHTML(poem)
    expect(html).toContain('background: linear-gradient(90deg')
    expect(html).toContain('background-clip: text')
  })

  it('escapes HTML in fragment text', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ fragments: [{ text: '<script>alert(1)</script>' }] }] }],
    })
    const html = renderPoemHTML(poem)
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).not.toContain('<script>')
  })

  it('escapes HTML ampersands in fragment text', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ fragments: [{ text: 'a & b' }] }] }],
    })
    const html = renderPoemHTML(poem)
    expect(html).toContain('a &amp; b')
    expect(html).not.toContain('a & b')
  })

  it('sanitizes CSS injection via background color', () => {
    const poem = normalizePoem({
      backgrounds: [{ type: 'solid', color: '#ff0000; background-image: url(evil.com)' }],
      stanzas: [{ lines: [{ fragments: [{ text: 'Test' }] }] }],
    })
    const html = renderPoemHTML(poem)
    expect(html).not.toContain('; background-image:')
  })

  it('sanitizes CSS injection via canvas background', () => {
    const poem = normalizePoem({
      canvas: { width: 800, background: '#ffffff; color: red' },
      stanzas: [{ lines: [{ fragments: [{ text: 'Test' }] }] }],
    })
    const html = renderPoemHTML(poem)
    expect(html).not.toContain('; color: red')
  })

  it('escapes title in full document', () => {
    const poem = normalizePoem({
      meta: { title: '<script>alert("xss")</script>' },
      stanzas: [{ lines: [{ fragments: [{ text: 'Hi' }] }] }],
    })
    const doc = renderFullDocument(poem)
    expect(doc).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    expect(doc).not.toContain('<script>')
  })

  it('drops image backgrounds by default', () => {
    const poem = normalizePoem({
      backgrounds: [
        { type: 'solid', color: '#ff0000' },
        { type: 'image', url: 'https://example.com/bg.jpg' },
      ],
      stanzas: [{ lines: [{ fragments: [{ text: 'Test' }] }] }],
    })
    const html = renderPoemHTML(poem)
    expect(html).toContain('background: #ff0000')
    expect(html).not.toContain('background-image')
    expect(html).not.toContain('example.com')
  })

  it('renders image backgrounds when allowExternalImages is true', () => {
    const poem = normalizePoem({
      backgrounds: [
        { type: 'image', url: 'https://example.com/bg.jpg' },
      ],
      stanzas: [{ lines: [{ fragments: [{ text: 'Test' }] }] }],
    })
    const html = renderPoemHTML(poem, { allowExternalImages: true })
    expect(html).toContain('background-image')
    expect(html).toContain('example.com')
  })

  it('includes CSP meta tag in full document by default', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ fragments: [{ text: 'Hi' }] }] }],
    })
    const doc = renderFullDocument(poem)
    expect(doc).toContain('Content-Security-Policy')
    expect(doc).toContain("img-src 'self'")
    expect(doc).toContain("script-src 'none'")
  })

  it('sets permissive img-src CSP when allowExternalImages is true', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ fragments: [{ text: 'Hi' }] }] }],
    })
    const doc = renderFullDocument(poem, { allowExternalImages: true })
    expect(doc).toContain('img-src *')
  })
})

describe('renderFullDocument', () => {
  it('should return a complete HTML document', () => {
    const poem = normalizePoem({
      stanzas: [{ lines: [{ fragments: [{ text: 'Hi' }] }] }],
    })
    const doc = renderFullDocument(poem)
    expect(doc).toContain('<!DOCTYPE html>')
    expect(doc).toContain('<html')
    expect(doc).toContain('</html>')
    expect(doc).toContain('Hi')
  })
})
