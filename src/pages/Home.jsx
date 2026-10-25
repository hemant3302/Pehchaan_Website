import Hero from '../components/Hero.jsx'
import Ticker from '../components/Ticker.jsx'
import About from '../components/About.jsx'
import Clients from '../components/Clients.jsx'
import Process from '../components/Process.jsx'
import Values from '../components/Values.jsx'
import Services from '../components/Services.jsx'
import Work from '../components/Work.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Engagements from '../components/Engagements.jsx'
import Reveal from '../components/Reveal.jsx'
import Faq from '../components/Faq.jsx'
import Cta from '../components/Cta.jsx'
import useSeo from '../hooks/useSeo.js'
import { SHOW_ENGAGEMENTS, SHOW_TESTIMONIALS } from '../config.js'
import { engagementsPage, faqPreview, seo } from '../data.js'

export default function Home() {
  useSeo(seo.home)
  return (
    <>
      <Hero />
      <Ticker />
      <About />
      <Clients />
      <Process />
      <Values />
      <Services />
      <Work />
      {SHOW_TESTIMONIALS && <Testimonials />}
      {SHOW_ENGAGEMENTS && (
        <section className="pricing" id="pricing">
          <div className="section-head center container">
            <Reveal as="h2" className="h2">{engagementsPage.heading}</Reveal>
            <Reveal as="p" className="muted">{engagementsPage.intro}</Reveal>
          </div>
          <Engagements />
        </section>
      )}
      <Faq heading={faqPreview.heading} subhead={faqPreview.subhead} preview />
      <Cta />
    </>
  )
}
