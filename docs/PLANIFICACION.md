# CineSearch — Planificación (Semana 1)

## 1. Definición del proyecto

**Cliente:** StreamBit S.A. (streaming, 180.000 usuarios en AR, CL y UY).
**Problema:** el 43 % de las sesiones termina sin reproducción porque el buscador es lento, no tiene filtros útiles y no recuerda preferencias.
**Objetivo:** prototipo funcional de un buscador que permita encontrar qué ver en **menos de 2 minutos**.

### Alcance

| Funcionalidad | Prioridad | Estado |
|---|---|---|
| Búsqueda de películas y series por título | Obligatorio | ✅ |
| Filtro por género | Obligatorio | ✅ |
| Filtro por año de estreno y puntuación | Obligatorio | ✅ |
| Detalle (sinopsis, reparto, tráiler) | Obligatorio | ✅ |
| Favoritos con persistencia (localStorage) | Obligatorio | ✅ |
| Diseño responsive (375 / 768 / desktop) | Obligatorio | ✅ |
| Paginado de resultados | Recomendado | ✅ |
| Historial de búsquedas recientes | Recomendado | ✅ |
| Modo oscuro / claro | Opcional | ✅ |

### Endpoints de TMDb utilizados

| Uso | Endpoint |
|---|---|
| Buscar películas | `GET /search/movie?query=&page=&primary_release_year=` |
| Buscar series | `GET /search/tv?query=&page=&first_air_date_year=` |
| Explorar con filtros (sin texto) | `GET /discover/{movie|tv}?with_genres=&vote_average.gte=&primary_release_year=` |
| Géneros | `GET /genre/movie/list` y `GET /genre/tv/list` |
| Detalle + reparto + tráiler | `GET /{movie|tv}/{id}?append_to_response=credits,videos` |
| Populares (Home) | `GET /trending/{movie|tv}/week` |
| Imágenes | `https://image.tmdb.org/t/p/{w342|w500|w1280}{path}` |

> Nota técnica: `/search` no filtra por género ni puntuación, así que esos dos filtros se aplican en el cliente sobre la página de resultados. Cuando no hay texto se usa `/discover`, donde todos los filtros se aplican en el servidor.

### Vistas

| Ruta | Página | Contenido |
|---|---|---|
| `/` | Home | Hero + buscador + búsquedas recientes + populares de la semana |
| `/resultados` | Resultados | Buscador + filtros + grilla + paginado (los filtros viven en la URL) |
| `/pelicula/:id` · `/serie/:id` | Detalle | Backdrop, póster, datos, géneros, sinopsis, tráiler, reparto |
| `/favoritos` | Favoritos | Grilla de favoritos con pestañas Todos / Películas / Series |

## 2. Diseño y arquitectura

### Wireframes

```
HOME (desktop)                               RESULTADOS
┌────────────────────────────────────────┐   ┌────────────────────────────────────────┐
│ [logo] CineSearch     Inicio Explorar ♥ ☀│   │ [logo]                Inicio Explorar ♥ ☀│
├────────────────────────────────────────┤   ├────────────────────────────────────────┤
│          PROTOTIPO · STREAMBIT          │   │ [🔍 buscar......................][Buscar]│
│   Encontrá qué ver en menos de 2 min    │   │ Resultados para "..."   230 encontradas │
│        [Películas] [Series]             │   │ ┌──────────────────────────────────────┐│
│  [🔍 buscar...................][Buscar] │   │ │[Pelis][Series]  Género▾ Año▾ Puntaje▾ ││
│  Recientes: (relatos) (okupas)          │   │ └──────────────────────────────────────┘│
│                                         │   │ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐                 │
│ 🔥 Populares de la semana     Ver todo →│   │ │  ││  ││  ││  ││  ││  │   MovieCard x20  │
│ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐                │   │ └──┘└──┘└──┘└──┘└──┘└──┘                 │
│ │♥ ││♥ ││♥ ││♥ ││♥ ││♥ │                │   │        ‹ 1 2 3 … 12 ›                   │
│ │★7││★8││  ││  ││  ││  │                │   └────────────────────────────────────────┘
│ └──┘└──┘└──┘└──┘└──┘└──┘                │
└────────────────────────────────────────┘

DETALLE (2 columnas → 1 en mobile)           FAVORITOS
┌────────────────────────────────────────┐   ┌────────────────────────────────────────┐
│ ← Volver          (backdrop difuminado) │   │ Mis favoritos             [Borrar todos]│
│ ┌───────┐  PELÍCULA                     │   │ (Todos 5) (Películas 3) (Series 2)      │
│ │       │  Título (2014)                │   │ ┌──┐┌──┐┌──┐┌──┐┌──┐                     │
│ │ póster│  ★ 8.1/10 · fecha · 2h 2min   │   │ └──┘└──┘└──┘└──┘└──┘                     │
│ │       │  [Drama] [Comedia]            │   │ Vacío → 💔 "Todavía no tenés favoritos" │
│ └───────┘  [▶ Ver tráiler] [♥ Favorito] │   │         [Explorar títulos]              │
│            Sinopsis ...                 │   └────────────────────────────────────────┘
│ Reparto: (o) (o) (o) (o) (o) (o)        │
└────────────────────────────────────────┘
```

### Guía de estilos

| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| `--color-primary` | `#e11d48` | `#e11d48` | Botones, links, favoritos |
| `--color-accent` | `#f59e0b` | `#f59e0b` | Estrellas / puntuación |
| `--color-bg` | `#0f1115` | `#f7f7f9` | Fondo |
| `--color-surface` | `#171a21` | `#ffffff` | Cards, paneles |
| `--color-text` | `#f3f4f6` | `#111827` | Texto principal |
| `--color-text-muted` | `#9ca3af` | `#5b6474` | Texto secundario |

- **Tipografías:** Poppins 600/700 (títulos) · Inter 400–700 (texto).
- **Espaciado:** escala de 4 px (`--space-1` … `--space-16`).
- **Bordes:** 6 / 10 / 16 px y pill (999 px).
- **Breakpoints:** 375 px (mobile), 768 px (tablet), 1240 px (contenedor máx.).
- **Accesibilidad:** tap targets ≥ 44 px, `:focus-visible`, skip-link, `aria-*` en botones de ícono, respeta `prefers-reduced-motion`.

### Componentes de React

```
App
├── Header ─ logo · NavLink ×3 · contador de favoritos · toggle de tema
├── HomePage
│   ├── SearchBar (input controlado, Películas/Series, historial)
│   └── TrendingSection → MovieGrid → MovieCard
├── ResultsPage
│   ├── SearchBar
│   ├── Filters → GenreFilter · select Año · select Puntuación
│   ├── MovieGrid → MovieCard
│   └── Pagination
├── MovieDetailPage (useParams) → modal de tráiler
├── FavoritesPage → MovieGrid
├── LoadingSpinner · ErrorMessage · EmptyState
└── Footer
```

**Estado global:** `FavoritesContext` (favoritos) e `HistoryContext` (búsquedas recientes), ambos persistidos con el hook `useLocalStorage`.
**Hooks:** `useMovies` (búsqueda + filtros + paginado), `useFetch` (genérico con cancelación), `useGenres` (con caché), `useTheme`.
