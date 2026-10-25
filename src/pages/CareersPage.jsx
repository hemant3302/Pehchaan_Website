import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Text from '../components/Text.jsx'
import Button from '../components/Button.jsx'
import useSeo from '../hooks/useSeo.js'
import { HIRING } from '../config.js'
import { careersPage, contact, seo } from '../data.js'

const mailto = addr => `mailto:${addr.replace(/[[\]]/g, '')}`

export default function CareersPage() {
  useSeo(seo.careers)

  // Not hiring: a short note for anyone arriving from an old link
  if (!HIRING) {
    const { closed } = careersPage
    return (
      <>
        <PageHeader eyebrow="Careers" heading={closed.heading} intro={closed.intro}>
          <div className="careers-closed">
            <Button to={closed.button.to}>{closed.button.label}</Button>
          </div>
        </PageHeader>
      </>
    )
  }

  return (
    <>
      <PageHeader eyebrow="Careers" heading={careersPage.heading} intro={careersPage.intro} />
      <section className="container careers">
        <Reveal className="careers-block">
          <h2 className="label">What you get</h2>
          <ul className="perk-list">{careersPage.perks.map(p => <li key={p}>{p}</li>)}</ul>
        </Reveal>
        <Reveal className="careers-block">
          <h2 className="label">How hiring works</h2>
          <p className="careers-text">{careersPage.hiring}</p>
        </Reveal>
        <Reveal className="careers-block wide">
          <h2 className="label">Open roles</h2>
          <ul className="roles">
            {careersPage.roles.map(r => (
              <li key={r}>
                <span><Text>{r}</Text></span>
                <a href={`${mailto(contact.careersEmail)}?subject=${encodeURIComponent(`Application: ${r}`)}`} className="btn btn-outline sm">Apply</a>
              </li>
            ))}
          </ul>
          <p className="careers-text">
            {careersPage.fallback} <a href={mailto(contact.careersEmail)} className="inline-link"><Text>{contact.careersEmail}</Text></a> {careersPage.fallbackEnd}
          </p>
        </Reveal>
      </section>
    </>
  )
}
