import { Link } from 'react-router-dom'

export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

// Pill button. `to` makes an in-app link, `href` a normal link, neither a <button>.
// `roll` gives the label a vertical text-swap on hover.
export default function Button({ to, href, variant = 'accent', size, block, roll, className = '', children, ...rest }) {
  const cls = ['btn', `btn-${variant}`, size, block && 'block', className].filter(Boolean).join(' ')
  const label = roll
    ? <span className="btn-roll"><span>{children}</span><span>{children}</span></span>
    : children
  const content = <>{label}{variant === 'accent' && <Arrow />}</>
  if (to) return <Link to={to} className={cls} {...rest}>{content}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{content}</a>
  return <button className={cls} {...rest}>{content}</button>
}
