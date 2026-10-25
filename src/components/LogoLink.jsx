import { Link } from 'react-router-dom'
import { brand } from '../data.js'

// The wordmark, which doubles as the home link. Each letter is its own span so a hover
// (or keyboard focus) can ripple through them one after another and turn the word red,
// making it clear the logo is clickable. Screen readers hear "Pehchaan, home".
export default function LogoLink({ className = '' }) {
  return (
    <Link to="/" className={`logo ${className}`} aria-label={`${brand}, home`}>
      {[...brand].map((ch, i) => (
        <span key={i} className="lc" style={{ '--i': i }} aria-hidden="true">{ch}</span>
      ))}
    </Link>
  )
}
