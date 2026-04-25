import { volumeToWords } from '../lib/volumeParser'

interface Props {
  volume: number
}

export function VolumeDisplay({ volume }: Props) {
  const words = volumeToWords(volume).toUpperCase()

  return (
    <div
      data-testid="volume-display"
      style={{
        fontFamily: '"Comic Sans MS", cursive',
        fontSize: '18px',
        color: '#ff0000',
        textAlign: 'center',
        padding: '8px',
        border: '2px dashed #0000ff',
        background: '#ffff00',
        animation: 'blink 1s step-start infinite',
        letterSpacing: '2px',
        marginBottom: '12px',
      }}
    >
      CURRENT VOL: {words}
    </div>
  )
}
