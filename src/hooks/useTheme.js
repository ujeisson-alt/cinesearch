import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

/** Modo oscuro / claro. Por defecto respeta la preferencia del sistema. */
export function useTheme() {
  const prefersLight = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches
  const [theme, setTheme] = useLocalStorage('theme', prefersLight ? 'light' : 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggleTheme }
}
