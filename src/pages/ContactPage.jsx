import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Text from '../components/Text.jsx'
import { Arrow } from '../components/Button.jsx'
import useSeo from '../hooks/useSeo.js'
import { CONTACT_FORM_ENDPOINT } from '../config.js'
import { contact, contactPage, seo } from '../data.js'

const clean = s => s.replace(/[[\]]/g, '')

export default function ContactPage() {
  useSeo(seo.contact)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))

    // No form service configured yet: open the visitor's email app with everything filled in.
    if (!CONTACT_FORM_ENDPOINT) {
      const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n')
      window.location.href = `mailto:${clean(contact.email)}?subject=${encodeURIComponent(`New enquiry from ${data.Name}`)}&body=${encodeURIComponent(body)}`
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeader eyebrow="Contact" heading={contactPage.heading} intro={contactPage.intro} />
      <section className="container contact-grid">
        <Reveal className="contact-card">
          {status === 'sent' ? (
            <div className="form-success" role="status">
              <span className="success-dot" />
              <h2>{contactPage.success}</h2>
            </div>
          ) : (
            <form className="contact-form" onSubmit={onSubmit}>
              <label>Name<input name="Name" required autoComplete="name" /></label>
              <label>Email<input name="Email" type="email" required autoComplete="email" /></label>
              <label>Brand / company<input name="Brand" /></label>
              <label>Website or Instagram<input name="Website or Instagram" placeholder="pehchaan.xyz or @handle" /></label>
              <fieldset className="wide">
                <legend>What do you need?</legend>
                <div className="choice-row">
                  {contactPage.needs.map(n => (
                    <label className="choice" key={n}>
                      <input type="checkbox" name={`Need: ${n}`} value="yes" /><span>{n}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label>Budget range
                <select name="Budget" defaultValue="">
                  <option value="" disabled>Select a range</option>
                  {contactPage.budgets.map(b => <option key={b} value={clean(b)}>{clean(b)}</option>)}
                </select>
              </label>
              <label className="wide">Tell us more<textarea name="Message" rows="5" placeholder="Where is your brand today, and where do you want it to be?" /></label>
              <div className="wide form-foot">
                <button className="btn btn-accent" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : <>{contactPage.submit} <Arrow /></>}
                </button>
                {status === 'error' && <span className="form-error">Something went wrong. Email us directly at {clean(contact.email)}.</span>}
              </div>
            </form>
          )}
        </Reveal>
        <Reveal as="aside" className="contact-details">
          <div><h3 className="label">Email</h3><a href={`mailto:${clean(contact.email)}`}><Text>{contact.email}</Text></a></div>
          <div><h3 className="label">Phone</h3><p><Text>{contact.phone}</Text></p></div>
          <div><h3 className="label">Studio</h3><p>{contact.location}</p></div>
          <div><h3 className="label">Hours</h3><p>{contact.hours}</p></div>
        </Reveal>
      </section>
    </>
  )
}
