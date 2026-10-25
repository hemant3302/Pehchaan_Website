import PageHeader from '../components/PageHeader.jsx'
import Faq from '../components/Faq.jsx'
import Cta from '../components/Cta.jsx'
import useSeo from '../hooks/useSeo.js'
import { faqPage, finalCta, seo } from '../data.js'

export default function FaqPage() {
  useSeo(seo.faq)
  return (
    <>
      <PageHeader eyebrow="FAQ" heading={faqPage.heading} intro={faqPage.subhead} />
      <Faq />
      <Cta heading="Still have a question?" body="Ask us on a free 30-minute call." button={finalCta.button} />
    </>
  )
}
