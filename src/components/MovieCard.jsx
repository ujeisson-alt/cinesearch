import { Link } from 'react-router-dom'
import { useGenres } from '../hooks/useGenres'
import { posterUrl } from '../services/tmdb'
import { FilmIcon, HeartIcon, StarIcon } from './Icons'
import './MovieCard.css'

export const detailPath = (movie) => `/${movie.type === 'tv' ? 'serie' : 'pelicula'}/${movie.id}`

/**
 * @param {{ movie: object, isFavorite: boolean, onToggleFavorite: (movie) => void }} props
 */
export default function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  const genres = useGenres(movie.type)
  const genreNames = movie.genreIds
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .slice(0, 2)
  const poster = posterUrl(movie.posterPath)

  return (
    <article className="card">
      <Link to={detailPath(movie)} className="card__link" aria-label={`Ver detalle de ${movie.title}`}>
        <div className="card__poster">
          {poster ? (
            <img src={poster} alt={`Póster de ${movie.title}`} loading="lazy" />
          ) : (
            <div className="card__placeholder">
              <FilmIcon width={40} height={40} />
              <span>Sin imagen</span>
            </div>
          )}
          {movie.rating > 0 && (
            <span className={`card__rating ${movie.rating >= 7 ? 'is-high' : movie.rating < 5 ? 'is-low' : ''}`}>
              <StarIcon width={14} height={14} /> {movie.rating.toFixed(1)}
            </span>
          )}
        </div>
        <div className="card__body">
          <h3 className="card__title" title={movie.title}>{movie.title}</h3>
          <p className="card__meta">
            {movie.year || 'Sin fecha'}
            {movie.type === 'tv' && <span className="tag tag--sm">Serie</span>}
          </p>
          {genreNames.length > 0 && <p className="card__genres">{genreNames.join(' · ')}</p>}
        </div>
      </Link>

      <button
        type="button"
        className={`card__fav ${isFavorite ? 'is-active' : ''}`}
        onClick={() => onToggleFavorite(movie)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Quitar ${movie.title} de favoritos` : `Agregar ${movie.title} a favoritos`}
      >
        <HeartIcon filled={isFavorite} />
      </button>
    </article>
  )
}
