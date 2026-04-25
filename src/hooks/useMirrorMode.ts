import { useEffect, useRef, useState } from 'react'

export function useMirrorMode(): boolean {
  const [mirrored, setMirrored] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function scheduleActivation(): void {
      const delay = 8_000 + Math.random() * 12_000 // 8–20s
      timeoutRef.current = setTimeout(() => {
        setMirrored(true)
        const duration = 3_000 + Math.random() * 4_000 // 3–7s
        timeoutRef.current = setTimeout(() => {
          setMirrored(false)
          scheduleActivation()
        }, duration)
      }, delay)
    }

    scheduleActivation()

    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    }
  }, [])

  return mirrored
}
