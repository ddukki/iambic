# Changelog

## [0.1.0] - 2026-05-17

### Added
- Initial core renderer: schema, validator, layout engine, CSS generation, HTML generation
- Multiple output modes: HTML string, self-contained document, DOM mount, React component
- Full poem data model: fragments, lines, stanzas, canvas, background layers
- Background layers: solid, gradient, image, shape, texture
- Fragment-level styling: size, weight, color, gradient, italic, offset positioning
- Line alignment: left, center, right with indent support
- Text gradient support via CSS `background-clip: text`
- Demo page: "The Road Not Taken" by Robert Frost
- Subpath exports: `iambic/react`, `iambic/dom`, `iambic/css`, `iambic/layout`, `iambic/html`, `iambic/schema`, `iambic/validator`
- `render(poem, options?)` — normalize and render to HTML string
- `exportFile(poem, options?)` — complete self-contained HTML document
- `renderPoemHTML(poem, options?)` — direct render without normalization
- `renderFullDocument(poem, options?)` — full document with CSP and meta tags
- `mountPoem(poem, container)` / `unmount()` — DOM lifecycle
- `PoemRenderer` React component (optional peer dependency)
- `validatePoem(poem)` — structural validation with detailed errors
- `normalizePoem(poem)` — fill optional fields with defaults

### Security
- HTML escaping for fragment text and document title (`&`, `<`, `>`, `"`)
- CSS injection sanitization: dangerous characters stripped from color, gradient, and URL values
- Image backgrounds blocked by default — opt-in via `allowExternalImages: true`
- Content Security Policy in exported documents — `script-src 'none'`, `img-src 'self'` by default

### Changed
- API surface: `render()` and `exportFile()` now accept `RenderOptions` as second argument
