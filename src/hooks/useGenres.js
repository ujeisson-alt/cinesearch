import { useEffect, useState } from 'react'
import { getGenres, hasApiKey } from '../services/tmdb'

const cache = {}

/** Lista de géneros de TMDb (cacheada en memoria por tipo). */
export function useGenres(type = 'movie') {
  const [genres, setGenres] = useState(cache[type] || [])

  useEffect(() => {
    if (!hasApiKey) return
    if (cache[type]) {
      setGenres(cache[type])
      return
    }
    const controller = new AbortController()
    getGenres(type, { signal: controller.signal })
      .then((list) => {
        cache[type] = list
        setGenres(list)
      })
      .catch(() => setGenres([]))
    return () => controller.abort()
  }, [type])

  return genres
}
