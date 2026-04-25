import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChaosInput } from '../../components/ChaosInput'

// Mock AudioContext for typewriter sound
vi.stubGlobal('AudioContext', vi.fn(() => ({
  createBuffer: vi.fn(() => ({ getChannelData: vi.fn(() => new Float32Array(100)) })),
  createBufferSource: vi.fn(() => ({ buffer: null, connect: vi.fn(), start: vi.fn() })),
  destination: {},
  sampleRate: 44100,
})))

describe('ChaosInput', () => {
  const onSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with placeholder text', () => {
    render(<ChaosInput onSubmit={onSubmit} />)
    expect(screen.getByPlaceholderText(/type volume/i)).toBeInTheDocument()
  })

  it('calls onSubmit with current value on Enter', async () => {
    render(<ChaosInput onSubmit={onSubmit} />)
    const input = screen.getByPlaceholderText(/type volume/i)
    await userEvent.type(input, 'forty percent{Enter}')
    expect(onSubmit).toHaveBeenCalledWith('forty percent')
  })

  it('clears input after submit', async () => {
    render(<ChaosInput onSubmit={onSubmit} />)
    const input = screen.getByPlaceholderText(/type volume/i)
    await userEvent.type(input, 'twenty percent{Enter}')
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('renders character spans for each typed character', async () => {
    render(<ChaosInput onSubmit={onSubmit} />)
    const input = screen.getByPlaceholderText(/type volume/i)
    await userEvent.type(input, 'abc')
    const spans = screen.getByTestId('chaos-display').querySelectorAll('span')
    expect(spans.length).toBe(3)
  })
})
