import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

export default function useSnakeLogoAnimation(snakeRef) {
  useFrame((state, delta) => {
    if (!snakeRef.current) {
      return
    }

    easing.damp3(
      snakeRef.current.scale,
      snakeRef.current.userData.direction === 'min'
        ? [1.5, 1.5, 1]
        : [1, 1, 1],
      .5,
      delta,
      0.01,
      easing.cubic.inOut,
    )

    if (snakeRef.current.scale.x === 1.5) {
      snakeRef.current.userData.direction = 'max'
    } else if (snakeRef.current.scale.x === 1) {
      snakeRef.current.userData.direction = 'min'
    }
  })
}