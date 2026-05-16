import type { Poem } from './types'
import { computeLayout } from './layout'
import { generateWordStyles, generatePoemStyles, generateBackgroundStyles } from './css'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderPoemHTML(poem: Poem): string {
  const layout = computeLayout(poem)
  const poemStyles = generatePoemStyles({ width: layout.width, height: layout.height, background: layout.canvas?.background ?? '#ffffff' })

  let backgroundsHTML = ''
  if (poem.backgrounds && poem.backgrounds.length > 0) {
    backgroundsHTML = poem.backgrounds.map((bg, i) => {
      const styles = generateBackgroundStyles(bg)
      return `    <div class="iambic-background iambic-background-${i}" style="${styles}"></div>`
    }).join('\n')
  }

  let stanzasHTML = layout.stanzas.map((stanza) => {
    let linesHTML = stanza.lines.map((line) => {
      let wordsHTML = line.words.map((word) => {
        const styles = generateWordStyles(word)
        return `          <span class="iambic-word" style="${styles}">${escapeHtml(word.text)}</span>`
      }).join('\n')
      return `        <div class="iambic-line">\n${wordsHTML}\n        </div>`
    }).join('\n')
    return `      <div class="iambic-stanza">\n${linesHTML}\n      </div>`
  }).join('\n')

  return `<div class="iambic-poem" style="${poemStyles}">
${backgroundsHTML}
      <div class="iambic-content" style="position: relative; z-index: 1;">
${stanzasHTML}
      </div>
    </div>`
}

export function renderFullDocument(poem: Poem): string {
  const poemHTML = renderPoemHTML(poem)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
