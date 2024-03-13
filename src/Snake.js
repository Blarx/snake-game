import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import SnakeMenu from "./SnakeMenu";
import SnakeGame from "./SnakeGame";
import SnakeSettings from "./SnakeSettings";

export default function Snake() {
  const [screen, setScreen] = useState('main')
  const [screenProps, setScreenProps] = useState({})

  const handleScreen = (screen, props) => {
    console.log(screen, props)
    setScreen(screen)
    setScreenProps(props)
  }

  return (
    <Canvas
      dpr={[1, 1.4]}
      gl={{ antialias: false }}
    >
      <SnakeMenu
        visible={screen === 'main' || screen === 'game_over'}
        type={screen}
        onScreenChanged={handleScreen}
        {...screenProps}
      />
      <SnakeGame visible={screen === 'new'} onScreenChanged={handleScreen} />
      <SnakeSettings visible={screen === 'settings'} onScreenChanged={handleScreen} />
    </Canvas>
  )
}