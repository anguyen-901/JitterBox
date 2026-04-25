import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMirrorMode } from '../../hooks/useMirrorMode'

describe('useMirrorMode', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Fix Math.random to control timing: first call = activation delay, second = duration
    let callCount = 0
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++
      // First call: delay factor → 0 → minimum delay (8s)
      // Second call: duration factor → 0 → minimum duration (3s)
      return 0
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('starts as not mirrored', () => {
    const { result } = renderHook(() => useMirrorMode())
    expect(result.current).toBe(false)
  })

  it('becomes mirrored after the activation delay (8s minimum)', () => {
    const { result } = renderHook(() => useMirrorMode())
    expect(result.current).toBe(false)
    act(() => { vi.advanceTimersByTime(8000) })
    expect(result.current).toBe(true)
  })

  it('returns to unmirrored after duration (3s minimum)', () => {
    const { result } = renderHook(() => useMirrorMode())
    act(() => { vi.advanceTimersByTime(8000) })
    expect(result.current).toBe(true)
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current).toBe(false)
  })

  it('cleans up on unmount without throwing', () => {
    const { unmount } = renderHook(() => useMirrorMode())
    act(() => { vi.advanceTimersByTime(8000) })
    expect(() => unmount()).not.toThrow()
  })
})
