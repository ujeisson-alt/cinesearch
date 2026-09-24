import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import MovieGrid from '../components/MovieGrid'
import { useFavorites } from '../context/FavoritesContext'

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites()
  const [filter, setFilter] = useState('all')

  const visible = filter === 'all' ? favorites : favorites.filter((f) => f.type === filter)
  const counts = {
    all: favorites.length,
    movie: favorites.filter((f) => f.type === 'movie').length,
    tv: favorites.filter((f) => f.type === 'tv').length,
  }

  if (favorites.length === 0) {
    return (
      <div className="container page">
        <EmptyState
          emoji="💔"
          title="Todavía no tenés favoritos"
          action={<Link to="/" className="btn btn--primary">Explorar títulos</Link>}
        >
          Tocá el corazón de cualquier película o serie para guardarla acá. Tus favoritos se guardan en este navegador,
          así que siguen aunque recargues la página.
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="container page">
      <header className="page__header page__header--row">
        <div>
          <h1>Mis favoritos</h1>
          <p className="page__subtitle">{favorites.length} título{favorites.length !== 1 && 's'} guardado{favorites.length !== 1 && 's'}</p>
        </div>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => window.confirm('¿Seguro que querés borrar todos tus favoritos?') && clearFavorites()}
        >
          Borrar todos
        </button>
      </header>

      <div className="page__tabs" role="tablist">
        {[['all', 'Todos'], ['movie', 'Películas'], ['tv', 'Series']].map(([value, label]) => (
          <button key={value} type="button" role="tab" aria-selected={filter === value} className={`chip ${filter === value ? 'chip--active' : ''}`} onClick={() => setFilter(value)}>
            {label} <span className="chip__count">{counts[value]}</span>
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <MovieGrid movies={visible} />
      ) : (
        <EmptyState emoji="🎞️" title={`No tenés ${filter === 'tv' ? 'series' : 'películas'} en favoritos`} />
      )}
    </div>
  )
}
