import { lazy, Suspense, useEffect, useState } from 'react'
import Reveal from './Reveal.jsx'
import CountUp from './CountUp.jsx'
import Button from './Button.jsx'
import Text from './Text.jsx'
import { Link } from 'react-router-dom'
import { Arrow } from './Button.jsx'
import { brand, hero, stats } from '../data.js'

const HeroScene = lazy(() => import('../three/HeroScene.jsx'))

const WORD = brand.toUpperCase()
const GRADIENT = 'linear-gradient(90deg,#3d0a05 0%,#c4381a 9%,#ff7a2e 22%,#e8501f 34%,#5e0e06 46%,#ff7a2e 58%,#ff8a3a 70%,#9b1c0b 84%,#3d0a05 100%)'

export default function Hero() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <header className="hero">
      <div className="container">
        <Reveal className="hero-top"><span className="eyebrow">{hero.eyebrow}</span><span className="eyebrow">©2026</span></Reveal>
        {/* Letters are inline-block, so each carries its own slice of the gradient */}
        <div className={`hero-word ${shown ? 'in' : ''}`} aria-hidden="true">
          {[...WORD].map((ch, i) => (
            <span
              key={i}
              className="ch"
              style={{
                transitionDelay: `${i * 60}ms`,
                backgroundImage: GRADIENT,
                backgroundSize: `${WORD.length * 100}% 100%`,
                backgroundPosition: `${(i / (WORD.length - 1)) * 100}% 0`,
              }}
            >{ch}</span>
          ))}
        </div>
        <div className="hero-intro">
          <Reveal as="h1" className="hero-headline">{hero.headline}</Reveal>
          <Reveal className="hero-side">
            <p>{hero.subhead}</p>
            <div className="hero-buttons">
              <Button to={hero.primary.to} roll>{hero.primary.label}</Button>
              <Button to={hero.secondary.to} variant="outline">{hero.secondary.label}</Button>
            </div>
          </Reveal>
        </div>
      </div>
      {/* Bento grid: the 3D piece in a large tile, each stat in its own tile, and a way in */}
      <div className="container bento">
        <div className="bento-tile bento-hero">
          <div className="hero-visual-bg" />
          <div className="hero-canvas">
            <Suspense fallback={null}><HeroScene /></Suspense>
          </div>
          <div className="grain" />
          <div className="bento-caption">
            <span>One picture.</span>
            <span>A brand that grows from it.</span>
          </div>
          <p className="bento-hint"><span className="bento-hint-dot" aria-hidden="true" />Drag to turn · Tap to send a pulse</p>
        </div>
        {stats.map((s, i) => (
          <div className={`bento-tile bento-stat ${i === 1 ? 'dark' : ''}`} key={s.label}>
            {s.count != null ? <CountUp value={s.count} suffix={s.suffix} /> : <strong><Text>{s.display}</Text></strong>}
            <span>{s.label}</span>
          </div>
        ))}
        <Link to={hero.primary.to} className="bento-tile bento-cta">
          <span className="bento-cta-label">Let's build yours</span>
          <span className="bento-cta-arrow"><Arrow /></span>
        </Link>
      </div>
    </header>
  )
}
