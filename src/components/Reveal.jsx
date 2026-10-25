import useInView from '../hooks/useInView.js'

// Fades, lifts and un-blurs its content the first time it scrolls into view.
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, inView] = useInView({ once: true })
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
