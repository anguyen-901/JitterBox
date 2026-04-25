import { useState, useRef, useCallback, useEffect, type CSSProperties } from 'react'
import { randomizeChar } from '../lib/chaosFont'

interface Props {
  onSubmit: (value: string) => void
}

// Shared AudioContext — created once, reused for all typewriter clicks
let sharedAudioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  sharedAudioCtx ??= new AudioContext()
  return sharedAudioCtx
}

function playTypewriterClick(): void {
  setTimeout(() => {
    try {
      const ctx = getAudioContext()
      const sampleCount = Math.floor(ctx.sampleRate * 0.05)
      const buf = ctx.createBuffer(1, sampleCount, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        // noUncheckedIndexedAccess: TypedArray writes are always in-bounds inside this loop
        if (i < data.length) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
      }
      const src = ctx.createBufferSource()
      src.buffer = buf
      src.connect(ctx.destination)
      src.start()
    } catch {
      // Ignore if AudioContext unavailable
    }
  }, 500)
}

export function ChaosInput({ onSubmit }: Props) {
  const [value, setValue] = useState('')
  const [charStyles, setCharStyles] = useState<CSSProperties[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus the hidden input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    setCharStyles(Array.from({ length: newValue.length }, () => randomizeChar()))
    playTypewriterClick()
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit(value)
      setValue('')
      setCharStyles([])
    }
  }, [value, onSubmit])

  return (
    <div style={{ position: 'relative', minHeight: '48px', width: '100%' }}>
      {/* Visual chaos display */}
      <div
        data-testid="chaos-display"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          minHeight: '48px',
          padding: '8px',
          border: '3px inset #808080',
          background: '#ffffff',
          wordBreak: 'break-all',
          lineHeight: '2',
          pointerEvents: 'none',
        }}
      >
        {value.split('').map((char, i) => (
          <span key={i} style={charStyles[i] ?? {}}>
            {char}
          </span>
        ))}
        {value.length === 0 && (
          <span style={{ color: '#999', fontFamily: '"Comic Sans MS", cursive', fontSize: '14px' }}>
            type your volume here...
          </span>
        )}
      </div>

      {/* Hidden real input */}
      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="type volume"
        aria-label="Volume input"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          minHeight: '48px',
          opacity: 0,
          cursor: 'text',
          zIndex: 1,
        }}
      />
    </div>
  )
}
