import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import Button from './Button.jsx'
import { services, servicesSection } from '../data.js'

const canHover = () => window.matchMedia('(hover: hover)').matches

// Home preview: one row per service, the hovered/clicked one expands.
export default function Services() {
  const [active, setActive] = useState(0)
  return (
    <section className="services container" id="services">
      <div className="section-head split">
        <Reveal as="h2" className="h2">{servicesSection.heading}</Reveal>
        <Reveal as="p" className="muted">{servicesSection.subhead}</Reveal>
      </div>
      <div className="svc-list">
        {services.map((s, i) => (
          <div
            key={s.title}
            className={`svc ${active === i ? 'open' : ''}`}
            onMouseEnter={() => canHover() && setActive(i)}
            onClick={() => setActive(i)}
          >
            <span className="svc-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="svc-main">
              <span className="svc-cat">{s.category}</span>
              <h3>{s.title}</h3>
              <div className="svc-detail">
                <p>{s.oneLiner}</p>
                <div className="tags">{s.deliverables.slice(0, 4).map(t => <span key={t}>{t}</span>)}</div>
              </div>
            </div>
            <Button to="/contact" size="sm">Start your project</Button>
          </div>
        ))}
      </div>
      <Link to="/services" className="text-link">See all services →</Link>
    </section>
  )
}
