import React, { useMemo } from 'react'
import type { Poem } from './types'
import { normalizePoem } from './schema'
import { renderPoemHTML } from './html'

export interface PoemRendererProps {
  poem: Poem
  className?: string
}

export function PoemRenderer({ poem, className }: PoemRendererProps): React.ReactElement {
  const html = useMemo(() => renderPoemHTML(normalizePoem(poem)), [poem])

  return React.createElement('div', {
    className: className ?? '',
    dangerouslySetInnerHTML: { __html: html },
  })
}
