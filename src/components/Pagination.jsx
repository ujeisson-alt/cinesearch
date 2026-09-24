import { ChevronIcon } from './Icons'

function pagesToShow(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1])
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p))
  const list = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  list.forEach((p, i) => {
    if (i > 0 && p - list[i - 1] > 1) out.push('…' + p)
    out.push(p)
  })
  return out
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <nav className="pagination" aria-label="Paginado">
      <button type="button" className="icon-btn" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Página anterior">
        <ChevronIcon dir="left" />
      </button>
      {pagesToShow(page, totalPages).map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="pagination__dots">…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={`pagination__page ${p === page ? 'is-active' : ''}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className="icon-btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Página siguiente">
        <ChevronIcon />
      </button>
    </nav>
  )
}
