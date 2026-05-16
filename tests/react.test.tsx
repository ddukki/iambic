import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { PoemRenderer } from '../src/react'

describe('PoemRenderer', () => {
  it('should render a poem', () => {
    const poem = { stanzas: [{ lines: [{ words: [{ text: 'Hello React' }] }] }] }
    const { container } = render(React.createElement(PoemRenderer, { poem }))
    expect(container.querySelector('.iambic-poem')).not.toBeNull()
    expect(container.textContent).toContain('Hello React')
  })

  it('should accept a className prop', () => {
    const poem = { stanzas: [{ lines: [{ words: [{ text: 'Test' }] }] }] }
    const { container } = render(React.createElement(PoemRenderer, { poem, className: 'my-poem' }))
    expect(container.querySelector('.my-poem')).not.toBeNull()
  })
})
