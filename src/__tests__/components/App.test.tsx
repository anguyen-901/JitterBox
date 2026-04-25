import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'

// Mock framer-motion to prevent animation issues in jsdom
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) =>
      <div style={style}>{children}</div>,
  },
  useMotionValue: () => ({ set: vi.fn(), get: vi.fn(() => 0) }),
  useAnimationFrame: vi.fn(),
}))

// Mock AudioContext
const mockOscillatorStart = vi.fn()
const mockOscillatorStop = vi.fn()
const mockGainSetValueAtTime = vi.fn()
const mockGainLinearRamp = vi.fn()
const mockOscillatorConnect = vi.fn()
const mockGainConnect = vi.fn()

vi.stubGlobal('AudioContext', vi.fn(() => ({
  createOscillator: vi.fn(() => ({
    frequency: { value: 0 },
    type: 'sine',
    connect: mockOscillatorConnect.mockReturnThis(),
    start: mockOscillatorStart,
    stop: mockOscillatorStop,
  })),
  createGain: vi.fn(() => ({
    gain: {
      setValueAtTime: mockGainSetValueAtTime,
      linearRampToValueAtTime: mockGainLinearRamp,
    },
    connect: mockGainConnect.mockReturnThis(),
  })),
  createBuffer: vi.fn(() => ({ getChannelData: vi.fn(() => new Float32Array(100)) })),
  createBufferSource: vi.fn(() => ({ buffer: null, connect: vi.fn(), start: vi.fn() })),
  destination: {},
  currentTime: 0,
  sampleRate: 44100,
})))

const mockSetVolume = vi.fn().mockResolvedValue(undefined)
const mockGetVolume = vi.fn().mockResolvedValue(42)
const mockOnVolumeChange = vi.fn().mockReturnValue(vi.fn())
const mockOnPunishmentTrigger = vi.fn().mockReturnValue(vi.fn())

beforeEach(() => {
  vi.clearAllMocks()
  mockSetVolume.mockResolvedValue(undefined)
  mockGetVolume.mockResolvedValue(42)
  mockOnVolumeChange.mockReturnValue(vi.fn())
  mockOnPunishmentTrigger.mockReturnValue(vi.fn())

  Object.defineProperty(window, 'jitterbox', {
    value: {
      setVolume: mockSetVolume,
      getVolume: mockGetVolume,
      onVolumeChange: mockOnVolumeChange,
      onPunishmentTrigger: mockOnPunishmentTrigger,
    },
    writable: true,
    configurable: true,
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('App', () => {
  it('renders VolumeDisplay with current volume', async () => {
    mockGetVolume.mockResolvedValue(42)
    render(<App />)
    await act(async () => {})
    const volumeDisplay = screen.getByTestId('volume-display')
    expect(volumeDisplay).toBeInTheDocument()
    // The VolumeDisplay renders the text uppercased inside the testid element
    expect(within(volumeDisplay).getByText(/forty-two percent/i)).toBeInTheDocument()
  })

  it('subscribes to onPunishmentTrigger on mount', async () => {
    render(<App />)
    await act(async () => {})
    expect(mockOnPunishmentTrigger).toHaveBeenCalledTimes(1)
  })

  it('unsubscribes from onPunishmentTrigger on unmount', async () => {
    const mockUnsubscribe = vi.fn()
    mockOnPunishmentTrigger.mockReturnValue(mockUnsubscribe)
    const { unmount } = render(<App />)
    await act(async () => {})
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
  })

  it('triggers punishment (volume 100) on invalid input', async () => {
    // Use real timers but await a real timeout to let the 80ms gaslighting delay fire
    render(<App />)
    await act(async () => {})
    const input = screen.getByPlaceholderText(/type volume/i)
    await userEvent.type(input, 'not valid{Enter}')
    // Wait past the 80ms gaslighting delay
    await act(async () => {
      await new Promise(r => setTimeout(r, 150))
    })
    expect(mockSetVolume).toHaveBeenCalledWith(100)
  }, 10000)

  it('sets correct volume on valid input', async () => {
    // Force gaslighting random check to always skip the swap (> 0.40 → resolve unchanged)
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    render(<App />)
    await act(async () => {})
    const input = screen.getByPlaceholderText(/type volume/i)
    await userEvent.type(input, 'twenty percent{Enter}')
    // Wait past the 80ms gaslighting delay
    await act(async () => {
      await new Promise(r => setTimeout(r, 150))
    })
    expect(mockSetVolume).toHaveBeenCalledWith(20)
  }, 10000)

  it('renders MAKE LOUDER button that triggers punishment', async () => {
    render(<App />)
    await act(async () => {})
    const button = screen.getByRole('button', { name: /make louder/i })
    await userEvent.click(button)
    expect(mockSetVolume).toHaveBeenCalledWith(100)
  })
})
