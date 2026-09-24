import { useSearchParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Filters from '../components/Filters'
import LoadingSpinner from '../components/LoadingSpinner'
import MovieGrid from '../components/MovieGrid'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import { useMovies } from '../hooks/useMovies'

export default function ResultsPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const type = params.get('tipo') === 'tv' ? 'tv' : 'movie'
  const genre = params.get('genero') || ''
  const year = params.get('anio') || ''
  const minRating = params.get('rating') || ''
  const page = Math.max(1, Number(params.get('pagina')) || 1)

  const { data, loading, error, retry } = useMovies({ query, type, page, genre, year, minRating })

  // Los filtros viven en la URL: se pueden compartir y el botón "atrás" funciona
  const updateParams = (changes) => {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    if (!('pagina' in changes)) next.delete('pagina')
    setParams(next)
  }
  const clearFilters = () => updateParams({ genero: '', anio: '', rating: '' })

  const label = type === 'tv' ? 'series' : 'películas'
  const title = query ? <>Resultados para <span className="text-gradient">“{query}”</span></> : `Explorar ${label}`

  return (
    <div className="container page">
      <div className="page__search"><SearchBar showTypes={false} /></div>

      <header className="page__header">
        <h1>{title}</h1>
        {data && !loading && (
          <p className="page__subtitle">
            {query && (genre || minRating)
              ? `${data.results.length} coincidencias en esta página (de ${data.totalResults.toLocaleString('es-AR')} resultados)`
              : `${data.totalResults.toLocaleString('es-AR')} ${label} encontradas`}
          </p>
        )}
      </header>

      <Filters type={type} genre={genre} year={year} minRating={minRating} onChange={updateParams} onClear={clearFilters} />

      <div className="page__results">
        {loading && <LoadingSpinner label={`Buscando ${label}…`} />}
        {error && !loading && <ErrorMessage error={error} onRetry={retry} />}
        {data && !loading && data.results.length === 0 && (
          <EmptyState
            emoji="🔍"
            title="No encontramos resultados"
            action={(genre || year || minRating) && (
              <button type="button" className="btn btn--primary" onClick={clearFilters}>Limpiar filtros</button>
            )}
          >
            {query
              ? `No hay ${label} que coincidan con “${query}” y los filtros elegidos. Probá con otro título o menos filtros.`
              : 'Probá ajustando los filtros.'}
          </EmptyState>
        )}
        {data && !loading && data.results.length > 0 && <MovieGrid movies={data.results} />}
        {data && !loading && (
          <Pagination page={page} totalPages={data.totalPages} onChange={(p) => updateParams({ pagina: p > 1 ? String(p) : '' })} />
        )}
      </div>
    </div>
  )
}
