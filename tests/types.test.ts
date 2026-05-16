import { describe, it, expect } from 'vitest'

describe('types', () => {
  it('should import without error', async () => {
    const types = await import('../src/types')
    expect(types).toBeDefined()
  })
})
