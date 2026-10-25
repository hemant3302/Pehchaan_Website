import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import SceneCanvas from './SceneCanvas.jsx'
import { clamp01, reducedMotion, viewProgress } from './motion.js'

// Glowing particles rise from the dark ground and assemble into a large tree made only
// of points, its branches spreading wide into the dark.
// Every point takes its colour from a pixel of a sunset photo painted in code (never
// shown itself): warm ground tones form the trunk, the horizon the limbs, and the
// bright cool sky the canopy. A warm light inside the trunk
// glows through the gaps. Points away from the focal plane soften and grow (shallow
// depth of field) and split slightly into red and blue (chromatic aberration).
// It grows as the visitor scrolls it into view: points stream out of a seed of light
// at the foot of the trunk and settle into place, trunk first, canopy last. Growth
// only ever moves forward, so once grown it stays, even when scrolling back up.
// Visitors can then turn it by dragging (mouse) or swiping sideways (touch) to see it
// from any side; a fine cloud of glowing dust around the crown turns with it and gives
// depth. On phones, vertical swipes still scroll the page. Once grown it shows it's
// alive: a soft band of light climbs from trunk to canopy every few seconds like a
// heartbeat, points under the cursor brighten, and a tap sends a brighter pulse up.

const AUTO_TURN = 0.05 // radians per second, about two minutes for a full turn
const GROW_RATE = 0.12 // fraction of the tree grown per second at most (about 8 seconds in all)
const BASE = -1.35 // height of the surface the photo lies on
const PHOTO = { x: -0.5, z: 0.55, w: 2.5, d: 1.65 }
const KEEP = 0.3 // the near part of the photo that never dissolves (where the roots are)
const TRUNK_UV = [0.44, 0.2]
const TARGET_POINTS = 70000

function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647) }
const gauss = rand => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand())

// Photo uv (0..1 across, 0 = near edge, 1 = far edge) to a point on the surface
const onPhoto = (u, v) => new THREE.Vector3(PHOTO.x + (u - 0.5) * PHOTO.w, BASE + 0.004, PHOTO.z - (v - 0.5) * PHOTO.d)

/* ---------- the photograph: a warm landscape at sunset, painted to a canvas ---------- */

function paintPhoto() {
  const W = 512, H = 340
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const g = c.getContext('2d')
  const sky = g.createLinearGradient(0, 0, 0, H * 0.7)
  sky.addColorStop(0, '#6fa8ff'); sky.addColorStop(0.45, '#b9d2ff'); sky.addColorStop(0.8, '#ffd0a0'); sky.addColorStop(1, '#ff9a5a')
  g.fillStyle = sky; g.fillRect(0, 0, W, H)
  const sun = g.createRadialGradient(W * 0.62, H * 0.64, 0, W * 0.62, H * 0.64, 90)
  sun.addColorStop(0, 'rgba(255,248,226,1)'); sun.addColorStop(0.25, 'rgba(255,214,150,.9)'); sun.addColorStop(1, 'rgba(255,150,90,0)')
  g.fillStyle = sun; g.fillRect(0, 0, W, H)
  const hills = (y, amp, color, seed) => {
    g.fillStyle = color; g.beginPath(); g.moveTo(0, H)
    for (let x = 0; x <= W; x += 8) g.lineTo(x, y + Math.sin(x * 0.012 + seed) * amp + Math.sin(x * 0.031 + seed * 2) * amp * 0.4)
    g.lineTo(W, H); g.fill()
  }
  hills(H * 0.66, 14, '#a0523a', 1)
  hills(H * 0.74, 18, '#6b2a1a', 3)
  hills(H * 0.84, 12, '#3a160c', 5)
  const ground = g.createLinearGradient(0, H * 0.84, 0, H)
  ground.addColorStop(0, 'rgba(58,22,12,0)'); ground.addColorStop(1, '#1e0b06')
  g.fillStyle = ground; g.fillRect(0, H * 0.84, W, H)
  // film grain
  const img = g.getImageData(0, 0, W, H)
  const rand = rng(5)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rand() - 0.5) * 18
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n
  }
  g.putImageData(img, 0, 0)
  return { canvas: c, pixels: g.getImageData(0, 0, W, H).data, W, H }
}

// Colour of the photo at a point on the print. The near edge shows the sky, the far
// edge the ground (it lies with its top towards us), so v = 1 is the ground.
function sample(photo, u, v, out) {
  const x = Math.min(photo.W - 1, Math.max(0, Math.floor(u * photo.W)))
  const y = Math.min(photo.H - 1, Math.max(0, Math.floor(v * photo.H)))
  const i = (y * photo.W + x) * 4
  return out.setRGB(photo.pixels[i] / 255, photo.pixels[i + 1] / 255, photo.pixels[i + 2] / 255, THREE.SRGBColorSpace)
}

/* ---------- the tree, as a cloud of points ---------- */

function buildCloud(photo) {
  const rand = rng(91)
  const UP = new THREE.Vector3(0, 1, 0)
  const base = onPhoto(...TRUNK_UV)
  const branches = []
  const tips = []

  const grow = (start, dir, len, rad, depth) => {
    const end = start.clone().addScaledVector(dir, len)
    branches.push({ start, end, dir, len, rad, depth })
    if (depth === 7) { tips.push(end); return }
    const kids = depth < 2 ? 3 : rand() < 0.35 ? 3 : 2
    const a = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) < 0.95 ? UP : new THREE.Vector3(1, 0, 0)).normalize()
    const b = new THREE.Vector3().crossVectors(dir, a).normalize()
    for (let k = 0; k < kids; k++) {
      const spread = 0.5 + rand() * 0.35 + depth * 0.04
      const around = rand() * Math.PI * 2
      const off = a.clone().multiplyScalar(Math.cos(around)).addScaledVector(b, Math.sin(around))
      const cdir = dir.clone().multiplyScalar(Math.cos(spread)).addScaledVector(off, Math.sin(spread))
      cdir.x *= 1.25 // reach wide rather than tall
      cdir.addScaledVector(UP, 0.08).normalize()
      grow(end, cdir, len * (0.72 + rand() * 0.1), rad * 0.64, depth + 1)
    }
  }
  grow(base.clone(), UP.clone(), 0.74, 0.085, 0)

  // Heights for colour mapping and assembly order
  let top = base.y
  tips.forEach(t => { top = Math.max(top, t.y + 0.2) })
  const hOf = y => clamp01((y - base.y) / (top - base.y))

  // Share the point budget: limbs by length and thickness, foliage at the tips, roots
  const weights = branches.map(b => b.len * (0.35 + b.rad * 9))
  const total = weights.reduce((s, w) => s + w, 0)
  const LIMBS = TARGET_POINTS * 0.56, LEAVES = TARGET_POINTS * 0.44

  const target = [], start = [], color = [], when = [], size = []
  const c = new THREE.Color()
  const push = (p, h, isRoot) => {
    target.push(p.x, p.y, p.z)
    let s
    if (isRoot) s = p // roots already lie on the photo
    else {
      // leaves the photo from the band that maps to its height: ground for the trunk,
      // sky for the canopy, in the order the dissolving edge reaches it
      // every point starts in a small seed of light at the foot of the trunk
      s = base.clone().add(new THREE.Vector3(gauss(rand) * 0.05, 0.05 + rand() * 0.08, gauss(rand) * 0.05))
    }
    start.push(s.x, s.y, s.z)
    const sv = isRoot ? 0.92 + rand() * 0.06 : clamp01(1 - h * 0.95 + (rand() - 0.5) * 0.05)
    sample(photo, 0.1 + rand() * 0.8, sv, c)
    color.push(c.r, c.g, c.b)
    when.push(isRoot ? -1 : h)
    size.push(0.6 + rand() * 0.9)
  }

  branches.forEach((b, i) => {
    const n = Math.round((weights[i] / total) * LIMBS)
    const a = new THREE.Vector3().crossVectors(b.dir, Math.abs(b.dir.y) < 0.95 ? UP : new THREE.Vector3(1, 0, 0)).normalize()
    const bb = new THREE.Vector3().crossVectors(b.dir, a).normalize()
    for (let k = 0; k < n; k++) {
      const t = rand()
      const ang = rand() * Math.PI * 2
      const r = b.rad * (0.55 + rand() * 0.5) * (1 - t * 0.3)
      const p = b.start.clone().addScaledVector(b.dir, b.len * t)
        .addScaledVector(a, Math.cos(ang) * r).addScaledVector(bb, Math.sin(ang) * r)
      push(p, hOf(p.y), false)
    }
  })
  const perTip = Math.round(LEAVES / tips.length)
  tips.forEach(tp => {
    for (let k = 0; k < perTip; k++) {
      const p = tp.clone().add(new THREE.Vector3(gauss(rand) * 0.15, gauss(rand) * 0.1, gauss(rand) * 0.15))
      push(p, hOf(p.y), false)
    }
  })
  // A fine shell of glowing dust around the crown, for depth when the tree is turned
  const crown = tips.reduce((acc, t) => acc.add(t), new THREE.Vector3()).divideScalar(tips.length)
  for (let k = 0; k < 3500; k++) {
    const d = new THREE.Vector3(gauss(rand), gauss(rand) * 0.6, gauss(rand)).normalize()
    const r = 1.1 + Math.pow(rand(), 0.6) * 1.4
    const p = crown.clone().add(new THREE.Vector3(d.x * r * 1.25, d.y * r * 0.9 + 0.2, d.z * r * 1.25))
    target.push(p.x, p.y, p.z)
    start.push(base.x, base.y + 0.1, base.z)
    sample(photo, 0.1 + rand() * 0.8, rand() < 0.75 ? rand() * 0.35 : 0.55 + rand() * 0.2, c)
    color.push(c.r * 0.7, c.g * 0.7, c.b * 0.7)
    when.push(1)
    size.push(0.3 + rand() * 0.45)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(target, 3))
  geo.setAttribute('aStart', new THREE.Float32BufferAttribute(start, 3))
  geo.setAttribute('aColor', new THREE.Float32BufferAttribute(color, 3))
  geo.setAttribute('aWhen', new THREE.Float32BufferAttribute(when, 1))
  geo.setAttribute('aSize', new THREE.Float32BufferAttribute(size, 1))
  const light = base.clone().add(new THREE.Vector3(0, 0.55, 0.02))
  // the tree turns around its trunk, at about mid height
  const pivot = new THREE.Vector3(base.x, base.y + (top - base.y) * 0.45, base.z)
  return { geo, light, pivot }
}

const pointsVertex = /* glsl */`
  uniform float uProgress, uScale, uFocus, uTime, uFade, uTap, uGrown, uHover, uBeat;
  uniform vec2 uPointer;
  uniform vec3 uLight;
  attribute vec3 aStart, aColor;
  attribute float aWhen, aSize;
  varying vec3 vColor;
  varying float vAlpha, vBlur;
  float hash(float n){ return fract(sin(n) * 43758.5453); }
  void main(){
    float id = float(gl_VertexID);
    // each point leaves the photo when the dissolving edge reaches it, and takes a
    // short arcing flight up to its place in the tree
    float k = aWhen < 0. ? smoothstep(0., .2, uProgress) : clamp((uProgress - aWhen * .78) / .22, 0., 1.);
    float e = k * k * (3. - 2. * k);
    vec3 p = mix(aStart, position, e);
    p.y += sin(e * 3.14159) * (.25 + .35 * hash(id));
    p.x += sin(e * 3.14159) * (hash(id + 3.) - .5) * .5;
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    float dist = -mv.z;
    float blur = clamp(abs(dist - uFocus) * .3, 0., 1.3); // shallow depth of field
    gl_PointSize = (aSize * uScale / dist) * (1. + blur * 1.3);
    gl_Position = projectionMatrix * mv;
    // the warm light inside the trunk brightens nearby points
    float d = distance(p, uLight);
    vec3 warm = vec3(1., .62, .32) * 1.6 * exp(-d * d / .55);
    float twinkle = .92 + .08 * sin(uTime * .7 + id);
    vColor = aColor * (.62 + warm) * twinkle * .8;
    // Pulse: a band of light climbs the tree from the trunk to the canopy every few
    // seconds, like a heartbeat, and a tap sends a brighter one straight away
    float hgt = aWhen < 0. ? 0. : aWhen;
    float front = fract(uTime / 4.5) * 1.5 - .2;
    float beat = exp(-pow((hgt - front) / .09, 2.)) * uBeat;
    float tapFront = uTap * .5 - .1;
    float tap = uTap < 3.2 ? exp(-pow((hgt - tapFront) / .09, 2.)) * 1.7 : 0.;
    float pulse = (beat + tap) * uGrown;
    // Hover: points under the cursor brighten, like running a hand through light
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vec2 dp = (ndc - uPointer) * vec2(1., .9);
    float hov = exp(-dot(dp, dp) / .018) * uHover * uGrown;
    vColor *= 1. + pulse * 1.5 + hov * 1.8;
    gl_PointSize *= 1. + pulse * .45 + hov * .55;
    vAlpha = (aWhen < 0. ? e : smoothstep(0., .06, k)) / (1. + blur * blur * 3.5);
    vAlpha *= uFade;
    vBlur = blur;
  }`

const pointsFragment = /* glsl */`
  varying vec3 vColor;
  varying float vAlpha, vBlur;
  float soft(vec2 q){ float r = length(q); return pow(clamp(1. - r * 2., 0., 1.), 1.6); }
  void main(){
    vec2 q = gl_PointCoord - .5;
    // slight chromatic aberration: red and blue pulled apart, more when out of focus
    float ca = .06 + vBlur * .07;
    float r = soft(q + vec2(ca, 0.)), g = soft(q), b = soft(q - vec2(ca, 0.));
    float a = max(r, max(g, b)) * vAlpha;
    if (a < .01) discard;
    gl_FragColor = vec4(vColor * vec3(r, g, b) * vAlpha, a);
    #include <colorspace_fragment>
  }`

const photoVertex = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`
function Scene() {
  const spin = useRef()
  const glow = useRef()
  const grown = useRef(0) // how far it has grown; only ever increases
  const gl = useThree(s => s.gl)
  const camera = useThree(s => s.camera)
  const size = useThree(s => s.size)
  const dpr = useThree(s => s.viewport.dpr)

  useEffect(() => { camera.lookAt(0, -0.05, 0) }, [camera])

  const photo = useMemo(paintPhoto, [])
  const { geo, light, pivot } = useMemo(() => buildCloud(photo), [photo])

  const pointsMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: pointsVertex, fragmentShader: pointsFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uProgress: { value: 1 }, uScale: { value: 1 }, uFocus: { value: 6.9 }, uTime: { value: 0 }, uFade: { value: 1 }, uTap: { value: 99 }, uGrown: { value: 0 }, uHover: { value: 0 }, uBeat: { value: reducedMotion ? 0 : 1 }, uPointer: { value: new THREE.Vector2(9, 9) }, uLight: { value: light } },
  }), [light])
  // Soft haze behind everything: black, with a warm bloom around the trunk light
  const hazeMat = useMemo(() => new THREE.ShaderMaterial({
    toneMapped: false, depthWrite: false,
    vertexShader: photoVertex,
    fragmentShader: `varying vec2 vUv;
      void main(){
        vec2 p = vUv - vec2(.47, .44);
        // a tight warm haze around the trunk light, falling off to deep black
        float bloom = exp(-dot(p * vec2(1., 1.25), p * vec2(1., 1.25)) / .006) * .12 + exp(-dot(p, p) / .03) * .012;
        gl_FragColor = vec4(vec3(1., .48, .2) * bloom, 1.);
        #include <colorspace_fragment>
      }`,
  }), [])

  const glowTex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 128
    const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    r.addColorStop(0, 'rgba(255,220,170,1)'); r.addColorStop(0.25, 'rgba(255,150,80,.45)'); r.addColorStop(1, 'rgba(255,120,60,0)')
    g.fillStyle = r; g.fillRect(0, 0, 128, 128)
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
  }, [])

  // Drag to turn: sideways turns the tree round its trunk, up and down tips it a little.
  // Letting go mid-swipe lets it glide on briefly and settle.
  const drag = useRef({ on: false, x: 0, y: 0, sx: 0, sy: 0, vx: 0, yaw: 0, pitch: 0, tapAt: -99, hover: false })
  useEffect(() => {
    const area = gl.domElement.closest('.bento-hero') || gl.domElement
    const d = drag.current
    const down = e => {
      d.on = true; d.x = d.sx = e.clientX; d.y = d.sy = e.clientY; d.vx = 0
      area.classList.add('explored', 'dragging')
    }
    const move = e => {
      if (!d.on) return
      const dx = e.clientX - d.x, dy = e.clientY - d.y
      d.x = e.clientX; d.y = e.clientY
      d.yaw += dx * 0.009
      d.pitch = THREE.MathUtils.clamp(d.pitch + dy * 0.004, -0.3, 0.45)
      d.vx = dx * 0.009
    }
    const up = e => {
      if (!d.on) return
      d.on = false
      // a press that barely moved is a tap: send a pulse up the tree
      if (e && e.type === 'pointerup' && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 6) d.tapAt = performance.now() / 1000
      area.classList.remove('dragging')
      if (!reducedMotion) d.yaw += d.vx * 9 // a short glide after letting go
    }
    area.addEventListener('pointerdown', down)
    const enter = e => { if (e.pointerType === 'mouse') d.hover = true }
    const leave = () => { d.hover = false }
    area.addEventListener('pointerenter', enter)
    area.addEventListener('pointerleave', leave)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up) // a vertical swipe hands over to page scrolling
    return () => {
      area.removeEventListener('pointerdown', down)
      area.removeEventListener('pointerenter', enter)
      area.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [gl])

  useFrame((state, dt) => {
    // Growth follows the scroll: none as the tile enters at the bottom of the screen,
    // complete once it's well in view. It is eased and never goes backwards.
    const target = reducedMotion ? 1 : clamp01((viewProgress(gl.domElement) - 0.15) / 0.75)
    // It never grows faster than GROW_RATE, so even a quick scroll gives a slow, full growth
    if (target > grown.current) grown.current = Math.min(target, grown.current + dt * GROW_RATE)
    const g = grown.current
    const u = pointsMat.uniforms
    u.uProgress.value = g
    u.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime
    u.uScale.value = 0.011 * (size.height * dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(state.camera.fov / 2)))
    const now = performance.now() / 1000
    const ready = THREE.MathUtils.smoothstep(g, 0.95, 1)
    u.uGrown.value = ready
    u.uTap.value = now - drag.current.tapAt
    u.uHover.value = THREE.MathUtils.damp(u.uHover.value, drag.current.hover || drag.current.on ? 1 : 0, 6, dt)
    u.uPointer.value.copy(state.pointer)
    // the trunk light swells as each heartbeat sets off, and flares on a tap
    const phase = (state.clock.elapsedTime / 4.5) % 1
    const beat = reducedMotion ? 0 : Math.exp(-Math.pow((phase * 1.5 - 0.2) / 0.08, 2))
    const tapFlash = Math.max(0, 1 - u.uTap.value / 0.8)
    const swell = 1 + (beat * 0.35 + tapFlash * 0.6) * ready
    glow.current.scale.set(0.85 * swell, 0.85 * swell, 1)
    glow.current.material.opacity = (0.25 + 0.45 * clamp01(g * 2)) * (1 + (beat * 0.4 + tapFlash * 0.5) * ready)

    const d = drag.current
    // A very slow turn once grown (about two minutes a revolution). It eases to a stop
    // while someone is dragging and eases back in after they let go.
    d.auto = THREE.MathUtils.damp(d.auto || 0, d.on || reducedMotion ? 0 : AUTO_TURN * ready, 1.5, dt)
    d.yaw += d.auto * dt
    spin.current.rotation.y = THREE.MathUtils.damp(spin.current.rotation.y, d.yaw, d.on ? 14 : 4, dt)
    spin.current.rotation.x = THREE.MathUtils.damp(spin.current.rotation.x, d.pitch, d.on ? 14 : 4, dt)
  })

  return (
    <>
      <mesh position={[0, 0.5, -5]} material={hazeMat}><planeGeometry args={[22, 14]} /></mesh>
      {/* turn around the trunk: move the pivot to the origin, rotate, move back */}
      {/* sized and placed so the whole crown stays in frame from every angle */}
      <group position={[pivot.x + 0.4, pivot.y - 0.3, pivot.z]} scale={0.8}>
        <group ref={spin}>
          <group position={pivot.clone().negate()}>
            <points geometry={geo} material={pointsMat} frustumCulled={false} />
            <sprite ref={glow} position={light} scale={[0.85, 0.85, 1]}>
              <spriteMaterial map={glowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} opacity={0} />
            </sprite>
          </group>
        </group>
      </group>
    </>
  )
}

export default function HeroScene() {
  return (
    <SceneCanvas camera={{ position: [0.35, 1.25, 7.4], fov: 34 }}>
      <color attach="background" args={['#020202']} />
      <Scene />
    </SceneCanvas>
  )
}
