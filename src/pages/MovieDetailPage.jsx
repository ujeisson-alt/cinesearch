import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import { ArrowLeftIcon, FilmIcon, HeartIcon, PlayIcon, StarIcon } from '../components/Icons'
import LoadingSpinner from '../components/LoadingSpinner'
import { useFavorites } from '../context/FavoritesContext'
import { useFetch } from '../hooks/useFetch'
import { backdropUrl, getDetails, posterUrl, profileUrl } from '../services/tmdb'
import './MovieDetailPage.css'

const formatRuntime = (min) => (min ? `${Math.floor(min / 60)}h ${min % 60}min` : null)
const formatDate = (d) =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : null

export default function MovieDetailPage({ type = 'movie' }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [showTrailer, setShowTrailer] = useState(false)
  const { data: movie, loading, error, retry } = useFetch((opts) => getDetails(type, id, opts), [type, id])

  if (loading) return <div className="container page"><LoadingSpinner label="Cargando detalle…" /></div>
  if (error) return <div className="container page"><ErrorMessage error={error} onRetry={retry} /></div>
  if (!movie) return null

  const fav = isFavorite(movie)
  const poster = posterUrl(movie.posterPath, 'w500')
  const backdrop = backdropUrl(movie.backdropPath)
  const people = type === 'tv' ? movie.creators : movie.directors

  return (
    <article className="detail">
      <div className="detail__backdrop" style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined} aria-hidden="true" />

      <div className="container detail__inner">
        <button type="button" className="btn btn--ghost detail__back" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}>
          <ArrowLeftIcon width={18} height={18} /> Volver
        </button>

        <div className="detail__layout">
          <div className="detail__poster">
            {poster ? <img src={poster} alt={`Póster de ${movie.title}`} /> : <div className="card__placeholder"><FilmIcon width={56} height={56} /></div>}
          </div>

          <div className="detail__info">
            <p className="detail__type">{type === 'tv' ? 'Serie' : 'Película'}</p>
            <h1>
              {movie.title} {movie.year && <span className="detail__year">({movie.year})</span>}
            </h1>
            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="detail__original">Título original: {movie.originalTitle}</p>
            )}
            {movie.tagline && <p className="detail__tagline">“{movie.tagline}”</p>}

            <ul className="detail__facts">
              {movie.rating > 0 && (
                <li className="detail__score"><StarIcon width={18} height={18} /> <strong>{movie.rating.toFixed(1)}</strong>/10 <small>({movie.votes.toLocaleString('es-AR')} votos)</small></li>
              )}
              {formatDate(movie.date) && <li>{formatDate(movie.date)}</li>}
              {type === 'movie' && formatRuntime(movie.runtime) && <li>{formatRuntime(movie.runtime)}</li>}
              {type === 'tv' && movie.seasons && <li>{movie.seasons} temporada{movie.seasons > 1 ? 's' : ''}</li>}
            </ul>

            {movie.genres.length > 0 && (
              <div className="detail__genres">
                {movie.genres.map((g) => (
                  <Link key={g.id} to={`/resultados?${type === 'tv' ? 'tipo=tv&' : ''}genero=${g.id}`} className="tag">{g.name}</Link>
                ))}
              </div>
            )}

            <div className="detail__actions">
              {movie.trailerKey && (
                <button type="button" className="btn btn--primary" onClick={() => setShowTrailer(true)}>
                  <PlayIcon width={18} height={18} /> Ver tráiler
                </button>
              )}
              <button type="button" className={`btn ${fav ? 'btn--fav-active' : 'btn--outline'}`} onClick={() => toggleFavorite(movie)} aria-pressed={fav}>
                <HeartIcon filled={fav} width={18} height={18} /> {fav ? 'En favoritos' : 'Agregar a favoritos'}
              </button>
            </div>

            <section>
              <h2>Sinopsis</h2>
              <p className="detail__overview">{movie.overview || 'Esta ficha todavía no tiene sinopsis en español.'}</p>
            </section>

            {people.length > 0 && (
              <p className="detail__crew"><span>{type === 'tv' ? 'Creada por' : 'Dirección'}:</span> {people.join(', ')}</p>
            )}
          </div>
        </div>

        {movie.cast.length > 0 && (
          <section className="section">
            <div className="section__head"><h2>Reparto principal</h2></div>
            <ul className="cast">
              {movie.cast.map((c) => (
                <li key={c.id} className="cast__item">
                  {c.profilePath ? (
                    <img src={profileUrl(c.profilePath)} alt={c.name} loading="lazy" />
                  ) : (
                    <div className="cast__avatar" aria-hidden="true">{c.name.charAt(0)}</div>
                  )}
                  <p className="cast__name">{c.name}</p>
                  {c.character && <p className="cast__character">{c.character}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {showTrailer && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={`Tráiler de ${movie.title}`} onClick={() => setShowTrailer(false)}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal__close" onClick={() => setShowTrailer(false)} aria-label="Cerrar tráiler">✕</button>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${movie.trailerKey}?autoplay=1`}
              title={`Tráiler de ${movie.title}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </article>
  )
}
