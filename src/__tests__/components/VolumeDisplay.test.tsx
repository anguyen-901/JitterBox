import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VolumeDisplay } from '../../components/VolumeDisplay'

describe('VolumeDisplay', () => {
  it('renders volume as words', () => {
    render(<VolumeDisplay volume={42} />)
    expect(screen.getByText(/forty-two percent/i)).toBeInTheDocument()
  })

  it('renders zero', () => {
    render(<VolumeDisplay volume={0} />)
    expect(screen.getByText(/zero percent/i)).toBeInTheDocument()
  })

  it('renders one hundred', () => {
    render(<VolumeDisplay volume={100} />)
    expect(screen.getByText(/one hundred percent/i)).toBeInTheDocument()
  })

  it('renders with a data-testid for targeting', () => {
    render(<VolumeDisplay volume={50} />)
    expect(screen.getByTestId('volume-display')).toBeInTheDocument()
  })
})
