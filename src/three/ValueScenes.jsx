import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'
import SceneCanvas, { StudioLights } from './SceneCanvas.jsx'
import { bindHover, easeInOut, easeOut, viewProgress } from './motion.js'

// Shared per-scene state: how far the row has scrolled in (0-1, smoothed) and hover.
function useSceneState() {
  const gl = useThree(s => s.gl)
  const hover = useRef(false)
  const progress = useRef(0)
  useEffect(() => bindHover(gl.domElement, '.value-row', hover), [gl])
  useFrame((_, dt) => {
    progress.current = THREE.MathUtils.damp(progress.current, viewProgress(gl.domElement), 5, dt)
  })
  return { hover, progress }
}

// Systems thinking: three loose rings drift in from apart and lock into a chain as
// the row scrolls into view. Hovering pulls the chain taut and spins it faster.
const RINGS = [
  { from: [-2.1, 0.8, -0.6], fromRot: [1.2, 0.6, 0.3], to: [-0.75, 0, 0], toRot: [0, 0, 0], color: '#ff4c39', metal: 0.1 },
  { from: [0.2, -1.3, 0.8], fromRot: [0.3, 1.4, 1.1], to: [0, 0, 0], toRot: [Math.PI / 2, 0, 0], color: '#141414', metal: 0.6 },
  { from: [2.1, 0.9, -0.3], fromRot: [-0.8, -0.5, 1.6], to: [0.75, 0, 0], toRot: [0, 0, 0], color: '#f3efe8', metal: 0.05 },
]

function LinkedRings() {
  const { hover, progress } = useSceneState()
  const group = useRef()
  const rings = useRef([])
  const spin = useRef(0.3)
  const tmp = useMemo(() => new THREE.Euler(), [])

  useFrame((state, dt) => {
    const k = easeInOut(progress.current)
    spin.current = THREE.MathUtils.damp(spin.current, hover.current ? 1.4 : 0.3, 3, dt)
    group.current.rotation.y += dt * spin.current * k
    const t = state.clock.elapsedTime
    rings.current.forEach((m, i) => {
      if (!m) return
      const r = RINGS[i]
      const wobble = (1 - k) * 0.25
      m.position.set(
        THREE.MathUtils.lerp(r.from[0], r.to[0], k) + Math.sin(t + i) * wobble,
        THREE.MathUtils.lerp(r.from[1], r.to[1], k) + Math.cos(t * 1.2 + i) * wobble,
        THREE.MathUtils.lerp(r.from[2], r.to[2], k),
      )
      tmp.set(
        THREE.MathUtils.lerp(r.fromRot[0] + t * 0.3 * (1 - k), r.toRot[0], k),
        THREE.MathUtils.lerp(r.fromRot[1], r.toRot[1], k),
        THREE.MathUtils.lerp(r.fromRot[2], r.toRot[2], k),
      )
      m.rotation.copy(tmp)
    })
  })

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={group} rotation={[0.35, 0, 0.15]}>
        {RINGS.map((r, i) => (
          <mesh key={i} ref={el => (rings.current[i] = el)} position={r.from}>
            <torusGeometry args={[0.62, 0.16, 48, 128]} />
            <meshPhysicalMaterial color={r.color} metalness={r.metal} roughness={0.15} clearcoat={1} clearcoatRoughness={0.08} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// Clarity: a haze of noise drifts around the core, and the moons wander off their paths.
// As the row scrolls in, the haze is drawn into the core, the moons settle onto clean
// orbits and the core brightens. Hovering speeds the orbits up.
const DUST = 700

function GlowOrbit() {
  const { hover, progress } = useSceneState()
  const orbits = useRef([])
  const moons = useRef([])
  const lines = useRef([])
  const dust = useRef()
  const dustMat = useRef()
  const core = useRef()
  const speed = useRef(1)

  const paths = [
    { tilt: [0.4, 0, 0.2], r: 1.25, size: 0.12, color: '#ff4c39' },
    { tilt: [-0.6, 0, -0.4], r: 1.6, size: 0.09, color: '#ffffff' },
    { tilt: [1.1, 0, 0.6], r: 1.95, size: 0.15, color: '#ffb37a' },
  ]

  const dustPositions = useMemo(() => {
    const a = new Float32Array(DUST * 3)
    for (let i = 0; i < DUST; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(1.1 + Math.random() * 2.2)
      a.set([v.x, v.y * 0.7, v.z], i * 3)
    }
    return a
  }, [])

  useFrame((state, dt) => {
    const k = easeOut(progress.current)
    const t = state.clock.elapsedTime
    speed.current = THREE.MathUtils.damp(speed.current, hover.current ? 3.2 : 1, 3, dt)

    orbits.current.forEach((o, i) => { if (o) o.rotation.y += dt * (0.5 + i * 0.25) * speed.current })
    moons.current.forEach((m, i) => {
      if (!m) return
      const off = 1 - k
      m.position.set(
        paths[i].r + Math.sin(t * 1.7 + i * 2) * 0.6 * off,
        Math.cos(t * 1.3 + i) * 0.7 * off,
        Math.sin(t * 0.9 + i * 3) * 0.6 * off,
      )
    })
    lines.current.forEach(l => { if (l) l.opacity = 0.05 + 0.35 * k })

    dust.current.rotation.y += dt * 0.15
    dust.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.2, k))
    dustMat.current.opacity = 0.75 * (1 - k)

    core.current.emissiveIntensity = THREE.MathUtils.lerp(0.5, 2.2, k) + (hover.current ? 0.6 : 0)
  })

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.65, 64, 64]} />
        <meshStandardMaterial ref={core} color="#fff1d6" emissive="#ffb35c" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      <mesh scale={1.35}>
        <sphereGeometry args={[0.65, 48, 48]} />
        <meshBasicMaterial color="#ff9a4c" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <pointLight intensity={8} color="#ffb35c" distance={6} />
      <points ref={dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial ref={dustMat} size={0.035} color="#ffc7a0" transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      {paths.map((p, i) => (
        <group key={i} rotation={p.tilt}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[p.r, 0.006, 8, 160]} />
            <meshBasicMaterial ref={el => (lines.current[i] = el)} color="#ffffff" transparent opacity={0.05} />
          </mesh>
          <group ref={el => (orbits.current[i] = el)}>
            <mesh ref={el => (moons.current[i] = el)} position={[p.r, 0, 0]}>
              <sphereGeometry args={[p.size, 32, 32]} />
              <meshPhysicalMaterial color={p.color} roughness={0.1} clearcoat={1} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}

// Honesty: the two halves of a clear crystal close together as the row scrolls in.
// Hovering (or tapping) opens it, so the red core inside is in plain view.
function Crystal() {
  const { hover, progress } = useSceneState()
  const shell = useRef()
  const top = useRef()
  const bottom = useRef()
  const core = useRef()
  const coreMat = useRef()
  const open = useRef(1)

  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff', transmission: 1, thickness: 0.6, roughness: 0.04, ior: 1.45,
    clearcoat: 1, transparent: true, opacity: 0.9, flatShading: true,
  }), [])

  useFrame((state, dt) => {
    const closed = easeInOut(progress.current)
    open.current = THREE.MathUtils.damp(open.current, hover.current ? 1 : 1 - closed, 4, dt)
    const o = open.current
    shell.current.rotation.y += dt * (0.35 + o * 0.4)
    shell.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2
    top.current.position.y = 0.5 + o * 0.75
    top.current.rotation.y = o * 0.6
    bottom.current.position.y = -0.5 - o * 0.75
    bottom.current.rotation.y = -o * 0.6
    core.current.rotation.y -= dt * (0.6 + o * 1.5)
    core.current.scale.setScalar(0.38 + o * 0.12)
    coreMat.current.emissiveIntensity = o * 0.8
  })

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={shell} scale={1.15}>
        <mesh ref={top} material={glass}>
          <coneGeometry args={[1, 1, 4, 1]} />
        </mesh>
        <mesh ref={bottom} material={glass} rotation-x={Math.PI}>
          <coneGeometry args={[1, 1, 4, 1]} />
        </mesh>
      </group>
      <mesh ref={core} scale={0.38}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial ref={coreMat} color="#ff4c39" emissive="#ff2a10" emissiveIntensity={0} roughness={0.12} clearcoat={1} flatShading />
      </mesh>
    </Float>
  )
}

export default function ValueScene({ kind }) {
  return (
    <SceneCanvas camera={{ position: [0, 0.3, 5.2], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 3]} intensity={1.4} />
      <StudioLights />
      {kind === 'rings' && <LinkedRings />}
      {kind === 'crystal' && <Crystal />}
      {kind === 'orbit' && <GlowOrbit />}
      {kind !== 'orbit' && <ContactShadows position={[0, -1.25, 0]} opacity={0.35} blur={2.5} scale={6} far={3} />}
    </SceneCanvas>
  )
}
