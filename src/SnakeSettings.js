import { Text } from "@react-three/drei";
import SnakeSelectOption from "./SnakeSelectOption";
import useLocalStorage from "./useLocalStorage";

const speedOptions = [
  {value: 'slow', label: 'Slow'},
  {value: 'normal', label: 'Normal'},
  {value: 'fast', label: 'Fast'},
]
const wallsOptions = [
  {value: 'on', label: 'On'},
  {value: 'off', label: 'Off'},
]

export default function SnakeSettings({
  onScreenChanged = (screen = '', props = {}) => {},
  ...props
}) {
  // const [speed, setSpeed] = useState('normal')
  // const [walls, setWalls] = useState('on')
  const [speed, setSpeed] = useLocalStorage('speed', 'normal')
  const [walls, setWalls] = useLocalStorage('walls', 'on')
  
  const handleHome = () => {
    if (typeof onScreenChanged === 'function') {
      onScreenChanged('main', {})
    }
  }

  return (
    <group {...props}>
      <group position={[0, -1, 0]}>
        <Text
          font="/VT323-Regular.woff"
          fontSize={1.1}
          position={[0, 2.7, 0]}
          onClick={handleHome}
        >
          Settings
        </Text>
        <SnakeSelectOption
          title="Speed"
          options={speedOptions}
          value={speed}
          onChanged={setSpeed}
        />
        <SnakeSelectOption
          title="Walls"
          options={wallsOptions}
          value={walls}
          onChanged={setWalls}
          position={[0, -1.5, 0]}
        />
      </group>
    </group>
  )
}