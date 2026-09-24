import { Route, Routes, useParams } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import MovieDetailPage from './pages/MovieDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import ResultsPage from './pages/ResultsPage'

// key={id} fuerza a remontar la página al navegar entre títulos
function Detail({ type }) {
  const { id } = useParams()
  return <MovieDetailPage key={`${type}-${id}`} type={type} />
}

export default function App() {
  return (
    <div className="app">
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resultados" element={<ResultsPage />} />
          <Route path="/pelicula/:id" element={<Detail type="movie" />} />
          <Route path="/serie/:id" element={<Detail type="tv" />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
