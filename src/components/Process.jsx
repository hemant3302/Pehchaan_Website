import { useEffect, useRef, useState } from 'react'
import useScrollProgress from '../hooks/useScrollProgress.js'
import { processSection, processSteps } from '../data.js'

// Our Process, shown as a live demo. The section is pinned while the visitor scrolls,
// and each step plays out on an example brand: research comes in (Discover), the
// positioning gets written (Define), the identity, pack, ad and site appear (Design &
// Build), and a campaign dashboard counts up (Measure & Scale). Each scene plays on its
// own once its step is reached, so nobody has to scroll slowly to see it.
// All brand details and numbers here are illustrative and labelled as such.

const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b)
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Counts from `from` to `to` while `on`, and resets when the scene is left
function Count({ on, from, to, decimals = 0, prefix = '', suffix = '', ms = 1500, delay = 300 }) {
  const [v, setV] = useState(from)
  useEffect(() => {
    if (!on) { setV(from); return }
    if (reduced) { setV(to); return }
    let raf, start
    const timer = setTimeout(() => {
      const tick = now => {
        start ??= now
        const t = clamp((now - start) / ms)
        setV(from + (to - from) * (1 - Math.pow(1 - t, 3)))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(timer); cancelAnimationFrame(raf) }
  }, [on, from, to, ms, delay])
  return <>{prefix}{v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>
}

// Types its text out while `on`
function Typed({ on, text, speed = 22, delay = 500 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) { setN(0); return }
    if (reduced) { setN(text.length); return }
    let i = 0, iv
    const timer = setTimeout(() => { iv = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(iv) }, speed) }, delay)
    return () => { clearTimeout(timer); clearInterval(iv) }
  }, [on, text, speed, delay])
  return <>{text.slice(0, n)}<span className={`caret ${n >= text.length ? 'done' : ''}`} /></>
}

const Pouch = ({ className = '' }) => (
  <div className={`pouch ${className}`}><span className="pouch-band"><b>your brand</b></span></div>
)

function Discover({ on }) {
  return (
    <div className={`pl ${on ? 'on' : ''}`}>
      {[['Competitor A', '₹499', 3], ['Competitor B', '₹349', 2], ['Competitor C', '₹599', 4]].map(([name, price, stars], i) => (
        <div key={name} className="it comp" style={{ '--d': i, top: `${6 + i * 30}%` }}>
          <span className="comp-pack" />
          <span className="comp-txt"><b>{name}</b><small>{price} · {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</small></span>
        </div>
      ))}
      <div className="it quote q1" style={{ '--d': 3 }}><i />“Tastes great. Looks cheap.”</div>
      <div className="it quote q2" style={{ '--d': 4 }}><i />“I can’t tell these brands apart.”</div>
      <div className="it trend" style={{ '--d': 5 }}>
        <small>Search interest</small><b>+62%</b>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none"><polyline points="0,34 18,30 34,31 50,22 66,20 82,10 100,4" /></svg>
      </div>
      <div className="it gap" style={{ '--d': 7 }}>
        <small>The gap</small>
        <b>Nobody looks premium at an everyday price.</b>
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="scribble"><path d="M8 34 C 30 4, 170 2, 192 28 C 200 50, 60 62, 14 46 C 2 40, 6 30, 20 24" /></svg>
      </div>
    </div>
  )
}

function Define({ on }) {
  return (
    <div className={`pl ${on ? 'on' : ''}`}>
      <div className="it posn" style={{ '--d': 0 }}>
        <small>Positioning</small>
        <p><Typed on={on} text="For first-time buyers who want quality without the guesswork, we're the brand that looks and feels premium at an everyday price." /></p>
      </div>
      <div className="it tone" style={{ '--d': 3 }}>
        <small>Tone of voice</small>
        <div>{['Bold', 'Warm', 'Honest'].map((t, i) => <span key={t} style={{ '--c': i }}>{t}</span>)}</div>
      </div>
      <div className="it palette" style={{ '--d': 4 }}>
        {[['#1f4d3a', 'Forest'], ['#9fd3b5', 'Mint'], ['#f6efe2', 'Oat'], ['#f2a93b', 'Marigold']].map(([c, n], i) => (
          <span key={c} style={{ '--sw': c, '--c': i }}><i />{n}</span>
        ))}
      </div>
      <div className="it name" style={{ '--d': 6 }}>
        <span className="mark" /><b>your brand</b><small>Name &amp; wordmark</small>
      </div>
    </div>
  )
}

function Build({ on }) {
  return (
    <div className={`pl ${on ? 'on' : ''}`}>
      <div className="it site" style={{ '--d': 0 }}>
        <div className="site-bar"><i /><i /><i /><span>yourbrand.com</span></div>
        <div className="site-body">
          <div className="site-copy">
            <b className="site-logo">your brand</b>
            <h5>Premium.<br />Not pricey.</h5>
            <span className="site-btn">Shop now</span>
          </div>
          <Pouch className="sm" />
        </div>
      </div>
      <div className="it phone" style={{ '--d': 2 }}>
        <div className="phone-screen">
          <span className="ig"><i />yourbrand · Sponsored</span>
          <Pouch />
          <b>Premium. Not pricey.</b>
          <span className="phone-cta">Shop now</span>
        </div>
      </div>
      <div className="it pack" style={{ '--d': 4 }}><Pouch /><small>Packaging</small></div>
      <div className="it logo-tile" style={{ '--d': 5 }}><span className="mark" /><b>your brand</b></div>
    </div>
  )
}

function Measure({ on }) {
  return (
    <div className={`pl ${on ? 'on' : ''}`}>
      <div className="it dash" style={{ '--d': 0 }}>
        <div className="dash-head"><b>Campaign performance</b><span>Last 30 days</span></div>
        <div className="kpis">
          <div className="kpi"><small>ROAS</small><b><Count on={on} from={1.2} to={3.4} decimals={1} suffix="x" /></b><em className="up">▲ from 1.2x</em></div>
          <div className="kpi"><small>Cost per customer</small><b><Count on={on} from={640} to={410} prefix="₹" /></b><em className="up">▼ 36%</em></div>
          <div className="kpi"><small>Conversion rate</small><b><Count on={on} from={1.1} to={2.8} decimals={1} suffix="%" /></b><em className="up">▲ 2.5×</em></div>
        </div>
        <div className="dash-body">
          <svg className="chart" viewBox="0 0 300 120" preserveAspectRatio="none">
            <defs><linearGradient id="pa-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2a93b" stopOpacity=".45" /><stop offset="1" stopColor="#f2a93b" stopOpacity="0" /></linearGradient></defs>
            <path className="area" d="M0 104 L30 100 L60 96 L90 98 L120 84 L150 78 L180 64 L210 58 L240 38 L270 30 L300 14 L300 120 L0 120 Z" />
            <polyline className="line" pathLength="1" points="0,104 30,100 60,96 90,98 120,84 150,78 180,64 210,58 240,38 270,30 300,14" />
          </svg>
          <div className="adsets">
            <small>Ad creatives</small>
            {[['Hook A', 34], ['Hook B', 52], ['Hook C', 92, true], ['Hook D', 28]].map(([n, w, win], i) => (
              <div key={n} className={`adset ${win ? 'win' : ''}`} style={{ '--w': `${w}%`, '--c': i }}>
                <span>{n}{win && <em>Winner</em>}</span><i />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="it toast" style={{ '--d': 9 }}>⚡ Budget moved to Hook C · <b>+40%</b></div>
    </div>
  )
}

const SCENES = [Discover, Define, Build, Measure]

function Line({ text, highlight }) {
  const at = highlight ? text.indexOf(highlight) : -1
  if (at < 0) return <p className="pa-copy">{text}</p>
  return <p className="pa-copy">{text.slice(0, at)}<strong>{highlight}</strong>{text.slice(at + highlight.length)}</p>
}

export default function Process() {
  const section = useRef(null)
  const n = processSteps.length

  // 0 → 1 across the pinned part of the section
  const p = useScrollProgress(() => {
    const s = section.current
    if (!s) return 0
    return clamp(-s.getBoundingClientRect().top / (s.offsetHeight - window.innerHeight))
  })
  const active = Math.min(Math.floor(p * n), n - 1)

  // Clicking a step scrolls to the point where that step begins
  const goTo = i => {
    const s = section.current
    const top = s.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (s.offsetHeight - window.innerHeight) * ((i + 0.15) / n), behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section className="process" id="process" ref={section} style={{ height: `${n * 60 + 100}vh` }}>
      <div className="pa-stage">
        <div className="container pa-head">
          <span className="pa-eyebrow">{processSection.heading}</span>
          <span className="pa-sub">{processSection.subhead}</span>
        </div>

        <div className="container pa-grid">
          <div className="pa-words">
            {processSteps.map((s, i) => (
              <div key={s.num} className={`pa-step ${i === active ? 'on' : i < active ? 'past' : ''}`} aria-hidden={i !== active}>
                <span className="pa-num">Step {s.num}</span>
                <h3 className="pa-title">{s.title}.</h3>
                <Line text={s.text} highlight={s.highlight} />
              </div>
            ))}
          </div>

          <div className="pa-demo" aria-hidden="true">
            <div className="pa-screen">
              {SCENES.map((Scene, i) => <Scene key={i} on={i === active} />)}
            </div>
            <span className="pa-note">Example brand · illustrative numbers</span>
          </div>
        </div>

        <div className="container pa-steps">
          {processSteps.map((s, i) => (
            <button key={s.num} type="button" className={i === active ? 'on' : i < active ? 'past' : ''} onClick={() => goTo(i)}>
              <i style={{ transform: `scaleX(${clamp(p * n - i)})` }} />
              <span>{s.num}</span> {s.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
