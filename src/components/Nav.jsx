import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Button from './Button.jsx'
import LogoLink from './LogoLink.jsx'
import useScrollProgress from '../hooks/useScrollProgress.js'
import { brand, navLinks, hero } from '../data.js'

// A nav label whose letters roll up one after another on hover, swapping for an
// identical copy underneath. Screen readers get the plain label.
function RollLabel({ text }) {
  return (
    <span className="nl" aria-hidden="true">
      {[...text].map((ch, i) => <i key={i} style={{ '--i': i }}>{ch === ' ' ? '\u00a0' : ch}</i>)}
    </span>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  // How far down the current page the visitor is, shown as a thin bar under the nav
  const read = useScrollProgress(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    return max > 0 ? Math.min(window.scrollY / max, 1) : 0
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // A soft pill that glides to whichever link is hovered or focused
  const links = useRef(null)
  const [pill, setPill] = useState({ x: 0, w: 0, on: false })
  const aim = e => {
    const a = e.currentTarget.getBoundingClientRect()
    const ul = links.current.getBoundingClientRect()
    setPill({ x: a.left - ul.left, w: a.width, on: true })
  }
  const rest = () => setPill(p => ({ ...p, on: false }))

  // Close the mobile menu after navigating
  useEffect(() => setOpen(false), [pathname])

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <LogoLink />
        <ul className="nav-links" ref={links} onMouseLeave={rest}>
          <li
            className={`nav-pill ${pill.on ? 'on' : ''}`}
            style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
            aria-hidden="true"
          />
          {navLinks.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} aria-label={l.label} onMouseEnter={aim} onFocus={aim} onBlur={rest}>
                <RollLabel text={l.label} />
              </NavLink>
            </li>
          ))}
        </ul>
        <Button to={hero.primary.to} roll className="nav-cta">Contact Us</Button>
        <button className={`burger ${open ? 'open' : ''}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <span /><span />
        </button>
      </div>
      <span className="nav-progress" style={{ transform: `scaleX(${read})` }} aria-hidden="true" />
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {navLinks.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
        <Link to="/contact" className="btn btn-accent">Contact Us</Link>
      </div>
    </nav>
  )
}
