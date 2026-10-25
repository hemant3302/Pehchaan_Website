import { useEffect, useRef } from 'react'
import useInView from '../hooks/useInView.js'
import { brand } from '../data.js'

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The big footer wordmark. Each "a" gets an eye set into its bowl that follows the
// pointer around the page and blinks every few seconds.
export default function FooterWord() {
  const [wordRef, wordIn] = useInView({ once: true })
  const eyes = useRef([])

  useEffect(() => {
    let target = null // last pointer position, or null to look straight ahead
    let frame = 0

    const aim = () => {
      frame = 0
      eyes.current.forEach(eye => {
        if (!eye) return
        const r = eye.getBoundingClientRect()
        let x = 0, y = 0
        if (target) {
          const dx = target.x - (r.left + r.width / 2)
          const dy = target.y - (r.top + r.height / 2)
          const dist = Math.hypot(dx, dy) || 1
          // Full swing once the pointer is a few eye-widths away, gentler up close
          const reach = Math.min(dist / (r.width * 3), 1)
          x = (dx / dist) * reach
          y = (dy / dist) * reach
        }
        eye.style.setProperty('--lx', x.toFixed(3))
        eye.style.setProperty('--ly', y.toFixed(3))
      })
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(aim) }
    const onMove = e => { target = { x: e.clientX, y: e.clientY }; queue() }
    const onLeave = () => { target = null; queue() }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', queue, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    // Blink both eyes together at an irregular rhythm
    let blinkTimer
    const blink = () => {
      eyes.current.forEach(e => e?.classList.add('blink'))
      setTimeout(() => eyes.current.forEach(e => e?.classList.remove('blink')), 140)
      blinkTimer = setTimeout(blink, 2500 + Math.random() * 3500)
    }
    if (!reduced) blinkTimer = setTimeout(blink, 2500)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(blinkTimer)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', queue)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  let eyeIndex = 0
  return (
    <div className={`footer-word ${wordIn ? 'in' : ''}`} ref={wordRef} aria-label={brand} role="img">
      {[...brand].map((ch, i) => {
        if (ch !== 'a') return <span key={i} aria-hidden="true">{ch}</span>
        const n = eyeIndex++
        return (
          <span key={i} className="fw-a" aria-hidden="true">
            {ch}
            <span className="fw-eye" ref={el => (eyes.current[n] = el)}><i /></span>
          </span>
        )
      })}
    </div>
  )
}
