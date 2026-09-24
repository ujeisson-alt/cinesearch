import { useCallback, useEffect, useState } from 'react'
import { discoverTitles, searchTitles } from '../services/tmdb'

/**
 * Encapsula el fetch de resultados + estados de carga y error.
 * - Si hay texto → /search/{type} (año del lado del servidor, género y puntuación filtrados en el cliente)
 * - Si no hay texto → /discover/{type} (todos los filtros del lado del servidor)
 */
export function useMovies({ query = '', type = 'movie', page = 1, genre = '', year = '', minRating = '' }) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState((s) => ({ ...s, loading: true, error: null }))

    const load = async () => {
      try {
        let data
        if (query.trim()) {
          data = await searchTitles({ query: query.trim(), type, page, year }, { signal: controller.signal })
          data = {
            ...data,
            results: data.results.filter(
              (m) =>
                (!genre || m.genreIds.includes(Number(genre))) &&
                (!minRating || m.rating >= Number(minRating)),
            ),
          }
        } else {
          data = await discoverTitles({ type, page, genre, year, minRating }, { signal: controller.signal })
        }
        setState({ data, loading: false, error: null })
      } catch (error) {
        if (error.name === 'AbortError') return
        setState({ data: null, loading: false, error })
      }
    }

    load()
    return () => controller.abort()
  }, [query, type, page, genre, year, minRating, reloadKey])

  const retry = useCallback(() => setReloadKey((k) => k + 1), [])
  return { ...state, retry }
}
