import GenreFilter from './GenreFilter'
import './Filters.css'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1949 }, (_, i) => CURRENT_YEAR - i)
const RATINGS = [9, 8, 7, 6, 5, 4]

export default function Filters({ type, genre, year, minRating, onChange, onClear }) {
  const hasFilters = Boolean(genre || year || minRating)
  return (
    <div className="filters" aria-label="Filtros">
      <div className="filters__types" role="radiogroup" aria-label="Tipo de contenido">
        {[['movie', 'Películas'], ['tv', 'Series']].map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={type === value}
            className={`chip ${type === value ? 'chip--active' : ''}`}
            onClick={() => onChange({ tipo: value === 'tv' ? 'tv' : '', genero: '' })}
          >
            {label}
          </button>
        ))}
      </div>

      <GenreFilter type={type} value={genre} onChange={(v) => onChange({ genero: v })} />

      <label className="field">
        <span className="field__label">Año de estreno</span>
        <select value={year} onChange={(e) => onChange({ anio: e.target.value })}>
          <option value="">Cualquiera</option>
          {YEARS.map((y) => (<option key={y} value={y}>{y}</option>))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Puntuación mínima</span>
        <select value={minRating} onChange={(e) => onChange({ rating: e.target.value })}>
          <option value="">Cualquiera</option>
          {RATINGS.map((r) => (<option key={r} value={r}>★ {r}+</option>))}
        </select>
      </label>

      {hasFilters && (
        <button type="button" className="btn btn--ghost filters__clear" onClick={onClear}>
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
