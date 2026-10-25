import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Cta from '../components/Cta.jsx'
import useSeo from '../hooks/useSeo.js'
import { services, servicesPage, seo } from '../data.js'

export default function ServicesPage() {
  useSeo(seo.services)
  const { cta } = servicesPage
  return (
    <>
      <PageHeader eyebrow="Services" heading={servicesPage.heading} intro={servicesPage.intro} />
      <section className="container svc-pages">
        {services.map((s, i) => (
          <Reveal as="article" className="svc-page" key={s.title} id={s.category.toLowerCase()}>
            <div className="svc-page-head">
              <span className="svc-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="pill">{s.tag}</span>
            </div>
            <h2>{s.title}</h2>
            <p className="svc-page-desc">{s.description}</p>
            <div>
              <h3 className="label">Deliverables</h3>
              <ul className="deliverables">{s.deliverables.map(d => <li key={d}>{d}</li>)}</ul>
            </div>
          </Reveal>
        ))}
      </section>
      <Cta heading={cta.heading} body={cta.body} button={cta.button} />
    </>
  )
}
