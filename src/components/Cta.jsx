import { lazy, Suspense } from 'react'
import Reveal from './Reveal.jsx'
import Button from './Button.jsx'
import { finalCta } from '../data.js'

const RingScene = lazy(() => import('../three/RingScene.jsx'))

// Closing call to action with the 3D wreath. Defaults to the Home copy.
export default function Cta({ heading = finalCta.heading, body = finalCta.subhead, button = finalCta.button }) {
  return (
    <section className="cta" id="contact">
      <div className="cta-canvas"><Suspense fallback={null}><RingScene /></Suspense></div>
      <Reveal as="h2" className="h2">{heading}</Reveal>
      <Reveal as="p" className="muted">{body}</Reveal>
      <Button to={button.to} roll>{button.label}</Button>
    </section>
  )
}
