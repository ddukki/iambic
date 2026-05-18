import type { Poem, RenderOptions } from './types'
import { computeLayout } from './layout'
import { generateFragmentStyles, generatePoemStyles, generateBackgroundStyles } from './css'

function normalizeOptions(options?: RenderOptions): Required<RenderOptions> {
  return {
    padding: options?.padding ?? 40,
    allowExternalImages: options?.allowExternalImages ?? false,
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderPoemHTML(poem: Poem, options?: RenderOptions): string {
  const opts = normalizeOptions(options)
  const layout = computeLayout(poem)
  const poemStyles = generatePoemStyles({ width: layout.width, height: layout.height + opts.padding * 2, background: layout.canvas?.background ?? '#ffffff' })

  let backgroundsHTML = ''
  const backgrounds = opts.allowExternalImages ? (poem.backgrounds ?? []) : (poem.backgrounds?.filter(bg => bg.type !== 'image') ?? [])
  for (let i = 0; i < backgrounds.length; i++) {
    const styles = generateBackgroundStyles(backgrounds[i])
    backgroundsHTML += `    <div class="iambic-background iambic-background-${i}" style="${styles}"></div>\n`
  }

  let stanzasHTML = layout.stanzas.map((stanza) => {
    let linesHTML = stanza.lines.map((line) => {
      let fragmentsHTML = line.fragments.map((fragment) => {
        const styles = generateFragmentStyles(fragment)
        return `          <span class="iambic-fragment" style="${styles}">${escapeHtml(fragment.text)}</span>`
      }).join('\n')
      return `        <div class="iambic-line">\n${fragmentsHTML}\n        </div>`
    }).join('\n')
    return `      <div class="iambic-stanza">\n${linesHTML}\n      </div>`
  }).join('\n')

  return `<div class="iambic-poem" style="${poemStyles}">
${backgroundsHTML}      <div class="iambic-content" style="position: absolute; top: ${opts.padding}px; left: ${opts.padding}px; right: ${opts.padding}px; bottom: ${opts.padding}px; z-index: 1;">
${stanzasHTML}
      </div>
    </div>`
}

export function renderFullDocument(poem: Poem, options?: RenderOptions): string {
  const opts = normalizeOptions(options)
  const poemHTML = renderPoemHTML(poem, opts)
  const imgSrc = opts.allowExternalImages ? 'img-src *' : "img-src 'self'"
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; ${imgSrc}; style-src 'unsafe-inline'; script-src 'none'">
  <title>${escapeHtml(poem.meta?.title ?? 'Poem')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
  </style>
</head>
<body>
  ${poemHTML}
</body>
</html>`
}
