import { useCallback, useEffect, useState } from 'react'

/** Hook genérico: ejecuta una función async que recibe { signal } y maneja loading/error. */
export function useFetch(fetcher, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState((s) => ({ ...s, loading: true, error: null }))
    fetcher({ signal: controller.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, loading: false, error })
      })
    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey])

  const retry = useCallback(() => setReloadKey((k) => k + 1), [])
  return { ...state, retry }
}
