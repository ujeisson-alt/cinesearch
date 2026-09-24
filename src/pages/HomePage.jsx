import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import { ClockIcon } from '../components/Icons'
import LoadingSpinner from '../components/LoadingSpinner'
import MovieGrid from '../components/MovieGrid'
import SearchBar from '../components/SearchBar'
import { useHistory } from '../context/HistoryContext'
import { useFetch } from '../hooks/useFetch'
import { getTrending, hasApiKey } from '../services/tmdb'
import './HomePage.css'

function TrendingSection({ type, title, seeAllHref }) {
  const { data, loading, error, retry } = useFetch((opts) => getTrending(type, opts), [type])
  return (
    <section className="section">
      <div className="section__head">
        <h2>{title}</h2>
        <Link to={seeAllHref} className="link-btn">Ver todo →</Link>
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} onRetry={retry} />}
      {data && <MovieGrid movies={data.results.slice(0, 12)} />}
    </section>
  )
}

export default function HomePage() {
  const { history } = useHistory()
  const navigate = useNavigate()

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <p className="hero__eyebrow">Prototipo · StreamBit</p>
          <h1>
            Encontrá qué ver en <span className="text-gradient">menos de 2 minutos</span>
          </h1>
          <p className="hero__lead">
            Buscá películas y series, filtrá por género, año y puntuación, y guardá tus favoritos para no perderlos.
          </p>
          <SearchBar size="lg" />

          {history.length > 0 && (
            <div className="hero__recent">
              <span><ClockIcon width={16} height={16} /> Recientes:</span>
              {history.slice(0, 5).map((term) => (
                <button key={term} type="button" className="chip" onClick={() => navigate(`/resultados?q=${encodeURIComponent(term)}`)}>
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container">
        {hasApiKey ? (
          <>
            <TrendingSection type="movie" title="🔥 Películas populares de la semana" seeAllHref="/resultados" />
            <TrendingSection type="tv" title="📺 Series populares de la semana" seeAllHref="/resultados?tipo=tv" />
          </>
        ) : (
          <EmptyState emoji="🔑" title="Falta configurar la API Key de TMDb">
            Creá un archivo <code>.env</code> en la raíz del proyecto con <code>VITE_TMDB_API_KEY=tu_clave</code> y
            reiniciá <code>npm run dev</code>. Podés obtener la clave gratis en themoviedb.org → Configuración → API.
          </EmptyState>
        )}
      </div>
    </>
  )
}
