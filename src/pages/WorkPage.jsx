import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import CaseCard from '../components/CaseCard.jsx'
import Cta from '../components/Cta.jsx'
import useSeo from '../hooks/useSeo.js'
import { liveCases, seo, workPage } from '../data.js'

export default function WorkPage() {
  useSeo(seo.work)
  return (
    <>
      <PageHeader eyebrow="Work" heading={workPage.heading} intro={workPage.intro} />
      <section className="container work-list">
        {liveCases.map(c => (
          <Reveal key={c.client}><CaseCard c={c} className="case flat" /></Reveal>
        ))}
      </section>
      <Cta />
    </>
  )
}
