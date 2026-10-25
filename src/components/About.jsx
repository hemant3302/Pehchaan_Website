import { useRef } from 'react'
import useScrollProgress from '../hooks/useScrollProgress.js'
import { badges, manifesto } from '../data.js'

const words = manifesto.split(' ')

// Badges + manifesto. Words light up one by one as the paragraph scrolls through view.
export default function About() {
  const ref = useRef(null)
  const lit = useScrollProgress(() => {
    const el = ref.current
    if (!el) return 0
    const r = el.getBoundingClientRect(), vh = window.innerHeight
    const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1)
    return Math.floor(p * words.length)
  })

  return (
    <section className="about container" id="about">
      <ul className="about-meta">{badges.map(m => <li key={m}>{m}</li>)}</ul>
      <p className="about-text" ref={ref}>
        {words.map((w, i) => <span key={i} className={`w ${i < lit ? 'on' : ''}`}>{w} </span>)}
      </p>
    </section>
  )
}
