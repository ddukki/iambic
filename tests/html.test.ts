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
