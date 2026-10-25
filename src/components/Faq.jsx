import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import Text from './Text.jsx'
import { faqs } from '../data.js'

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-q" aria-expanded={open} onClick={onToggle}>{q}<span className="faq-ico" /></button>
      {/* grid-rows 0fr -> 1fr animates to the content's natural height */}
      <div className="faq-a"><div><p><Text>{a}</Text></p></div></div>
    </div>
  )
}

// Full FAQ with tabs, or (preview) the first `limit` General questions and a link to the rest.
export default function Faq({ heading, subhead, preview = false, limit = 5 }) {
  const tabs = Object.keys(faqs)
  const [tab, setTab] = useState(tabs[0])
  const [open, setOpen] = useState(0)
  const items = preview ? faqs[tabs[0]].slice(0, limit) : faqs[tab]

  const pick = t => { setTab(t); setOpen(0) }

  return (
    <section className="faq container" id="faq">
      {heading && (
        <div className="section-head center">
          <Reveal as="h2" className="h2">{heading}</Reveal>
          {subhead && <Reveal as="p" className="muted">{subhead}</Reveal>}
        </div>
      )}
      {!preview && (
        <div className="faq-tabs">
          {tabs.map(t => <button key={t} className={t === tab ? 'active' : ''} onClick={() => pick(t)}>{t}</button>)}
        </div>
      )}
      <div className="faq-list" key={preview ? 'preview' : tab}>
        {items.map(([q, a], i) => (
          <FaqItem key={q} q={q} a={a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </div>
      {preview && <div className="center-link"><Link to="/faq" className="text-link">See all questions →</Link></div>}
    </section>
  )
}
