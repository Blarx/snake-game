import { useRef, useState } from 'react';
import './App.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Text, } from '@react-three/drei';
import { easing } from 'maath';
import Ground from './Ground';

export default function TestDesign() {
  return (
    <Canvas
      flat
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
      camera={{ position: [10, 35, 10], near: 30, far: 55, fov: 12, }}
    >
      <color attach="background" args={['#d3d3d3']} />
      {/* <color attach="background" args={['#f0f0f0']} /> */}
      {/* <fog attach="fog" args={['black', 15, 20]} /> */}
      {/* <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 15]} intensity={0.3} />
      <directionalLight position={[0, 10, 10]} intensity={0.7} /> */}
      {/* <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.4} penumbra={0} decay={0} intensity={Math.PI} /> */}
      {/* <hemisphereLight intensity={0.15} groundColor="black" /> */}
      <directionalLight position={[-1, -5, 5]} shadow-mapSize={[512, 512]} shadow-bias={-0.0001} castShadow>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10]} />
      </directionalLight>
      <directionalLight position={[10, 10, -15]} shadow-mapSize={[512, 512]} shadow-bias={-0.0001} castShadow>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10]} />
      </directionalLight>
      <group>
        <Block />
        <Ground />
      </group>
      {/* <AccumulativeShadows temporal frames={Infinity} alphaTest={1} blend={200} limit={1500} scale={25} >
        <RandomizedLight amount={1} mapSize={512} radius={5} ambient={0.01} position={[-10, 10, 5]} size={10} bias={0.001} />
      </AccumulativeShadows> */}
      {/* <AccumulativeShadows temporal frames={100} color={shadow} opacity={1.05}>
        <RandomizedLight radius={10} position={[10, 10, 10]} />
      </AccumulativeShadows> */}
      <CameraRig />
    </Canvas>
  )
}

function Block() {
  const mesh = useRef()
  const text = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (hovered) {
      console.log(text.current)
    }
    easing.damp3(
      mesh.current.position,
      [mesh.current.position.x, (hovered ? 1 : 0.51), mesh.current.position.z],
      0.5,
      delta,
    )
    easing.damp3(
      mesh.current.scale,
      [(hovered ? 1.1 : 1), (hovered ? 1.05 : 1), mesh.current.scale.z],
      0.5,
      delta,
    )
  })

  return (
    <mesh
      ref={mesh}
      castShadow
      position={[0, 0.51, 0]}
      onPointerEnter={() => setHovered(1)}
      onPointerLeave={() => setHovered(0)}
    >
      <Text ref={text} castShadow position={[0, .51, .1]} rotation={[- Math.PI / 2, 0, 0]} color="black" anchorX="center" anchorY="middle">
        Wtf !?
        {/* <MeshReflectorMaterial
          blur={[0, 0]}
          resolution={256}
          mixBlur={0}
          mixStrength={0}
          roughness={0}
          depthScale={0.2}
          minDepthThreshold={0.1}
          maxDepthThreshold={0.4}
          color="#202020"
          metalness={0.1}
        /> */}
      </Text>
      <boxGeometry args={[3, 1, 1]} />
      <MeshReflectorMaterial
        blur={[0, 0]}
        resolution={256}
        mixBlur={0}
        mixStrength={0}
        roughness={0}
        depthScale={0.2}
        minDepthThreshold={0.1}
        maxDepthThreshold={0.4}
        // color="#202020"
        color="#ffffff"
        metalness={0.1}
      />
    </mesh>
  )
}

function CameraRig() {
  useFrame((state, delta) => {
    // console.log([state.camera.position.x, 35 + (1 + state.pointer.y) / 2, -15],)
    easing.damp3(
      state.camera.position,
      [(state.pointer.x * state.viewport.width) / 9, 35, 9.5 + (1 + state.pointer.y) / 2],
      // [9 + (state.pointer.x * state.viewport.width) / 2, 35 + (1 + state.pointer.y), -5.5],
      // [9 + (state.pointer.x * state.viewport.width) / 3, 35 + (1 + state.pointer.y) / 2, -5.5],
      // [1 + (state.pointer.x * state.viewport.width) / 3, (1 + state.pointer.y) / 2, -5.5],
      0.5,
      delta
    )
    state.camera.lookAt(0, 0, 0)
  })
}
