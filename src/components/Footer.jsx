export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          <strong>CineSearch</strong> · Prototipo del motor de búsqueda de StreamBit S.A.
        </p>
        <p className="footer__tmdb">
          Datos e imágenes provistos por{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDb</a>. Este producto usa la API de TMDb
          pero no está respaldado ni certificado por TMDb.
        </p>
      </div>
    </footer>
  )
}
