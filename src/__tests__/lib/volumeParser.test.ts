import { describe, it, expect } from 'vitest'
import { parseVolume, volumeToWords } from '../../lib/volumeParser'

describe('parseVolume', () => {
  it('parses zero', () => {
    expect(parseVolume('zero percent')).toBe(0)
  })

  it('parses one', () => {
    expect(parseVolume('one percent')).toBe(1)
  })

  it('parses twenty', () => {
    expect(parseVolume('twenty percent')).toBe(20)
  })

  it('parses forty-two', () => {
    expect(parseVolume('forty-two percent')).toBe(42)
  })

  it('parses one hundred', () => {
    expect(parseVolume('one hundred percent')).toBe(100)
  })

  it('is case-insensitive', () => {
    expect(parseVolume('Forty-Two Percent')).toBe(42)
  })

  it('trims whitespace', () => {
    expect(parseVolume('  twenty percent  ')).toBe(20)
  })

  it('returns null for digits', () => {
    expect(parseVolume('42')).toBeNull()
  })

  it('returns null for partial match', () => {
    expect(parseVolume('forty-two')).toBeNull()
  })

  it('returns null for misspelling', () => {
    expect(parseVolume('fourty percent')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(parseVolume('')).toBeNull()
  })
})

describe('volumeToWords', () => {
  it('converts 0 to "zero percent"', () => {
    expect(volumeToWords(0)).toBe('zero percent')
  })

  it('converts 42 to "forty-two percent"', () => {
    expect(volumeToWords(42)).toBe('forty-two percent')
  })

  it('converts 100 to "one hundred percent"', () => {
    expect(volumeToWords(100)).toBe('one hundred percent')
  })
})
