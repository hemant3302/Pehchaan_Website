import { lazy, Suspense } from 'react'
import Reveal from './Reveal.jsx'
import { values, valuesSection } from '../data.js'

const ValueScene = lazy(() => import('../three/ValueScenes.jsx'))

const icons = {
  orbit: <svg className="v-ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></svg>,
  rings: <svg className="v-ico" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  crystal: <svg className="v-ico" viewBox="0 0 24 24"><path d="M6 3h12l3 6-9 12L3 9l3-6Z" /><path d="M3 9h18M9 3l3 18M15 3l-3 18" /></svg>,
}

export default function Values({ heading = valuesSection.heading, subhead = valuesSection.subhead }) {
  return (
    <section className="values container">
      <div className="section-head split">
        <Reveal as="h2" className="h2">{heading}</Reveal>
        <Reveal as="p" className="muted">{subhead}</Reveal>
      </div>
      {values.map((v, i) => (
        <Reveal className={`value-row ${i % 2 ? 'reverse' : ''}`} key={v.title}>
          <div className={`value-img vi-${v.scene}`}>
            <Suspense fallback={null}><ValueScene kind={v.scene} /></Suspense>
          </div>
          <div className="value-copy">
            {icons[v.scene]}
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </div>
        </Reveal>
      ))}
    </section>
  )
}
