import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { applyGaslighting } from '../../hooks/useGaslighting'

describe('applyGaslighting', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves after 80ms', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99) // above 0.40 — no swap
    const promise = applyGaslighting('twenty percent')
    vi.advanceTimersByTime(80)
    const result = await promise
    expect(result).toBe('twenty percent')
  })

  it('passes through input when random is above 0.40', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    const promise = applyGaslighting('forty percent')
    vi.advanceTimersByTime(80)
    expect(await promise).toBe('forty percent')
  })

  it('swaps "forty" to "fourty" when triggered', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01) // below 0.40 — swap
    const promise = applyGaslighting('forty percent')
    vi.advanceTimersByTime(80)
    expect(await promise).toBe('fourty percent')
  })

  it('swaps "twenty" to "tweny" when triggered', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01)
    const promise = applyGaslighting('twenty percent')
    vi.advanceTimersByTime(80)
    expect(await promise).toBe('tweny percent')
  })

  it('swaps "fifty" to "fifity" when triggered', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01)
    const promise = applyGaslighting('fifty percent')
    vi.advanceTimersByTime(80)
    expect(await promise).toBe('fifity percent')
  })

  it('swaps "ninety" to "ninty" when triggered', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01)
    const promise = applyGaslighting('ninety percent')
    vi.advanceTimersByTime(80)
    expect(await promise).toBe('ninty percent')
  })

  it('passes through input with no swappable word', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01)
    const promise = applyGaslighting('one percent')
    vi.advanceTimersByTime(80)
    expect(await promise).toBe('one percent')
  })

  it('does not resolve before 80ms', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    let resolved = false
    void applyGaslighting('twenty percent').then(v => { resolved = true; return v })
    vi.advanceTimersByTime(79)
    await Promise.resolve() // flush microtasks
    expect(resolved).toBe(false)
  })

  it('swaps "thirty" to "thirdy" when triggered', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01)
    const promise = applyGaslighting('thirty percent')
    vi.advanceTimersByTime(80)
    expect(await promise).toBe('thirdy percent')
  })

  it('swaps "eleven" to "elevin" when triggered', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01)
    const promise = applyGaslighting('eleven percent')
    vi.advanceTimersByTime(80)
    expect(await promise).toBe('elevin percent')
  })

  it('swaps "twelve" to "twleve" when triggered', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01)
    const promise = applyGaslighting('twelve percent')
    vi.advanceTimersByTime(80)
    expect(await promise).toBe('twleve percent')
  })

  it('swaps "thirteen" to "thrteen" when triggered', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01)
    const promise = applyGaslighting('thirteen percent')
    vi.advanceTimersByTime(80)
    expect(await promise).toBe('thrteen percent')
  })
})
