import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TitleBar } from '../../components/TitleBar'

describe('TitleBar', () => {
  it('renders the app title', () => {
    render(<TitleBar onPunish={vi.fn()} />)
    expect(screen.getByText(/jitterbox/i)).toBeInTheDocument()
  })

  it('renders the MAKE LOUDER button', () => {
    render(<TitleBar onPunish={vi.fn()} />)
    expect(screen.getByRole('button', { name: /make louder/i })).toBeInTheDocument()
  })

  it('calls onPunish when MAKE LOUDER is clicked', async () => {
    const onPunish = vi.fn()
    render(<TitleBar onPunish={onPunish} />)
    await userEvent.click(screen.getByRole('button', { name: /make louder/i }))
    expect(onPunish).toHaveBeenCalledTimes(1)
  })
})
