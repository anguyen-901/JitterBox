import { toWords } from 'number-to-words'

// Build lookup map: "forty-two percent" → 42
const VOLUME_MAP = new Map<string, number>()
for (let i = 0; i <= 100; i++) {
  VOLUME_MAP.set(`${toWords(i)} percent`, i)
}

export function parseVolume(input: string): number | null {
  const normalized = input.trim().toLowerCase()
  const result = VOLUME_MAP.get(normalized)
  return result !== undefined ? result : null
}

export function volumeToWords(n: number): string {
  return `${toWords(n)} percent`
}
