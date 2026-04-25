interface Props {
  onPunish: () => void
}

export function TitleBar({ onPunish }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 8px',
        background: '#000080',
        color: '#ffffff',
        fontFamily: '"Comic Sans MS", cursive',
        WebkitAppRegion: 'drag',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
        ★ JitterBox v1.0 ★
      </span>
      <button
        onClick={onPunish}
        style={{
          WebkitAppRegion: 'no-drag',
          background: '#ff0000',
          color: '#ffffff',
          border: '2px outset #ff8888',
          fontFamily: '"Comic Sans MS", cursive',
          fontSize: '11px',
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: '2px 8px',
        }}
      >
        MAKE LOUDER
      </button>
    </div>
  )
}
