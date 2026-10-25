import { lazy, Suspense } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Values from '../components/Values.jsx'
import Cta from '../components/Cta.jsx'
import Text from '../components/Text.jsx'
import useSeo from '../hooks/useSeo.js'
import { aboutPage, seo } from '../data.js'

const StreakScene = lazy(() => import('../three/StreakScene.jsx'))

export default function AboutPage() {
  useSeo(seo.about)
  return (
    <>
      <PageHeader eyebrow="About" heading={aboutPage.heading} intro={aboutPage.intro} />

      <section className="container story">
        <Reveal as="h2" className="h2">Our story</Reveal>
        <div>{aboutPage.story.map((p, i) => <Reveal as="p" key={i}>{p}</Reveal>)}</div>
      </section>

      <section className="different">
        <div className="t-canvas"><Suspense fallback={null}><StreakScene /></Suspense></div>
        <div className="container different-inner">
          <Reveal as="h2" className="h2 light">What makes us different</Reveal>
          <div className="diff-grid">
            {aboutPage.different.map((d, i) => (
              <Reveal className="diff-card" key={d.title}>
                <span className="diff-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container team">
        <Reveal as="h2" className="h2">Team</Reveal>
        <div className="team-grid">
          {aboutPage.team.map(t => (
            <Reveal className="team-card" key={t.name}>
              <div className="team-photo" aria-hidden="true">{t.name.split(' ').map(w => w[0]).join('')}</div>
              <h3><Text>{t.name}</Text></h3>
              <span className="team-role"><Text>{t.role}</Text></span>
              {t.bio && <p>{t.bio}</p>}
            </Reveal>
          ))}
        </div>
      </section>

      <Values heading="Our values" subhead="Clarity, systems thinking and honesty, on every project." />
      <Cta />
    </>
  )
}
