import { useFavorites } from '../context/FavoritesContext'
import MovieCard from './MovieCard'
import './MovieGrid.css'

export default function MovieGrid({ movies }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  return (
    <ul className="grid">
      {movies.map((movie, i) => (
        <li key={`${movie.type}-${movie.id}`} style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
          <MovieCard movie={movie} isFavorite={isFavorite(movie)} onToggleFavorite={toggleFavorite} />
        </li>
      ))}
    </ul>
  )
}
