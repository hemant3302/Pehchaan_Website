import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import useInView from '../hooks/useInView.js'

// Studio lighting built from in-scene light panels, so no HDR files are fetched.
export function StudioLights({ warm = '#ffd2c2' }) {
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={4} color="#ffffff" position={[0, 5, -4]} scale={[10, 3, 1]} />
      <Lightformer form="rect" intensity={2.5} color={warm} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="rect" intensity={2} color="#ffffff" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[3, 3, 6]} rotation={[-0.4, 0.4, 0]} scale={[4, 1.2, 1]} />
    </Environment>
  )
}

// Canvas that pauses its render loop while scrolled out of view.
export default function SceneCanvas({ children, camera = { position: [0, 0, 6], fov: 35 }, className = '', ...rest }) {
  const [ref, inView] = useInView({ rootMargin: '200px' })
  return (
    <div ref={ref} className={`scene ${className}`}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={camera}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        {...rest}
      >
        {children}
      </Canvas>
    </div>
  )
}
