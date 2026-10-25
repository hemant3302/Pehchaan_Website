import Reveal from './Reveal.jsx'
import { clients, clientsSection } from '../data.js'

const shown = clients.filter(c => c.confirmed)

export default function Clients() {
  if (!shown.length) return null
  // Repeat enough to fill wide screens, then double for the seamless -50% loop
  const base = Array.from({ length: Math.ceil(8 / shown.length) }, () => shown).flat()
  const row = [...base, ...base]
  return (
    <section className="clients">
      <div className="container clients-head">
        <Reveal as="h2" className="h2">{clientsSection.heading}</Reveal>
        <Reveal as="p" className="muted">{clientsSection.subhead}</Reveal>
      </div>
      <div className="logo-marquee">
        <div className="logo-track">
          {row.map((c, i) => (
            <div className="logo-card" key={i} aria-hidden={i >= shown.length}>
              <span className="lc-ico">{c.name[0]}</span>{c.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
