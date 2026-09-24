import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useHistory } from '../context/HistoryContext'
import { ClockIcon, CloseIcon, SearchIcon } from './Icons'
import './SearchBar.css'

/** Buscador con estado controlado + selector Películas/Series + historial reciente. */
export default function SearchBar({ size = 'md', autoFocus = false, showTypes = true }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { history, addSearch, removeSearch, clearHistory } = useHistory()

  const [query, setQuery] = useState(params.get('q') || '')
  const [type, setType] = useState(params.get('tipo') === 'tv' ? 'tv' : 'movie')
  const [showHistory, setShowHistory] = useState(false)
  const wrapperRef = useRef(null)

  // Si cambia la URL (ej: botón "atrás"), sincronizamos el input
  useEffect(() => {
    setQuery(params.get('q') || '')
    setType(params.get('tipo') === 'tv' ? 'tv' : 'movie')
  }, [params])

  // Cerrar el historial al hacer click afuera
  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowHistory(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const runSearch = (term) => {
    const clean = term.trim()
    if (!clean) return
    addSearch(clean)
    setShowHistory(false)
    const next = new URLSearchParams({ q: clean })
    if (type === 'tv') next.set('tipo', 'tv')
    navigate(`/resultados?${next.toString()}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    runSearch(query)
  }

  const visibleHistory = history.filter((t) => t.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <form className={`searchbar searchbar--${size}`} onSubmit={handleSubmit} role="search" ref={wrapperRef}>
      {showTypes && (
      <div className="searchbar__types" role="radiogroup" aria-label="Tipo de contenido">
        {[
          ['movie', 'Películas'],
          ['tv', 'Series'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={type === value}
            className={`chip ${type === value ? 'chip--active' : ''}`}
            onClick={() => setType(value)}
          >
            {label}
          </button>
        ))}
      </div>
      )}

      <div className="searchbar__field">
        <SearchIcon className="searchbar__icon" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onKeyDown={(e) => e.key === 'Escape' && setShowHistory(false)}
          placeholder={type === 'tv' ? 'Buscá una serie… ej: Okupas' : 'Buscá una película… ej: Relatos salvajes'}
          aria-label="Buscar por título"
          autoComplete="off"
          autoFocus={autoFocus}
        />
        <button type="submit" className="btn btn--primary searchbar__submit" disabled={!query.trim()}>
          Buscar
        </button>

        {showHistory && visibleHistory.length > 0 && (
          <div className="searchbar__history" role="listbox" aria-label="Búsquedas recientes">
            <div className="searchbar__history-head">
              <span>Búsquedas recientes</span>
              <button type="button" className="link-btn" onClick={clearHistory}>
                Borrar todo
              </button>
            </div>
            <ul>
              {visibleHistory.map((term) => (
                <li key={term}>
                  <button type="button" className="searchbar__history-item" onClick={() => { setQuery(term); runSearch(term) }}>
                    <ClockIcon width={16} height={16} /> {term}
                  </button>
                  <button type="button" className="icon-btn icon-btn--sm" aria-label={`Quitar "${term}" del historial`} onClick={() => removeSearch(term)}>
                    <CloseIcon width={14} height={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </form>
  )
}
