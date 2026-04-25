import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useVolumeSync } from '../../hooks/useVolumeSync'

const mockUnsubscribe = vi.fn()
const mockGetVolume = vi.fn()
const mockOnVolumeChange = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  mockGetVolume.mockResolvedValue(50)
  mockOnVolumeChange.mockReturnValue(mockUnsubscribe)
  Object.defineProperty(window, 'jitterbox', {
    value: {
      getVolume: mockGetVolume,
      onVolumeChange: mockOnVolumeChange,
      setVolume: vi.fn(),
      onPunishmentTrigger: vi.fn().mockReturnValue(vi.fn()),
    },
    configurable: true,
  })
})

describe('useVolumeSync', () => {
  it('initializes volume from getVolume()', async () => {
    mockGetVolume.mockResolvedValue(42)
    const { result } = renderHook(() => useVolumeSync())
    await act(async () => {})
    expect(result.current.volume).toBe(42)
  })

  it('subscribes to onVolumeChange on mount', () => {
    renderHook(() => useVolumeSync())
    expect(mockOnVolumeChange).toHaveBeenCalledTimes(1)
  })

  it('updates volume when callback fires', async () => {
    const { result } = renderHook(() => useVolumeSync())
    await act(async () => {})
    const callback = mockOnVolumeChange.mock.calls[0]![0] as (v: number) => void
    act(() => callback(77))
    expect(result.current.volume).toBe(77)
  })

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useVolumeSync())
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
  })
})
