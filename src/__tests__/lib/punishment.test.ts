import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock AudioContext before importing punishment
const mockOscillatorStop = vi.fn()
const mockOscillatorStart = vi.fn()
const mockOscillatorConnect = vi.fn()
const mockGainConnect = vi.fn()
const mockGainSetValueAtTime = vi.fn()
const mockGainLinearRamp = vi.fn()

const mockOscillator = {
  frequency: { value: 0 },
  type: 'sine' as OscillatorType,
  connect: mockOscillatorConnect.mockReturnThis(),
  start: mockOscillatorStart,
  stop: mockOscillatorStop,
}

const mockGain = {
  gain: {
    setValueAtTime: mockGainSetValueAtTime,
    linearRampToValueAtTime: mockGainLinearRamp,
  },
  connect: mockGainConnect.mockReturnThis(),
}

const mockCtx = {
  createOscillator: vi.fn(() => mockOscillator),
  createGain: vi.fn(() => mockGain),
  destination: {},
  currentTime: 0,
}

vi.stubGlobal('AudioContext', vi.fn(() => mockCtx))

import { playSmokeDetectorChirp } from '../../lib/punishment'

describe('playSmokeDetectorChirp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockOscillatorConnect.mockReturnThis()
    mockGainConnect.mockReturnThis()
  })

  it('creates an AudioContext', () => {
    playSmokeDetectorChirp()
    expect(AudioContext).toHaveBeenCalledTimes(1)
  })

  it('creates two oscillators for double-chirp', () => {
    playSmokeDetectorChirp()
    expect(mockCtx.createOscillator).toHaveBeenCalledTimes(2)
  })

  it('sets oscillator frequency to 3200Hz', () => {
    playSmokeDetectorChirp()
    expect(mockOscillator.frequency.value).toBe(3200)
  })

  it('starts both oscillators', () => {
    playSmokeDetectorChirp()
    expect(mockOscillatorStart).toHaveBeenCalledTimes(2)
  })

  it('stops both oscillators', () => {
    playSmokeDetectorChirp()
    expect(mockOscillatorStop).toHaveBeenCalledTimes(2)
  })

  it('second chirp starts after first (staggered timing)', () => {
    playSmokeDetectorChirp()
    const [firstStart, secondStart] = mockOscillatorStart.mock.calls
    expect((secondStart![0] as number)).toBeGreaterThan(firstStart![0] as number)
  })
})
