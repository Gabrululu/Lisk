import { formatPEN } from '../utils/format'

type Props = {
  onOpenCart: () => void
  itemsCount: number
  total: number
  theme: 'light' | 'dark' | 'system'
  onToggleTheme: () => void
}

export default function Header({ onOpenCart, itemsCount, total, theme, onToggleTheme }: Props) {
  const isDark = theme === 'dark'
  return (
    <header
      className="sticky top-0 z-20 backdrop-blur border-b"
      style={{
        
        backgroundColor: isDark ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,.9)',
        borderColor: 'rgb(var(--border))',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="size-9 grid place-content-center rounded-xl bg-blue-600 text-white font-bold">M</div>
          <h1 className="text-lg font-semibold">MiniMarket</h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Toggle tema */}
          <button
            className="btn btn-ghost"
            aria-label="Cambiar tema"
            aria-pressed={isDark}
            onClick={onToggleTheme}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Accesibilidad */}
          <span className="sr-only" aria-live="polite">Carrito: {itemsCount} ítems, total {formatPEN(total)}</span>

          <span className="badge">{itemsCount} items</span>
          <span className="badge">{formatPEN(total)}</span>
          <button className="btn btn-primary" onClick={onOpenCart} aria-label="Abrir carrito">
            Ver carrito
          </button>
        </div>
      </div>
    </header>
  )
}
