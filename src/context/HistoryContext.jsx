import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const MAX_ITEMS = 8
const HistoryContext = createContext(null)

/** Historial de búsquedas recientes (persistido en localStorage). */
export function HistoryProvider({ children }) {
  const [history, setHistory] = useLocalStorage('history', [])

  const addSearch = useCallback(
    (term) => {
      const clean = term.trim()
      if (!clean) return
      setHistory((prev) =>
        [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, MAX_ITEMS),
      )
    },
    [setHistory],
  )
  const removeSearch = useCallback((term) => setHistory((prev) => prev.filter((t) => t !== term)), [setHistory])
  const clearHistory = useCallback(() => setHistory([]), [setHistory])

  const value = useMemo(
    () => ({ history, addSearch, removeSearch, clearHistory }),
    [history, addSearch, removeSearch, clearHistory],
  )
  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export function useHistory() {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory debe usarse dentro de <HistoryProvider>')
  return ctx
}
