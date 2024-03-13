import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

export default function SnakeSelectOption({
  title = 'Option Title',
  options = [{value: 'default', label: 'Default'}],
  value = 'default',
  onChanged = (newValue = 'default') => {},
  ...props
}) {
  const optionsRef = useRef()
  const selectionRef = useRef()

  // Responsive center childrens
  useFrame(() => {
    let spaceBetween = .4;
    let allWidth = .0;

    // Calculate width
    for (let i = 0; i < optionsRef.current.children.length; i++) {
      let option = optionsRef.current.children[i]
      let optionMeasure = new Vector3()

      option.geometry.boundingBox.getSize(optionMeasure)
      option.userData.size = optionMeasure
      
      allWidth += optionMeasure.x;
    }

    let startX = -((allWidth+spaceBetween*(optionsRef.current.children.length-1))/2);
    let preparedX = 0;
    let selectedI = null;
    
    options.map((option, index) => {
      if (option.value === value) {
        selectedI = index
      }

      return selectedI === index
    })

    // Set position
    for (let i = 0; i < optionsRef.current.children.length; i++) {
      let option = optionsRef.current.children[i]
      
      option.position.x = startX + preparedX + (option.userData.size.x/2)
      preparedX += option.userData.size.x + spaceBetween

      // Selected white background
      if (i === selectedI) {
        selectionRef.current.position.x = option.position.x
        selectionRef.current.position.y = option.position.y + .8
        
        selectionRef.current.scale.x = (option.userData.size.x+.2)/.1
        selectionRef.current.scale.y = option.userData.size.y/.1
      }
    }
  })

  const handleClick = (value) => () => {
    if (typeof onChanged === 'function') {
      onChanged(value)
    }
  }

  return (
    <group {...props}>
      
      <Text
        font="/VT323-Regular.woff"
        fontSize={.7}
        fontWeight={800}
        position={[0, 1.5, 0]}
      >
        {title}:
      </Text>
      <group position={[0, .8, 0]} ref={optionsRef}>
        {options.map((option) => (
          <Text
            key={option.value}
            color={value === option.value ? 'black' : 'white'}
            font="/VT323-Regular.woff"
            fontSize={.5}
            position={[0, 0, 0]}
            onClick={handleClick(option.value)}
          >
            {option.label}
          </Text>
        ))}
      </group>
      <mesh
        ref={selectionRef}
      >
        <planeGeometry args={[.1, .1]}  />
      </mesh>
    </group>
  )
}