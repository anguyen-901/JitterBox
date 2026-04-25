import { useMotionValue, motion, useAnimationFrame } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function FloatingWrapper({ children }: Props) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const startTimeRef = useRef<number | null>(null)

  useAnimationFrame((t) => {
    if (startTimeRef.current === null) startTimeRef.current = t
    const elapsed = (t - startTimeRef.current) / 1000
    // Amplitude grows from 40px to max 80px over time (gets worse)
    const amplitude = Math.min(40 + (elapsed / 30) * 4, 80)
    x.set(Math.sin(elapsed) * amplitude)
    y.set(Math.cos(elapsed * 0.7) * amplitude * 0.6)
  })

  return (
    <motion.div style={{ x, y, display: 'inline-block' }}>
      {children}
    </motion.div>
  )
}
