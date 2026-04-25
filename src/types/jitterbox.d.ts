import 'react'

interface JitterboxAPI {
  setVolume(volume: number): Promise<void>
  getVolume(): Promise<number>
  onVolumeChange(cb: (volume: number) => void): () => void
  onPunishmentTrigger(cb: () => void): () => void
}

declare global {
  interface Window {
    jitterbox: JitterboxAPI
  }
}

// Augment React CSSProperties with Electron-specific drag region property
declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag'
  }
}

export {}
