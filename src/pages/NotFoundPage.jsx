import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

export default function NotFoundPage() {
  return (
    <div className="container page">
      <EmptyState emoji="🎬" title="Esta escena no existe" action={<Link to="/" className="btn btn--primary">Volver al inicio</Link>}>
        La página que buscás no está disponible (error 404).
      </EmptyState>
    </div>
  )
}
