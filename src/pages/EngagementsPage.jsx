import PageHeader from '../components/PageHeader.jsx'
import Engagements from '../components/Engagements.jsx'
import Faq from '../components/Faq.jsx'
import useSeo from '../hooks/useSeo.js'
import { engagementsPage, seo } from '../data.js'

export default function EngagementsPage() {
  useSeo(seo.engagements)
  return (
    <>
      <PageHeader eyebrow="Engagements" heading={engagementsPage.heading} intro={engagementsPage.intro} />
      <section className="pricing page-pricing"><Engagements /></section>
      <Faq heading="Questions, answered" />
    </>
  )
}
