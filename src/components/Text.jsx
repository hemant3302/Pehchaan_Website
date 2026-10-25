import { HIGHLIGHT_PLACEHOLDERS } from '../config.js'

// Renders copy, outlining any [bracketed] placeholder that still needs real content.
export default function Text({ children }) {
  if (typeof children !== 'string' || !HIGHLIGHT_PLACEHOLDERS) return children
  const parts = children.split(/(\[[^\]]+\])/g)
  if (parts.length === 1) return children
  return parts.map((p, i) =>
    /^\[[^\]]+\]$/.test(p)
      ? <mark className="ph" key={i} title="Placeholder: replace before launch">{p}</mark>
      : p
  )
}
