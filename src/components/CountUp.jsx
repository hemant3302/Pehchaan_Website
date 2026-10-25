import { useEffect, useState } from 'react'
import useInView from '../hooks/useInView.js'

// Counts from 0 to `value` with an ease-out curve once visible.
export default function CountUp({ value, suffix = '', duration = 1600 }) {
  const [ref, inView] = useInView({ threshold: 0.5, once: true })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let frame
    const tick = now => {
      const p = Math.min((now - start) / duration, 1)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration])

  return <strong ref={ref}>{n}{suffix}</strong>
}
