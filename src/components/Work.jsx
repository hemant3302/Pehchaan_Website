import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import CaseCard from './CaseCard.jsx'
import { liveCases, workPreview } from '../data.js'

// Home preview: cards stack on top of each other as you scroll.
export default function Work() {
  return (
    <section className="work container" id="work">
      <div className="section-head center">
        <Reveal as="h2" className="h2">{workPreview.heading}</Reveal>
        <Reveal as="p" className="muted">{workPreview.subhead}</Reveal>
      </div>
      <div className="stack">
        {liveCases.map((c, i) => <CaseCard key={c.client} c={c} style={{ '--i': i }} />)}
      </div>
      <div className="center-link"><Link to="/work" className="text-link">See all work →</Link></div>
    </section>
  )
}
