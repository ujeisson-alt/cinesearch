export default function EmptyState({ emoji = '🎬', title, children, action }) {
  return (
    <div className="state">
      <div className="state__emoji" aria-hidden="true">{emoji}</div>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}
