import useLocalStorage from "./useLocalStorage";

const snakeSpeed = {
  FAST: .100,
  NORM: .150,
  SLOW: .250,
}

export default function useSnakeSettings() {
  const [speed] = useLocalStorage('speed', 'normal')
  const [walls] = useLocalStorage('walls', 'on')

  let speedInMs = snakeSpeed.NORM

  if (speed === 'fast') {
    speedInMs = snakeSpeed.FAST
  }
  if (speed === 'slow') {
    speedInMs = snakeSpeed.SLOW
  }

  return {
    speed: speedInMs,
    walls: walls === 'on'
  }
}