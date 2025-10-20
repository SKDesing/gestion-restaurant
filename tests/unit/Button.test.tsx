import { describe, it, expect } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'

import Button from '../../src/components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    const { getByText } = render(<Button>Click</Button>)
    expect(getByText('Click')).toBeTruthy()
  })
})
