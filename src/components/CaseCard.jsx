import Text from './Text.jsx'

function CaseVisual({ kind }) {
  if (kind === 'reel') return (
    <div className="case-img ci-reel">
      <div className="reel"><span className="reel-play" /><i /><i /><b>0:30</b></div>
    </div>
  )
  if (kind === 'honey') return (
    <div className="case-img ci-honey">{[0, 1, 2, 3, 4].map(i => <span key={i} className="stick" style={{ '--i': i }} />)}</div>
  )
  if (kind === 'web') return (
    <div className="case-img ci-web">
      <div className="browser"><div className="browser-bar"><i /><i /><i /></div><div className="browser-body"><b /><span /><span /><em /></div></div>
    </div>
  )
  if (kind === 'bottles') return (
    <div className="case-img ci-bottles">
      {['Oil', 'Shampoo', 'Conditioner'].map((label, i) => (
        <span key={label} className="bottle" style={{ '--i': i }}><b>{label}</b></span>
      ))}
    </div>
  )
  return (
    <div className="case-img ci-3">
      <div className="chart">{[30, 45, 40, 62, 75, 92].map((v, i) => <i key={i} style={{ '--v': `${v}%` }} />)}</div>
    </div>
  )
}

// One case study: copy on the left (title, summary, client, services, result), visual on the right.
export default function CaseCard({ c, style, className = 'case' }) {
  return (
    <article className={className} style={style}>
      <div className="case-copy">
        <h3><Text>{c.title}</Text></h3>
        <p><Text>{c.summary}</Text></p>
        <dl>
          <dt>Client:</dt><dd><i />{c.client}</dd>
          <dt>Services:</dt><dd className="chips">{c.services.map(s => <span key={s}><Text>{s}</Text></span>)}</dd>
          <dt>Result:</dt><dd className="result"><Text>{c.result}</Text></dd>
        </dl>
      </div>
      <CaseVisual kind={c.visual} />
    </article>
  )
}
