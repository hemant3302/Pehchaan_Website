import { useState } from 'react'
import { Link } from 'react-router-dom'
import FooterWord from './FooterWord.jsx'
import LogoLink from './LogoLink.jsx'
import { Arrow } from './Button.jsx'
import Text from './Text.jsx'
import { brand, contact, footer } from '../data.js'

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer className="footer">
      <div className="container footer-top">
        <div>
          <LogoLink className="light big" />
          <p className="f-desc">{footer.about}</p>
        </div>
        <div>
          <h4>{footer.newsletter}</h4>
          {/* Phase 3: connect this to an email tool (Mailchimp, ConvertKit, Beehiiv…) */}
          <form className="newsletter" onSubmit={e => { e.preventDefault(); setSubscribed(true) }}>
            <input type="email" placeholder="Enter your email" required aria-label="Email address" />
            <button className="btn btn-accent sm">{subscribed ? 'Subscribed ✓' : <>Subscribe <Arrow /></>}</button>
          </form>
        </div>
      </div>
      <div className="container footer-links">
        {footer.columns.map(col => (
          <div key={col.title}>
            <h5>{col.title}</h5>
            {col.links.map(([label, to]) => to.startsWith('/')
              ? <Link key={label} to={to}>{label}</Link>
              : <a key={label} href={to}>{label}</a>)}
          </div>
        ))}
        <div>
          <h5>Contact</h5>
          <p className="f-contact"><Text>{contact.email}</Text><small>We reply within 24 hours</small></p>
          <p className="f-contact"><Text>{contact.phone}</Text><small>{contact.hours}</small></p>
        </div>
      </div>
      <FooterWord />
      <div className="container footer-bottom"><span>{footer.copyright}</span><span><Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link></span></div>
    </footer>
  )
}
