import { useEffect, useState } from 'react'

// Calls `compute` on scroll/resize and re-renders with its result, throttled to animation frames.
export default function useScrollProgress(compute, deps = []) {
  const [value, setValue] = useState(() => compute())

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setValue(compute()))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return value
}
