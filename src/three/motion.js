import * as THREE from 'three'

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const clamp01 = v => THREE.MathUtils.clamp(v, 0, 1)
export const easeOut = t => 1 - Math.pow(1 - t, 3)
export const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// How far an element has travelled into view: 0 as its top enters the bottom of the
// viewport, 1 once its centre reaches the viewport centre. Reduced motion skips straight to 1.
export function viewProgress(el) {
  if (reducedMotion || !el) return 1
  const r = el.getBoundingClientRect()
  const vh = window.innerHeight
  return clamp01((vh - r.top) / (vh / 2 + r.height / 2))
}

// Whether the pointer is over the element that holds this canvas (closest `selector`).
// On touch screens, where there is no hover, a tap toggles it instead.
export function bindHover(canvas, selector, ref) {
  const el = canvas.closest(selector) || canvas
  const enter = e => { if (e.pointerType !== 'touch') ref.current = true }
  const leave = e => { if (e.pointerType !== 'touch') ref.current = false }
  const tap = e => { if (e.pointerType === 'touch') ref.current = !ref.current }
  el.addEventListener('pointerenter', enter)
  el.addEventListener('pointerleave', leave)
  el.addEventListener('pointerdown', tap)
  return () => {
    el.removeEventListener('pointerenter', enter)
    el.removeEventListener('pointerleave', leave)
    el.removeEventListener('pointerdown', tap)
  }
}
