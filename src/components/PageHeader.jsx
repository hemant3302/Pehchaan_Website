import Reveal from './Reveal.jsx'
import Text from './Text.jsx'

// Top block for inner pages: small label, big heading, intro paragraph.
export default function PageHeader({ eyebrow, heading, intro, children }) {
  return (
    <header className="page-header container">
      {eyebrow && <Reveal as="span" className="eyebrow">{eyebrow}</Reveal>}
      <Reveal as="h1" className="page-title"><Text>{heading}</Text></Reveal>
      {intro && <Reveal as="p" className="page-intro"><Text>{intro}</Text></Reveal>}
      {children}
    </header>
  )
}
