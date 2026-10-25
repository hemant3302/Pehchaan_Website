import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Reveal from './Reveal.jsx'
import Text from './Text.jsx'
import { testimonials, testimonialsSection } from '../data.js'

const StreakScene = lazy(() => import('../three/StreakScene.jsx'))

export default function Testimonials() {
  const [idx, setIdx] = useState(0)
  const go = useCallback(i => setIdx((i + testimonials.length) % testimonials.length), [])

  // Auto-advance; resets whenever the slide changes so manual clicks get a full interval
  useEffect(() => {
    const t = setTimeout(() => go(idx + 1), 6000)
    return () => clearTimeout(t)
  }, [idx, go])

  return (
    <section className="testimonials">
      <div className="t-canvas"><Suspense fallback={null}><StreakScene /></Suspense></div>
      <div className="container t-inner">
        <Reveal as="h2" className="h2 light t-title">{testimonialsSection.heading}</Reveal>
        <div className="t-slider">
          <div className="t-slides" style={{ transform: `translateX(${-idx * 100}%)` }}>
            {testimonials.map(t => (
              <blockquote className="t-card" key={t.role}>
                <p>“<Text>{t.quote}</Text>”</p>
                <footer><span className={`avatar ${t.tone}`} /><div><b><Text>{t.name}</Text></b><small><Text>{t.role}</Text></small></div></footer>
              </blockquote>
            ))}
          </div>
          <div className="t-controls">
            <button aria-label="Previous" onClick={() => go(idx - 1)}>←</button>
            <div className="t-dots">
              {testimonials.map((_, i) => <span key={i} className={i === idx ? 'on' : ''} onClick={() => go(i)} />)}
            </div>
            <button aria-label="Next" onClick={() => go(idx + 1)}>→</button>
          </div>
        </div>
      </div>
    </section>
  )
}
