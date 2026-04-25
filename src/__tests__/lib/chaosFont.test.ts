import { describe, it, expect } from 'vitest'
import { randomizeChar } from '../../lib/chaosFont'

describe('randomizeChar', () => {
  it('returns a CSSProperties object', () => {
    const style = randomizeChar()
    expect(typeof style).toBe('object')
  })

  it('returns a fontFamily string', () => {
    const style = randomizeChar()
    expect(typeof style.fontFamily).toBe('string')
    expect((style.fontFamily as string).length).toBeGreaterThan(0)
  })

  it('returns fontSize between 12px and 28px', () => {
    for (let i = 0; i < 50; i++) {
      const style = randomizeChar()
      const size = parseFloat(style.fontSize as string)
      expect(size).toBeGreaterThanOrEqual(12)
      expect(size).toBeLessThanOrEqual(28)
    }
  })

  it('returns rotation between -15 and +15 degrees', () => {
    for (let i = 0; i < 50; i++) {
      const style = randomizeChar()
      const transform = style.transform as string
      const match = transform.match(/rotate\((-?[\d.]+)deg\)/)
      expect(match).not.toBeNull()
      const deg = parseFloat(match![1] as string)
      expect(deg).toBeGreaterThanOrEqual(-15)
      expect(deg).toBeLessThanOrEqual(15)
    }
  })

  it('sets display to inline-block', () => {
    const style = randomizeChar()
    expect(style.display).toBe('inline-block')
  })

  it('sets transition to none', () => {
    const style = randomizeChar()
    expect(style.transition).toBe('none')
  })

  it('produces varied results across calls', () => {
    const styles = Array.from({ length: 20 }, () => randomizeChar())
    const families = new Set(styles.map(s => s.fontFamily))
    expect(families.size).toBeGreaterThan(1)
  })
})
