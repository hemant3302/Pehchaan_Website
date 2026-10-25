import { tickerItems } from '../data.js'

export default function Ticker() {
  // Rendered twice so the -50% translate loops seamlessly
  const items = [...tickerItems, ...tickerItems]
  return (
    <section className="ticker">
      <div className="ticker-track">
        {items.map((t, i) => <div className="ticker-item" key={i} aria-hidden={i >= tickerItems.length}><i>/</i>{t}</div>)}
      </div>
    </section>
  )
}
