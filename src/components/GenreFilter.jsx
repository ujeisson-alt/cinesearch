import { useGenres } from '../hooks/useGenres'

/** Select con la lista de géneros traída de /genre/{type}/list */
export default function GenreFilter({ type = 'movie', value, onChange }) {
  const genres = useGenres(type)
  return (
    <label className="field">
      <span className="field__label">Género</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Todos</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>
    </label>
  )
}
