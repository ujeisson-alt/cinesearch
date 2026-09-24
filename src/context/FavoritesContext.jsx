import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('favorites', [])

  const isFavorite = useCallback(
    (movie) => favorites.some((f) => f.id === movie.id && f.type === movie.type),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (movie) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === movie.id && f.type === movie.type)
        if (exists) return prev.filter((f) => !(f.id === movie.id && f.type === movie.type))
        // Guardamos solo lo necesario para pintar la card sin volver a llamar a la API
        const { id, type, title, year, rating, posterPath, genreIds, overview } = movie
        return [{ id, type, title, year, rating, posterPath, genreIds, overview, addedAt: Date.now() }, ...prev]
      })
    },
    [setFavorites],
  )

  const clearFavorites = useCallback(() => setFavorites([]), [setFavorites])

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, clearFavorites }),
    [favorites, isFavorite, toggleFavorite, clearFavorites],
  )
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites debe usarse dentro de <FavoritesProvider>')
  return ctx
}
