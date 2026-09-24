// Capa de servicios: toda la comunicación con la API de TMDb vive acá.
// Docs: https://developer.themoviedb.org/reference/intro/getting-started

const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'
const LANGUAGE = 'es-MX'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

// TMDb acepta dos tipos de credencial:
//  - API Key v3 (32 caracteres) → va como query param ?api_key=
//  - Read Access Token v4 (JWT largo, empieza con "eyJ") → va como header Bearer
const isBearer = typeof API_KEY === 'string' && API_KEY.startsWith('eyJ')

export const hasApiKey = Boolean(API_KEY) && API_KEY !== 'tu_api_key_aqui'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, params = {}, { signal } = {}) {
  if (!hasApiKey) {
    throw new ApiError(
      'Falta la API Key de TMDb. Creá un archivo .env con VITE_TMDB_API_KEY y reiniciá el servidor.',
      401,
    )
  }

  const url = new URL(BASE_URL + path)
  url.searchParams.set('language', LANGUAGE)
  if (!isBearer) url.searchParams.set('api_key', API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value)
  })

  let response
  try {
    response = await fetch(url, {
      signal,
      headers: {
        accept: 'application/json',
        ...(isBearer ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError('No pudimos conectarnos. Revisá tu conexión a internet e intentá de nuevo.', 0)
  }

  if (!response.ok) {
    const messages = {
      401: 'La API Key de TMDb no es válida. Revisá tu archivo .env.',
      404: 'No encontramos lo que buscabas.',
      429: 'Demasiadas solicitudes. Esperá unos segundos e intentá de nuevo.',
    }
    throw new ApiError(messages[response.status] || 'Ocurrió un error inesperado en el servidor.', response.status)
  }

  return response.json()
}

// ---------- Helpers de imágenes ----------
export const posterUrl = (path, size = 'w342') => (path ? `${IMG_BASE}/${size}${path}` : null)
export const backdropUrl = (path, size = 'w1280') => (path ? `${IMG_BASE}/${size}${path}` : null)
export const profileUrl = (path, size = 'w185') => (path ? `${IMG_BASE}/${size}${path}` : null)

// ---------- Normalización ----------
// Películas y series tienen campos distintos (title vs name, release_date vs first_air_date).
// Las normalizamos a un único formato para que los componentes no tengan que saberlo.
export function normalize(item, type) {
  const mediaType = type || item.media_type || (item.title ? 'movie' : 'tv')
  const date = item.release_date || item.first_air_date || ''
  return {
    id: item.id,
    type: mediaType,
    title: item.title || item.name || 'Sin título',
    originalTitle: item.original_title || item.original_name || '',
    year: date ? Number(date.slice(0, 4)) : null,
    date,
    rating: typeof item.vote_average === 'number' ? Math.round(item.vote_average * 10) / 10 : 0,
    votes: item.vote_count || 0,
    overview: item.overview || '',
    posterPath: item.poster_path || null,
    backdropPath: item.backdrop_path || null,
    genreIds: item.genre_ids || (item.genres ? item.genres.map((g) => g.id) : []),
  }
}

const normalizeList = (data, type) => ({
  page: data.page,
  totalPages: Math.min(data.total_pages || 1, 500), // TMDb no deja pasar de la página 500
  totalResults: data.total_results || 0,
  results: (data.results || []).map((r) => normalize(r, type)),
})

// ---------- Endpoints ----------

/** Búsqueda por título: /search/movie o /search/tv */
export async function searchTitles({ query, type = 'movie', page = 1, year }, opts) {
  const yearParam = type === 'movie' ? { primary_release_year: year } : { first_air_date_year: year }
  const data = await request(`/search/${type}`, { query, page, include_adult: false, ...yearParam }, opts)
  return normalizeList(data, type)
}

/** Descubrir con filtros del lado del servidor (cuando no hay texto de búsqueda) */
export async function discoverTitles({ type = 'movie', page = 1, genre, year, minRating }, opts) {
  const params = {
    page,
    sort_by: 'popularity.desc',
    include_adult: false,
    with_genres: genre,
    'vote_average.gte': minRating,
    // Evita que aparezcan títulos con 1 solo voto de 10 puntos
    'vote_count.gte': minRating ? 50 : undefined,
  }
  if (type === 'movie') params.primary_release_year = year
  else params.first_air_date_year = year
  const data = await request(`/discover/${type}`, params, opts)
  return normalizeList(data, type)
}

/** Populares de la semana para la Home */
export async function getTrending(type = 'movie', opts) {
  const data = await request(`/trending/${type}/week`, {}, opts)
  return normalizeList(data, type)
}

/** Lista de géneros: /genre/movie/list o /genre/tv/list */
export async function getGenres(type = 'movie', opts) {
  const data = await request(`/genre/${type}/list`, {}, opts)
  return data.genres || []
}

/** Detalle completo con reparto y videos en una sola llamada */
export async function getDetails(type, id, opts) {
  const data = await request(
    `/${type}/${id}`,
    { append_to_response: 'credits,videos', include_video_language: 'es,en,null' },
    opts,
  )
  const base = normalize(data, type)
  const videos = data.videos?.results || []
  const trailer =
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.iso_639_1 === 'es') ||
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    videos.find((v) => v.site === 'YouTube')

  return {
    ...base,
    tagline: data.tagline || '',
    genres: data.genres || [],
    runtime: data.runtime || data.episode_run_time?.[0] || null,
    seasons: data.number_of_seasons || null,
    status: data.status || '',
    homepage: data.homepage || '',
    cast: (data.credits?.cast || []).slice(0, 12).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profilePath: c.profile_path,
    })),
    directors: (data.credits?.crew || []).filter((c) => c.job === 'Director').map((c) => c.name),
    creators: (data.created_by || []).map((c) => c.name),
    trailerKey: trailer ? trailer.key : null,
  }
}
