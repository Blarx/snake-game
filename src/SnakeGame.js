import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
import useSnakeControll from "./useSnakeControll"
import useSnakeSettings from "./useSnakeSettings"

const gameSnakeDirection = {
  UP: 0,
  DOWN: 1,
  RIGHT: 2,
  LEFT: 3,
}
const deckHeight = 59
const deckWidth = 39
const gameDesktop = new Array(deckHeight)

for (var i = 0; i < gameDesktop.length; i++) {
  gameDesktop[i] = new Array(deckWidth);
}

const gameSnakeDefault = [
  {x: 0, y: 0},
  {x: 0, y: 1},
  {x: 0, y: 2},
  {x: 0, y: 3},
]

const comparePos = (pos1, pos2) => pos1.x === pos2.x && pos1.y === pos2.y
const getDirection = (pos1, pos2) => {
  if (pos2.y < pos1.y) {
    return gameSnakeDirection.UP
  }
  if (pos2.y > pos1.y) {
    return gameSnakeDirection.DOWN
  }
  if (pos2.x < pos1.x) {
    return gameSnakeDirection.LEFT
  }
  if (pos2.x > pos1.x) {
    return gameSnakeDirection.RIGHT
  }
}
const snakeDisabledDirection = (snake) => {
  const head = snake[0]
  const neck = snake[1]

  return getDirection(neck, head)
}

export default function SnakeGame({
  onScreenChanged = (screen = '', props = {score: 0, deatchReason: ''}) => {},
  ...props
}) {
  const logoRef = useRef()
  const scoreRef = useRef()
  const borderRef = useRef()
  const snakeRef = useRef()
  const foodRef = useRef()
  const [hovered, setHovered] = useState('')
  const [snakeDirection, setSnakeDirection] = useState(gameSnakeDirection.DOWN)
  const [snake, setSnake] = useState([...gameSnakeDefault])
  const [score, setScore] = useState(0)
  const [food, setFood] = useState({x: null, y: null})

  // Reset when screen opened
  // When its new game plus
  useEffect(() => {
    // Cloning default
    setSnake([...gameSnakeDefault])
    setSnakeDirection(gameSnakeDirection.DOWN)
    setScore(0)
    setFood({x: null, y: null})
  }, [props.visible])

  // Controll
  const constroll = useSnakeControll()
  const settings = useSnakeSettings()

  useEffect(() => {
    const disabled = snakeDisabledDirection(snake)

    if (constroll.up && disabled !== gameSnakeDirection.UP) {
      setSnakeDirection(gameSnakeDirection.UP)
    }
    if (constroll.down && disabled !== gameSnakeDirection.DOWN) {
      setSnakeDirection(gameSnakeDirection.DOWN)
    }
    if (constroll.left && disabled !== gameSnakeDirection.LEFT) {
      setSnakeDirection(gameSnakeDirection.LEFT)
    }
    if (constroll.right && disabled !== gameSnakeDirection.RIGHT) {
      setSnakeDirection(gameSnakeDirection.RIGHT)
    }
  }, [constroll.up, constroll.down, constroll.left, constroll.right, snake])
  
  // Responsive
  useFrame((state, delta) => {
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

  const makeFood = () => {
    const newFood = {
      x: Math.ceil((deckWidth-2)*Math.random()) - Math.floor(deckWidth/2),
      y: Math.ceil((deckHeight-2)*Math.random()) - Math.floor(deckHeight/2),
    }

    for (let i = 0; i < snake.length; i++) {
      if (comparePos(newFood, snake[i])) {
        return makeFood()
      }
    }
    // console.log('New Food', newFood)
    return newFood
  }
  const upScore = () => setScore(prevScore => prevScore + 1)

  // Game
  useFrame((state, delta) => {
    if (props.visible === false) {
      state.clock.stop()
      return
    }
    if (!state.clock.running) {
      state.clock.start()
      return
    }
    if (!food.x === null || food.y === null) {
      setFood(makeFood())
    }
    if (state.clock.getElapsedTime() < settings.speed) {
      return
    }

    // Clock reset
    state.clock.start()
    
    let _x = snake[0].x
    let _y = snake[0].y

    switch(snakeDirection) {
      default: 
      case 0: _y++; break;
      case 1: _y--; break;
      case 2: _x++; break;
      case 3: _x--; break;
    }

    // Suicide by wall
    if (Math.abs(_x)*2 > deckWidth
      || Math.abs(_y)*2 > deckHeight) {
      // console.log('Walls', settings.walls)
      if (settings.walls) {
        // Game Over
        state.clock.stop()

        console.log('Game Over!!!', snake, 'wall')

        if (typeof onScreenChanged === 'function') {
          onScreenChanged('game_over', {score: score, deatchReason: 'wall'})
        }
        return
      } else {
        // Teleport
        if (Math.abs(_y)*2 > deckHeight) {
          // Vertical teleport
          _y = -_y
          if (_y > 0) {
            _y -= 1
          } else {
            _y += 1
          }
        } else if (Math.abs(_x)*2 > deckWidth) {
          // Horizontal teleport
          _x = -_x
          if (_x > 0) {
            _x -= 1
          } else {
            _x += 1
          }
        }
      }
    }
    // Autophagy death
    for (let i = 0; i < snake.length; i++) {
      const segment = snake[i]
      
      if (comparePos({x: _x, y: _y}, segment)) {
        // Game over
        state.clock.stop()
        
        console.log('Game Over!!!', snake, 'Autophagy')
  
        if (typeof onScreenChanged === 'function') {
          onScreenChanged('game_over', {score: score, deatchReason: 'autophagy'})
        }
        return
      }
    }
    
    let hasEatingFood = false;

    if (comparePos({x: _x, y: _y}, food)) {
      hasEatingFood = true
      setFood(makeFood())
      upScore()
    }

    setSnake(prevSnake => {
      // Eat food
      if (!hasEatingFood) {
        prevSnake.pop()
      }
      prevSnake.unshift({x: _x, y: _y})

      return prevSnake
    })
  })
  // Render Snake Moving & Food pos
  useFrame(() => {
    let offsetY = -.5;

    for (let i = 0; i < snake.length; i++) {
      let snakePoint = snake[i]
      let mesh = snakeRef.current.children[i]

      mesh.position.x = snakePoint.x/10
      mesh.position.y = snakePoint.y/10 + offsetY
    }
    if (hovered === 'border') {
      console.log('food ref', foodRef.current, foodRef.current.position)
    }
    foodRef.current.position.x = food.x/10
    foodRef.current.position.y = food.y/10 + offsetY
  })

  const mouseIn = (area) => () => setHovered(area)
  const mouseOut = () => setHovered()

  return (
    <group {...props}>
      <Text ref={logoRef} font="/VT323-Regular.woff" fontSize={0.8}>Snake</Text>
      <Text ref={scoreRef} font="/VT323-Regular.woff" fontSize={0.8}>Score: {score}</Text>
      <group ref={borderRef}>
        <mesh
          position={[0, 2.5, 0]}
          // ref={wallTopRed}
          onPointerEnter={mouseIn('border')}
          onPointerLeave={mouseOut}
        >
          <planeGeometry args={[4, .1]}/>
        </mesh>
        <mesh
          // ref={wallBottomRed}
          position={[0, -3.5, 0]}
          onPointerEnter={mouseIn('border')}
          onPointerLeave={mouseOut}
        >
          <planeGeometry args={[4, .1]}/>
        </mesh>
        <mesh
          // ref={wallLeftRed}
          position={[-2, -.5, 0]}
          onPointerEnter={mouseIn('border')}
          onPointerLeave={mouseOut}
        >
          <planeGeometry args={[.1, 6.1]}/>
        </mesh>
        <mesh
          // ref={wallRightRed}
          position={[2, -.5, 0]}
          onPointerEnter={mouseIn('border')}
          onPointerLeave={mouseOut}
        >
          <planeGeometry args={[.1, 6.1]}/>
        </mesh>
      </group>
      <group ref={snakeRef}>
        {snake.map((pos, i) => (
          <mesh
            key={i}
            position={[.1, i/10, 0]}
          >
            <planeGeometry args={[.1, .1]}  />
          </mesh>
        ))}
      </group>
      <group>
        <mesh
          ref={foodRef}
          position={[.1, .1, 0]}
        >
          <planeGeometry args={[.1, .1]} />
        </mesh>
      </group>
    </group>
  )
}
