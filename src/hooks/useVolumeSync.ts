import { useEffect, useState } from 'react'

export function useVolumeSync() {
  const [volume, setVolume] = useState<number>(50)

  useEffect(() => {
    window.jitterbox.getVolume().then(setVolume).catch(() => { /* audio device unavailable */ })
    const unsubscribe = window.jitterbox.onVolumeChange(setVolume)
    return unsubscribe
  }, [])

  return { volume }
}
