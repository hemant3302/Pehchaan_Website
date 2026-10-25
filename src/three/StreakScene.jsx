import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import SceneCanvas from './SceneCanvas.jsx'

const COUNT = 9000
const BLUE = new THREE.Color('#6f8cff')
const ORANGE = new THREE.Color('#ff8a4c')
const WHITE = new THREE.Color('#ffffff')

// Soft round sprite drawn once on a canvas, so no image file is needed.
function makeSprite() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.3, 'rgba(255,255,255,.5)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

// A twisting ribbon of light particles, blue on one edge and ember-orange on the
// other, that slowly coils behind the testimonial cards.
function Ribbon() {
  const points = useRef()

  const { positions, colors, sprite } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const c = new THREE.Color()
    for (let i = 0; i < COUNT; i++) {
      const t = Math.random()                    // position along the ribbon
      const s = (Math.random() - 0.5) * 2        // across the ribbon width
      const angle = t * Math.PI * 3.2
      const radius = 1.6 + Math.sin(t * Math.PI) * 1.4
      const twist = angle * 0.6
      const jitter = () => (Math.random() - 0.5) * 0.18 * (1 + Math.abs(s))
      positions[i * 3] = Math.cos(angle) * radius + Math.cos(twist) * s * 0.7 + jitter()
      positions[i * 3 + 1] = (t - 0.5) * 7 + Math.sin(twist) * s * 0.7 + jitter()
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.6 + jitter()
      c.copy(s < 0 ? BLUE : ORANGE).lerp(WHITE, Math.max(0, 0.6 - Math.abs(s)) * 0.8)
      colors.set([c.r, c.g, c.b], i * 3)
    }
    return { positions, colors, sprite: makeSprite() }
  }, [])

  useFrame((state, dt) => {
    points.current.rotation.y += dt * 0.12
    points.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.25 - 0.35
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        map={sprite}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

export default function StreakScene() {
  return (
    <SceneCanvas camera={{ position: [0, 0, 7], fov: 45 }}>
      <Ribbon />
    </SceneCanvas>
  )
}
