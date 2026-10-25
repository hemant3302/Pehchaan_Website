import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import SceneCanvas from './SceneCanvas.jsx'
import { bindHover, clamp01, easeOut, reducedMotion, viewProgress } from './motion.js'

// The closing piece: a crystal lotus. Four rings of faceted ruby petals, deepest on
// the outside and brighter toward the centre, open from a closed bud as the call to
// action scrolls up, outer ring first. A glowing red crystal rises at the heart, ringed
// by fine gold-tipped stamens, and lights the petals from within. A soft aura drifts
// behind it and sparkles twinkle round it. Hovering opens the bloom a little further,
// turns it faster and sets the sparkles off.

const CREAM = '#F3EFE8'

function rng(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
}

// A double-terminated crystal with slightly irregular facets, built flat-shaded
function crystalGeometry(seed, { sides = 6, height = 2.6, radius = 0.62, jitter = 0.09 } = {}) {
  const rand = rng(seed)
  const lowY = -height * 0.32, highY = height * 0.26
  const ring = (y, wob) => Array.from({ length: sides }, (_, i) => {
    const a = (i / sides) * Math.PI * 2 + (rand() - 0.5) * 0.12
    const r = radius * (1 + (rand() - 0.5) * jitter * 2)
    return new THREE.Vector3(Math.cos(a) * r, y + (rand() - 0.5) * wob, Math.sin(a) * r)
  })
  const low = ring(lowY, 0.12)
  const high = ring(highY, 0.12)
  const top = new THREE.Vector3((rand() - 0.5) * 0.12, height * 0.62, (rand() - 0.5) * 0.12)
  const bottom = new THREE.Vector3((rand() - 0.5) * 0.1, -height * 0.55, (rand() - 0.5) * 0.1)
  const tris = []
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides
    tris.push(low[i], high[i], high[j], low[i], high[j], low[j]) // sides
    tris.push(high[i], top, high[j]) // upper point
    tris.push(low[j], bottom, low[i]) // lower point
  }
  const g = new THREE.BufferGeometry().setFromPoints(tris)
  g.computeVertexNormals() // non-indexed, so every facet is flat
  return g
}

// A soft, slowly drifting aura behind the crystal. It fades to the page's cream at the
// edges, so the canvas has no visible border, and gives the glass colour to refract.
function Aura({ glow, rays }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uGlow: { value: 0.75 },
      uRays: { value: 0 },
      uAspect: { value: 2 },
      uCream: { value: new THREE.Color(CREAM) },
      uA: { value: new THREE.Color('#d42a17') }, // brand deep red
      uB: { value: new THREE.Color('#ff9a78') }, // warm blush
      uC: { value: new THREE.Color('#ffc978') }, // warm gold
    },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `
      uniform float uTime, uGlow, uRays, uAspect; uniform vec3 uCream, uA, uB, uC; varying vec2 vUv;
      float blob(vec2 p, vec2 c, float r){ return exp(-dot(p-c,p-c)/(r*r)); }
      void main(){
        vec2 p = (vUv - .5) * vec2(uAspect, 1.);
        float t = uTime * .2;
        float a = blob(p, vec2(sin(t)*.26-.2, cos(t*1.3)*.07), .3);
        float b = blob(p, vec2(cos(t*.8)*.24+.22, sin(t*1.1)*.07+.03), .28);
        float c = blob(p, vec2(sin(t*1.2+2.)*.1, cos(t*.7)*.05), .2);
        vec3 col = (uA*a + uB*b + uC*c) / max(a+b+c, 1e-3);
        float r = length(p);
        float ang = atan(p.y, p.x);
        // A slow fan of fine rays behind the bloom, two layers turning opposite ways
        float rays = pow(.5 + .5 * cos(ang * 22. + uTime * .06), 7.) * .55
                   + pow(.5 + .5 * cos(ang * 13. - uTime * .04 + 1.3), 12.) * .45;
        rays *= smoothstep(.06, .2, r) * exp(-r * r / .3) * uRays;
        // A warm gold halo right behind the heart
        float halo = exp(-r * r / .03) * uRays;
        // Fade fully to cream well before the edges so the canvas has no border
        vec2 e = abs(vUv - .5) * 2.;
        float edge = (1. - smoothstep(.5, .92, e.x)) * (1. - smoothstep(.4, .9, e.y));
        float k = clamp((a + b + c) * uGlow * (.7 + .6 * rays) + rays * .35, 0., .78) * edge;
        vec3 outc = mix(uCream, col, k);
        outc = mix(outc, uC, clamp(halo * .55, 0., .55) * edge);
        gl_FragColor = vec4(outc, 1.);
        #include <colorspace_fragment>
      }`,
  }), [])
  // Sized to exactly fill the view at its depth, so the fade lands on the canvas edges
  const viewport = useThree(s => s.viewport)
  const camera = useThree(s => s.camera)
  const vp = viewport.getCurrentViewport(camera, [0, 0, -3])
  mat.uniforms.uAspect.value = vp.width / vp.height
  useFrame((s, dt) => {
    mat.uniforms.uTime.value = s.clock.elapsedTime
    mat.uniforms.uGlow.value = THREE.MathUtils.damp(mat.uniforms.uGlow.value, glow.current, 3, dt)
    mat.uniforms.uRays.value = THREE.MathUtils.damp(mat.uniforms.uRays.value, rays.current, 2, dt)
  })
  return (
    <mesh position={[0, 0, -3]} material={mat} scale={[vp.width, vp.height, 1]}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}

// Soft round glow, drawn once into a small texture
function glowTexture(inner, outer) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, inner)
  grad.addColorStop(0.35, outer)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Four-point sparkle, drawn once into a small texture
function sparkleTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const halo = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  halo.addColorStop(0, 'rgba(255,255,255,1)')
  halo.addColorStop(0.15, 'rgba(255,255,255,.55)')
  halo.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = halo
  g.beginPath()
  g.moveTo(64, 0); g.quadraticCurveTo(70, 58, 128, 64); g.quadraticCurveTo(70, 70, 64, 128)
  g.quadraticCurveTo(58, 70, 0, 64); g.quadraticCurveTo(58, 58, 64, 0)
  g.fill()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

const SPARKLES = [
  [-1.9, 1.1, 0.6, 0.42], [1.7, 1.5, -0.2, 0.3], [2.1, -0.6, 0.8, 0.36], [-1.6, -1.2, 0.3, 0.26],
  [0.9, 2.0, 0.5, 0.22], [-0.7, -1.9, 0.9, 0.3], [2.6, 0.7, -0.6, 0.2], [-2.6, 0.2, -0.4, 0.24],
]

// A faceted crystal petal: pointed, with a raised keel down the middle like a cut gem,
// and curved back along its length so the bloom opens like a lotus.
function petalGeometry(len, wid, curl = 0.18) {
  const t = wid * 0.32 // keel height
  const P = (x, y, z) => new THREE.Vector3(x, y, z - curl * (y / len) ** 2 * len)
  const base = P(0, 0, 0)
  const tip = P(0, len, 0)
  const L1 = P(-wid * 0.62, len * 0.22, t * 0.15), L2 = P(-wid, len * 0.5, 0), L3 = P(-wid * 0.55, len * 0.8, t * 0.1)
  const R1 = P(wid * 0.62, len * 0.22, t * 0.15), R2 = P(wid, len * 0.5, 0), R3 = P(wid * 0.55, len * 0.8, t * 0.1)
  const K1 = P(0, len * 0.3, t), K2 = P(0, len * 0.62, t * 0.8) // keel on the front
  const B1 = P(0, len * 0.35, -t * 0.55), B2 = P(0, len * 0.65, -t * 0.45) // softer keel behind
  const front = [base, L1, K1, base, K1, R1, L1, L2, K1, R1, K1, R2, L2, K2, K1, R2, K1, K2, L2, L3, K2, R2, K2, R3, L3, tip, K2, R3, K2, tip]
  const back = [base, B1, L1, base, R1, B1, L1, B1, L2, R1, R2, B1, L2, B1, B2, R2, B2, B1, L2, B2, L3, R2, R3, B2, L3, B2, tip, R3, tip, B2]
  const g = new THREE.BufferGeometry().setFromPoints([...front, ...back])
  g.computeVertexNormals() // non-indexed: every facet stays flat
  return g
}

// Rings of petals from the outside in: count, length, width, how far each tilts open
// (radians from upright), base radius, and a twist so each ring sits between the last
const LAYERS = [
  { n: 11, len: 2.05, wid: 0.5, open: 1.32, r: 0.34, rot: 0 },
  { n: 9, len: 1.75, wid: 0.46, open: 1.0, r: 0.28, rot: 0.17 },
  { n: 7, len: 1.4, wid: 0.42, open: 0.62, r: 0.2, rot: 0.42 },
  { n: 5, len: 1.0, wid: 0.36, open: 0.3, r: 0.12, rot: 0.9 },
]

// Fine stamens round the core, each tipped with a pale gold bead
const STAMENS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2
  const lean = 0.35 + (i % 3) * 0.12
  const h = 0.55 + (i % 4) * 0.07
  return { a, lean, h }
})

function Flower() {
  const bloomGroup = useRef()
  const tilt = useRef()
  const petals = useRef([])
  const core = useRef()
  const coreLight = useRef()
  const sparkles = useRef([])
  const hover = useRef(false)
  const glow = useRef(0.7)
  const spin = useRef(0.12)
  const extra = useRef(0)
  const burst = useRef(0)
  const wasHover = useRef(false)
  const progress = useRef(0)
  const gl = useThree(s => s.gl)

  useEffect(() => bindHover(gl.domElement, '.cta', hover), [gl])

  const sparkleMap = useMemo(sparkleTexture, [])
  const heartGlow = useMemo(() => glowTexture('rgba(255,214,150,1)', 'rgba(255,70,60,.55)'), [])
  const heart = useRef()
  const rays = useRef(0)
  const dust = useRef()
  // Gold dust drifting up through the scene
  const motes = useMemo(() => {
    const rand = rng(41)
    return Array.from({ length: 120 }, () => ({
      x: (rand() - 0.5) * 7.5, y: (rand() - 0.5) * 5.6, z: (rand() - 0.5) * 3,
      s: 0.012 + rand() * 0.028, speed: 0.12 + rand() * 0.3, phase: rand() * Math.PI * 2,
    }))
  }, [])
  const moteGeo = useMemo(() => new THREE.SphereGeometry(1, 8, 6), [])
  const moteMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffd38a', metalness: 1, roughness: 0.25, emissive: '#ffa040', emissiveIntensity: 0.45 }), [])
  const m4 = useMemo(() => new THREE.Matrix4(), [])
  const q0 = useMemo(() => new THREE.Quaternion(), [])
  const v0 = useMemo(() => new THREE.Vector3(), [])
  const sv = useMemo(() => new THREE.Vector3(), [])
  const coreGeo = useMemo(() => crystalGeometry(5, { height: 0.75, radius: 0.15, sides: 6, jitter: 0.06 }), [])

  const layers = useMemo(() => LAYERS.map(l => {
    const geo = petalGeometry(l.len, l.wid)
    return { ...l, geo, edges: new THREE.EdgesGeometry(geo, 1) }
  }), [])

  // Garnet-ruby glass in the brand's own red family (warm, not crimson): deepest on
  // the outer rings, brighter toward the centre, with a light sheen
  const glass = useMemo(() => [
    ['#b8200e', '#650b03', 0.45], ['#c92813', '#7a0f05', 0.6], ['#d93219', '#901607', 0.8], ['#e8442a', '#a61e0b', 1],
  ].map(([color, tint, inner]) => new THREE.MeshPhysicalMaterial({
    emissive: '#8a1406', emissiveIntensity: inner,
    color, transmission: 1, thickness: 0.6, roughness: 0.02, ior: 1.9, dispersion: 5,
    iridescence: 0.35, iridescenceIOR: 1.55, iridescenceThicknessRange: [160, 760],
    clearcoat: 1, specularIntensity: 1, envMapIntensity: 1.05, flatShading: true, side: THREE.DoubleSide,
    attenuationColor: new THREE.Color(tint), attenuationDistance: 1.6,
  })), [])
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({ color: '#ffdccc', transparent: true, opacity: 0.5, toneMapped: false }), [])
  const stamenMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffe2b8', metalness: 0.7, roughness: 0.25, emissive: '#ff9a6a', emissiveIntensity: 0.25 }), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    // Stays a closed bud until the section is well into view, then opens
    progress.current = THREE.MathUtils.damp(progress.current, clamp01((viewProgress(gl.domElement) - 0.2) / 0.72), 2.2, dt)
    const p = progress.current

    if (hover.current && !wasHover.current) burst.current = 1
    wasHover.current = hover.current
    burst.current = THREE.MathUtils.damp(burst.current, 0, 1.6, dt)
    extra.current = THREE.MathUtils.damp(extra.current, hover.current ? 1 : 0, 2.5, dt)
    spin.current = THREE.MathUtils.damp(spin.current, hover.current ? 0.45 : 0.12, 2.5, dt)
    glow.current = hover.current ? 1 : 0.7

    // The bloom opens ring by ring, outer petals first, from a closed bud.
    // A slow breath keeps it alive once open; hovering opens it a touch further.
    let i = 0
    layers.forEach((l, li) => {
      const k = easeOut(clamp01((p - li * 0.12) / 0.6))
      const breathe = reducedMotion ? 0 : Math.sin(t * 0.8 + li * 0.7) * 0.03
      const open = 0.06 + (l.open - 0.06) * k + breathe + extra.current * 0.1 * (1 - li * 0.2)
      for (let j = 0; j < l.n; j++, i++) {
        const m = petals.current[i]
        if (m) m.rotation.x = open
      }
    })

    // Core rises and glows as the bloom completes
    const c = easeOut(clamp01((p - 0.45) / 0.5))
    core.current.scale.setScalar(c)
    core.current.rotation.y -= dt * 0.6
    coreLight.current.intensity = c * (6 + Math.sin(t * 2) * 1.2 + burst.current * 8)

    bloomGroup.current.rotation.y += dt * spin.current
    // Faces the viewer, tipped back just enough to keep some depth
    tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, 1.22 - state.pointer.y * 0.15, 3, dt)
    tilt.current.rotation.z = THREE.MathUtils.damp(tilt.current.rotation.z, -state.pointer.x * 0.12, 3, dt)
    tilt.current.position.y = Math.sin(t * 0.7) * 0.06

    const show = clamp01((p - 0.6) / 0.4)
    rays.current = show * (hover.current ? 1.25 : 1)

    // The heart's glow breathes with the core light
    const hg = c * (1.5 + Math.sin(t * 2) * 0.12 + burst.current * 0.5)
    heart.current.scale.set(hg, hg, 1)
    heart.current.material.opacity = c * (0.7 + burst.current * 0.3)

    // Gold dust rises slowly, swaying, and fades at the top and bottom
    motes.forEach((d, n) => {
      if (!reducedMotion) d.y += dt * d.speed * (1 + extra.current * 1.5)
      if (d.y > 2.8) d.y -= 5.6
      const fade = 1 - THREE.MathUtils.smoothstep(Math.abs(d.y), 2.1, 2.8)
      const size = d.s * fade * show * (0.75 + 0.25 * Math.sin(t * 2 + d.phase))
      v0.set(d.x + Math.sin(t * 0.5 + d.phase) * 0.18, d.y, d.z)
      m4.compose(v0, q0, sv.set(size, size, size))
      dust.current.setMatrixAt(n, m4)
    })
    dust.current.instanceMatrix.needsUpdate = true

    sparkles.current.forEach((sp, n) => {
      if (!sp) return
      const tw = reducedMotion ? 0.7 : Math.max(0, Math.sin(t * (1.1 + n * 0.19) + n * 1.7)) ** 3
      const size = SPARKLES[n][3] * 1.3 * (0.35 + tw * 0.8 + burst.current * 0.9) * show
      sp.scale.set(size, size, 1)
      sp.material.rotation = t * 0.25 + n
      sp.material.opacity = Math.min(1, 0.2 + tw + burst.current) * show
    })
  })

  let petalIndex = 0
  return (
    <>
      <Aura glow={glow} rays={rays} />
      <instancedMesh ref={dust} args={[moteGeo, moteMat, motes.length]} frustumCulled={false} />
      <group ref={tilt} rotation={[1.22, 0, 0]} scale={0.98}>
        <group ref={bloomGroup}>
          {layers.map((l, li) =>
            Array.from({ length: l.n }, (_, j) => {
              const idx = petalIndex++
              return (
                <group key={`${li}-${j}`} rotation={[0, l.rot + (j / l.n) * Math.PI * 2, 0]}>
                  <group position={[0, 0, l.r]} ref={el => (petals.current[idx] = el)} rotation={[0.06, 0, 0]}>
                    <mesh geometry={l.geo} material={glass[li]} />
                    <lineSegments geometry={l.edges} material={edgeMat} />
                  </group>
                </group>
              )
            })
          )}
          <group ref={core} scale={0}>
            <mesh geometry={coreGeo} position={[0, 0.32, 0]}>
              <meshStandardMaterial color="#ff5a4a" emissive="#ff3020" emissiveIntensity={0.9} roughness={0.15} flatShading />
            </mesh>
            {STAMENS.map(({ a, lean, h }, n) => (
              <group key={n} rotation={[0, a, 0]}>
                <group rotation={[lean, 0, 0]}>
                  <mesh position={[0, h / 2, 0]} material={stamenMat}><cylinderGeometry args={[0.008, 0.012, h, 6]} /></mesh>
                  <mesh position={[0, h, 0]} material={stamenMat}><sphereGeometry args={[0.035, 12, 10]} /></mesh>
                </group>
              </group>
            ))}
            <pointLight ref={coreLight} position={[0, 0.4, 0]} color="#ff6a4a" distance={4} intensity={0} />
            <sprite ref={heart} position={[0, 0.35, 0]} renderOrder={5}>
              <spriteMaterial map={heartGlow} transparent depthWrite={false} depthTest={false} toneMapped={false} opacity={0} />
            </sprite>
          </group>
        </group>
      </group>
      {SPARKLES.map(([x, y, z], i) => (
        <sprite key={i} ref={el => (sparkles.current[i] = el)} position={[x, y, z]} scale={[0, 0, 1]}>
          <spriteMaterial map={sparkleMap} transparent depthWrite={false} toneMapped={false} color={i % 3 === 1 ? '#ffe9f3' : '#ffffff'} />
        </sprite>
      ))}
    </>
  )
}

// Warm, regal light panels for the ruby to reflect: a white key overhead, gold and
// rose at the sides, amber from below, and small bright strips for facet glints
function HoloLights() {
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={2.2} color="#fff4ea" position={[0, 5, -3]} scale={[10, 2, 1]} />
      <Lightformer form="rect" intensity={2.2} color="#ffcf8a" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
      <Lightformer form="rect" intensity={2.2} color="#ff8f9c" position={[5, 0, 1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
      <Lightformer form="rect" intensity={2} color="#ffb070" position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[8, 3, 1]} />
      <Lightformer form="rect" intensity={5} color="#ffffff" position={[-2.5, 2.5, 5]} rotation={[-0.4, -0.4, 0.6]} scale={[2.5, 0.25, 1]} />
      <Lightformer form="rect" intensity={5} color="#ffffff" position={[2.5, -1.5, 5]} rotation={[0.3, 0.4, -0.5]} scale={[2, 0.2, 1]} />
      <Lightformer form="ring" intensity={3} color="#fff2e0" position={[3, 3, 5]} scale={1.5} />
    </Environment>
  )
}

export default function RingScene() {
  return (
    <SceneCanvas camera={{ position: [0, 0, 9], fov: 35 }}>
      <color attach="background" args={[CREAM]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <HoloLights />
      <Flower />
    </SceneCanvas>
  )
}
