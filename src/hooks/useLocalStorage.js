import { useEffect, useState } from 'react'

const PREFIX = 'cinesearch:'

/** useState que se sincroniza con localStorage (y sobrevive a recargas). */
export function useLocalStorage(key, initialValue) {
  const storageKey = PREFIX + key

  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      /* modo incógnito o storage lleno: seguimos funcionando en memoria */
    }
  }, [storageKey, value])

  return [value, setValue]
}
