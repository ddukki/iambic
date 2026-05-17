export interface ValidationError {
  path: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export function validatePoem(poem: unknown): ValidationResult {
  const errors: ValidationError[] = []

  if (!poem || typeof poem !== 'object') {
    return { valid: false, errors: [{ path: '', message: 'Poem must be an object' }] }
  }

  const p = poem as Record<string, unknown>

  if (!Array.isArray(p.stanzas)) {
    errors.push({ path: 'stanzas', message: 'stanzas must be an array' })
    return { valid: false, errors }
  }

  if (p.stanzas.length === 0) {
    errors.push({ path: 'stanzas', message: 'poem must have at least one stanza' })
  }

  for (let si = 0; si < p.stanzas.length; si++) {
    const stanza = p.stanzas[si] as Record<string, unknown>
    const sp = `stanzas[${si}]`

    if (!stanza || typeof stanza !== 'object') {
      errors.push({ path: sp, message: 'stanza must be an object' })
      continue
    }

    if (!Array.isArray(stanza.lines)) {
      errors.push({ path: `${sp}.lines`, message: 'lines must be an array' })
      continue
    }

    if (stanza.lines.length === 0) {
      errors.push({ path: `${sp}.lines`, message: 'stanza must have at least one line' })
    }

    for (let li = 0; li < stanza.lines.length; li++) {
      const line = stanza.lines[li] as Record<string, unknown>
      const lp = `${sp}.lines[${li}]`

      if (!line || typeof line !== 'object') {
        errors.push({ path: lp, message: 'line must be an object' })
        continue
      }

      if (typeof line.indent === 'number' && line.indent < 0) {
        errors.push({ path: `${lp}.indent`, message: 'indent must be non-negative' })
      }

      if (!Array.isArray(line.fragments)) {
        errors.push({ path: `${lp}.fragments`, message: 'fragments must be an array' })
        continue
      }

      if (line.fragments.length === 0) {
        errors.push({ path: `${lp}.fragments`, message: 'line must have at least one fragment' })
      }

      for (let fi = 0; fi < line.fragments.length; fi++) {
        const fragment = line.fragments[fi] as Record<string, unknown>
        const wp = `${lp}.fragments[${fi}]`

        if (!fragment || typeof fragment !== 'object') {
          errors.push({ path: wp, message: 'fragment must be an object' })
          continue
        }

        if (typeof fragment.text !== 'string' || fragment.text.trim() === '') {
          errors.push({ path: `${wp}.text`, message: 'fragment text must be a non-blank string' })
        }
      }
    }
  }

  return { valid: errors.length === 0, errors }
}
