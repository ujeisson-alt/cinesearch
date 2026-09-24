export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <div className="state__emoji" aria-hidden="true">⚠️</div>
      <h2>Algo salió mal</h2>
      <p>{error?.message || 'Ocurrió un error inesperado.'}</p>
      {onRetry && error?.status !== 401 && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>Reintentar</button>
      )}
    </div>
  )
}
