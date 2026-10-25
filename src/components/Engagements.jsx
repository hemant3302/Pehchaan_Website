import { Link } from 'react-router-dom'
import Button from './Button.jsx'
import Text from './Text.jsx'
import { engagementsPage, plans } from '../data.js'

// Plan cards with "Starting at" USD figures. Used on the Engagements page and, when enabled, on Home.
export default function Engagements() {
  return (
    <div className="engagements container">
      <div className="plans">
        {plans.map(p => (
          <div className={`plan ${p.popular ? 'dark' : ''}`} key={p.name}>
            {p.popular && <span className="popular">Popular</span>}
            <h3>{p.name}</h3>
            <p className="plan-sub">{p.tagline}</p>
            <div className="price">
              <small className="from">Starting at</small>
              <b><Text>{p.price}</Text></b>
              <small className="per">{p.per}</small>
            </div>
            <Button to="/contact" variant={p.popular ? 'accent' : 'outline'} block>{p.button}</Button>
            <div className="features">
              <h4>What's included:</h4>
              <ul>{p.features.map(f => <li key={f}><Text>{f}</Text></li>)}</ul>
            </div>
          </div>
        ))}
      </div>
      <p className="plans-note">{engagementsPage.note} <Link to={engagementsPage.noteLink.to}>{engagementsPage.noteLink.label}</Link></p>
    </div>
  )
}
