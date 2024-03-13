import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
// import { easing } from "maath"
import { useRef, useState } from "react"
import { Vector3 } from "three"
import useSnakeLogoAnimation from "./useSnakeLogoAnimation"

export default function SnakeMenu({
  onScreenChanged = (screen = '', props = {}) => {},
  type = 'game_over',
  score = 0,
  ...props
}) {
  const logoRef = useRef()
  const scoreRef = useRef()
  const snakeRef = useRef()
  const gameOverRef = useRef()
  const [hovered, setHovered] = useState('')
  
  useSnakeLogoAnimation(snakeRef)
  // useSnakeLogoAnimation(gameOverRef)

  useFrame((state, delta) => {
    if (hovered === 'new') {
      // let measure = new Vector3()
      // console.log(logoRef.current.geometry.boundingBox.getSize(measure), measure)
      // console.log(scoreRef.current.geometry.boundingBox.getSize(measure), measure)
      // console.log(state.viewport)
      // console.log(snakeRef.current.scale)
      // console.log(delta)
      // console.log(snakeRef.current.userData)
    }

    // Position logo && score
    const offsetVertical = 0.1
    const offsetHorizontal = 0.3

    let logoMeasure = new Vector3()
    logoRef.current.geometry.boundingBox.getSize(logoMeasure)
    logoRef.current.position.x = - state.viewport.width / 2 + logoMeasure.x/2 + offsetHorizontal
    logoRef.current.position.y = state.viewport.height / 2 - logoMeasure.y/2 - offsetVertical

    let scoreMeasure = new Vector3()
    scoreRef.current.geometry.boundingBox.getSize(scoreMeasure)
    scoreRef.current.position.x = state.viewport.width / 2 - scoreMeasure.x/2 - offsetHorizontal
    scoreRef.current.position.y = state.viewport.height / 2 - scoreMeasure.y/2 - offsetVertical
  })

  const mouseIn = (field) => () => setHovered(field)
  const mouseOut = () => setHovered('')
  const handleClick = (action) => () => {
    if (typeof onScreenChanged === 'function') {
      onScreenChanged(action, {})
    }
  }

  return (
    <group {...props}>
      <Text ref={logoRef} font="/VT323-Regular.woff" fontSize={0.8}>Snake</Text>
      <Text ref={scoreRef} font="/VT323-Regular.woff" fontSize={0.8}>Score: {score}</Text>
      <group position={[0, -1, 0]}>
        {type === 'game_over' ? <Text
          ref={gameOverRef}
          font="/VT323-Regular.woff"
          fontSize={1}
          position={[0, 1.7, 0]}
        >
          Game Over
        </Text> : <Text
          ref={snakeRef}
          font="/VT323-Regular.woff"
          fontSize={1.3}
          position={[0, 1.7, 0]}
        >
          Snake
        </Text>}
        <Text
          font="/VT323-Regular.woff"
          fontSize={.7}
          onPointerEnter={mouseIn('new')}
          onPointerLeave={mouseOut}
          onClick={handleClick('new')}
        >
          {hovered === 'new' ? '>' : ''}new game
        </Text>
        <Text
          font="/VT323-Regular.woff"
          color="#ffffff"
          fontSize={.7}
          position={[0, -.7, 0]}
          onPointerEnter={mouseIn('settings')}
          onPointerLeave={mouseOut}
          onClick={handleClick('settings')}
        >
          {hovered === 'settings' ? '>' : ''}settings
        </Text>
      </group>
    </group>
  )
}