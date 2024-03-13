import { useEffect, useState } from "react";

export default function useLocalStorage(key, defaultValue = null) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(
      window.localStorage.getItem(key) ?? defaultValue
    )
  }, [key, defaultValue])
  
  const handleValue = (value) => {
    setValue(value)
    
    window.localStorage.setItem(key, value)
  }

  return [value, handleValue]
}