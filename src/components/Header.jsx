import { Link, NavLink } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { useTheme } from '../hooks/useTheme'
import { GridIcon, HeartIcon, HomeIcon, MoonIcon, SunIcon } from './Icons'
import './Header.css'

export default function Header() {
  const { favorites } = useFavorites()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo" aria-label="CineSearch, ir al inicio">
          <img src="/favicon.svg" alt="" width="32" height="32" />
          <span>Cine<strong>Search</strong></span>
        </Link>

        <nav className="nav" aria-label="Principal">
          <NavLink to="/" end className="nav__link">
            <HomeIcon /> <span>Inicio</span>
          </NavLink>
          <NavLink to="/resultados" className="nav__link">
            <GridIcon /> <span>Explorar</span>
          </NavLink>
          <NavLink to="/favoritos" className="nav__link">
            <HeartIcon /> <span>Favoritos</span>
            {favorites.length > 0 && <span className="nav__badge">{favorites.length}</span>}
          </NavLink>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </nav>
      </div>
    </header>
  )
}
