import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import Text from '../components/Text.jsx'
import useSeo from '../hooks/useSeo.js'
import { contact, seo } from '../data.js'

// Placeholder until the Pehchaan-specific Privacy Policy and Terms are written (Phase 1, P1).
export default function LegalPage({ kind }) {
  useSeo(seo[kind])
  const title = kind === 'privacy' ? 'Privacy Policy' : 'Terms'
  return (
    <>
      <PageHeader eyebrow="Legal" heading={title} />
      <section className="container legal">
        <p><Text>[Pehchaan's {title} goes here. Write it for Pehchaan — don't reuse template legal text.]</Text></p>
        <p>Questions in the meantime? Email <Text>{contact.email}</Text> or <Link to="/contact" className="inline-link">get in touch</Link>.</p>
      </section>
    </>
  )
}
