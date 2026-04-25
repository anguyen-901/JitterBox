import { useCallback, useEffect } from 'react'
import { TitleBar } from './components/TitleBar'
import { VolumeDisplay } from './components/VolumeDisplay'
import { ChaosInput } from './components/ChaosInput'
import { FloatingWrapper } from './components/FloatingWrapper'
import { useVolumeSync } from './hooks/useVolumeSync'
import { useMirrorMode } from './hooks/useMirrorMode'
import { applyGaslighting } from './hooks/useGaslighting'
import { parseVolume } from './lib/volumeParser'
import { playSmokeDetectorChirp } from './lib/punishment'
import './assets/index.css'

async function triggerPunishment(): Promise<void> {
  await window.jitterbox.setVolume(100)
  playSmokeDetectorChirp()
}

export default function App() {
  const { volume } = useVolumeSync()
  const mirrored = useMirrorMode()

  // Subscribe to main-process punishment trigger (close button, Cmd+Q)
  useEffect(() => {
    const unsubscribe = window.jitterbox.onPunishmentTrigger(() => {
      void triggerPunishment()
    })
    return unsubscribe
  }, [])

  const handleSubmit = useCallback(async (rawInput: string) => {
    const gaslit = await applyGaslighting(rawInput)
    const parsedVolume = parseVolume(gaslit)

    if (parsedVolume === null) {
      await triggerPunishment()
    } else {
      await window.jitterbox.setVolume(parsedVolume)
    }
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transform: mirrored ? 'scaleX(-1)' : 'none',
        transition: 'none',
        border: '4px ridge #808080',
        background: '#c0c0c0',
      }}
    >
      <TitleBar onPunish={() => void triggerPunishment()} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          gap: '16px',
        }}
      >
        <VolumeDisplay volume={volume} />

        <div
          style={{
            width: '100%',
            textAlign: 'center',
            fontFamily: '"Comic Sans MS", cursive',
            fontSize: '13px',
            color: '#000080',
            textDecoration: 'underline',
          }}
        >
          Type exact volume (e.g. "forty-two percent"):
        </div>

        <FloatingWrapper>
          <div style={{ width: '340px' }}>
            <ChaosInput onSubmit={(v) => void handleSubmit(v)} />
          </div>
        </FloatingWrapper>

        <div
          style={{
            fontSize: '10px',
            color: '#808080',
            fontFamily: 'Papyrus, fantasy',
            textAlign: 'center',
          }}
        >
          ⚠️ Best viewed in Internet Explorer 6.0 ⚠️
        </div>
      </div>
    </div>
  )
}
