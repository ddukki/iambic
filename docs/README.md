# Iambic

Poetry layout library — takes poem JSON and renders it as self-contained HTML/CSS.

## Installation

```bash
npm install iambic
```

## Quick Start

```ts
import { render } from 'iambic'

const html = render({
  stanzas: [{
    lines: [{ fragments: [{ text: 'Hello', size: 16 }] }]
  }]
})
// → '<div class="iambic-poem" style="...">...</div>'
```

## Rendering Pipeline

```
JSON poem → normalizePoem (fill defaults) → renderPoemHTML (HTML string)
```

Two stages:
1. **Normalize** — fills all optional fields with defaults
2. **Render** — produces HTML/CSS string with inline styles

## Poem Format

### Top-level

```json
{
  "meta": { "title": "...", "author": "..." },
  "canvas": { "width": 600, "background": "#faf6f0" },
  "stanzas": [...],
  "backgrounds": [...]
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `meta` | `{ title?, author? }` | `{}` | Poem metadata |
| `canvas` | `Canvas` | `{ width: 800, height: 'auto', background: '#ffffff' }` | Output canvas |
| `stanzas` | `Stanza[]` | required | Poem content |
| `backgrounds` | `BackgroundLayer[]` | `[]` | Background layers |

### Canvas

```json
{ "width": 600, "height": "auto", "background": "#faf6f0" }
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `width` | `number` | `800` | Canvas width in px |
| `height` | `number \| 'auto'` | `'auto'` | Canvas height |
| `background` | `string` | `#ffffff` | Background color |

### Stanza

```json
{
  "spacingAfter": 32,
  "lines": [...]
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `spacingAfter` | `number` | `24` | Space after stanza in px |
| `lines` | `Line[]` | required | Lines in the stanza |

### Line

```json
{
  "indent": 2,
  "alignment": "left",
  "spacing": 1.5,
  "fragments": [...]
  }
  ```

  | Field | Type | Default | Description |
  |-------|------|---------|-------------|
  | `indent` | `number` | `0` | Left indent in em-widths |
  | `alignment` | `'left' \| 'center' \| 'right'` | `'left'` | Line alignment |
  | `spacing` | `number` | `1.5` | Line height multiplier |
  | `fragments` | `Fragment[]` | required | Fragments on the line |

### Fragment

```json
{
  "text": "diverged",
  "size": 24,
  "weight": 700,
  "color": "#8B4513",
  "style": "normal",
  "offsetX": 0,
  "offsetY": 0,
  "gradient": { "colors": ["#ff0000", "#0000ff"], "angle": 90 }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `text` | `string` | required | Fragment text |
| `size` | `number` | `16` | Font size in px |
| `weight` | `number` | `400` | Font weight |
| `color` | `string` | `#000000` | Text color |
| `style` | `'normal' \| 'italic'` | `'normal'` | Font style |
| `offsetX` | `number` | `0` | Free-position X offset |
| `offsetY` | `number` | `0` | Free-position Y offset |
| `gradient` | `FragmentGradient` | — | Text gradient |

### FragmentGradient

```json
{ "colors": ["#ff6b6b", "#4ecdc4"], "angle": 90 }
```

| Field | Type | Description |
|-------|------|-------------|
| `colors` | `string[]` | Gradient color stops |
| `angle` | `number` | Gradient angle in degrees |

### Background Layers

Five types, discriminated by `type`:

**solid**
```json
{ "type": "solid", "color": "#ff0000", "opacity": 0.5 }
```

**gradient**
```json
{ "type": "gradient", "colors": ["#faf6f0", "#e8ddd0"], "angle": 180 }
```

**image**
```json
{ "type": "image", "url": "https://...", "fit": "cover", "opacity": 0.8 }
```

**shape**
```json
{ "type": "shape", "shape": "circle", "x": 100, "y": 200, "width": 50, "color": "#333" }
```

**texture**
```json
{ "type": "texture", "texture": "paper", "opacity": 0.3 }
```

| Field | Type | Applies To | Description |
|-------|------|------------|-------------|
| `color` | `string` | solid, shape | Background color |
| `colors` | `string[]` | gradient | Gradient color stops |
| `angle` | `number` | gradient | Gradient angle in degrees |
| `url` | `string` | image | Image URL |
| `fit` | `'cover' \| 'contain' \| 'repeat'` | image | Background-size |
| `shape` | `'circle' \| 'rect' \| 'line'` | shape | Shape type |
| `x`, `y` | `number` | shape | Shape position |
| `width`, `height` | `number` | shape | Shape dimensions |
| `texture` | `'paper' \| 'grain' \| 'noise'` | texture | Texture type |
| `opacity` | `number` | all | Opacity 0-1 |

## API

### `render(poem)`

Normalizes and renders a poem to an HTML string.

```ts
import { render } from 'iambic'

const html = render({
  meta: { title: 'My Poem', author: 'Me' },
  canvas: { width: 600, background: '#faf6f0' },
  stanzas: [{ lines: [{ fragments: [{ text: 'Hello', size: 18 }] }] }],
})
```

### `exportFile(poem)`

Returns a complete self-contained HTML document.

```ts
import { exportFile } from 'iambic'

const doc = exportFile(poem)
// document.write(doc) or save to file
```

### `renderPoemHTML(poem, padding?)`

Render without auto-normalizing (poem must already be normalized). Optional `padding` (default 40px).

### `renderFullDocument(poem)`

Returns a full HTML document with `<!DOCTYPE html>`, meta viewport, centered layout.

### `mountPoem(poem, container)`

Mounts the rendered poem into a DOM element. Returns an unmount function.

```ts
import { mountPoem } from 'iambic'

const unmount = mountPoem(poem, document.getElementById('root'))
// unmount() clears it
```

### `validatePoem(poem)`

Validates poem JSON structure. Returns `{ valid: boolean, errors: ValidationError[] }`.

```ts
import { validatePoem } from 'iambic'

const result = validatePoem({ stanzas: [] })
// → { valid: false, errors: [{ path: 'stanzas', message: '...' }] }
```

### `normalizePoem(poem)`

Fills all optional fields with defaults. Returns a fully-populated poem object.

### React Component

```tsx
import { PoemRenderer } from 'iambic/react'

function App() {
  return <PoemRenderer poem={poem} className="my-poem" />
}
```

Props: `{ poem: Poem, className?: string }`

## Default Values

| Field | Default |
|-------|---------|
| `canvas.width` | `800` |
| `canvas.height` | `'auto'` |
| `canvas.background` | `'#ffffff'` |
| `fragment.size` | `16` |
| `fragment.weight` | `400` |
| `fragment.style` | `'normal'` |
| `fragment.color` | `'#000000'` |
| `fragment.offsetX` | `0` |
| `fragment.offsetY` | `0` |
| `line.indent` | `0` |
| `line.alignment` | `'left'` |
| `line.spacing` | `1.5` |
| `stanza.spacingAfter` | `24` |
| `backgrounds` | `[]` |
| `padding` (render) | `40` |

## Output HTML Structure

```html
<div class="iambic-poem" style="width: 600px; height: ...; position: relative; overflow: hidden; background: ...; border-radius: 12px;">
  <div class="iambic-background iambic-background-0" style="position: absolute; inset: 0; ..."></div>
  <div class="iambic-content" style="position: absolute; top: 40px; left: 40px; right: 40px; bottom: 40px; z-index: 1;">
    <div class="iambic-stanza">
      <div class="iambic-line">
        <span class="iambic-fragment" style="font-size: 18px; font-weight: 400; position: absolute; left: 0px; top: 0px; color: #000000;">Two roads</span>
        <span class="iambic-fragment" style="font-size: 24px; font-weight: 700; position: absolute; left: 82px; top: 0px; color: #8B4513;">diverged</span>
      </div>
    </div>
  </div>
</div>
```

Fragments use `position: absolute` within `.iambic-content`. Backgrounds use `position: absolute; inset: 0` to fill the container.
