import type { CSSProperties } from 'react'

const FONT_FAMILIES = [
  '"Comic Sans MS"',
  'Papyrus',
  'Impact',
  '"Courier New"',
  '"Arial Black"',
  'Verdana',
  '"Times New Roman"',
  'Georgia',
  'Garamond',
  '"Trebuchet MS"',
  'Fantasy',
  'Monospace',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

export function randomizeChar(): CSSProperties {
  const rotation = -15 + Math.random() * 30
  return {
    fontFamily: pick(FONT_FAMILIES),
    fontSize: `${12 + Math.random() * 16}px`,
    fontWeight: Math.random() > 0.5 ? 'bold' : 'normal',
    display: 'inline-block',
    transform: `rotate(${rotation}deg)`,
    transition: 'none',
  }
}
