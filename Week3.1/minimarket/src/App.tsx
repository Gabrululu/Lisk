import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
const Cart = lazy(() => import('./components/Cart'))
import Checkout from './components/Checkout'
import { useCart } from './hooks/useCart'
import { useDebounce } from './hooks/useDebounce'
import { useDarkMode } from './hooks/useDarkMode'
import type { Product } from './types'

export default function App() {
  const { cart, dispatch, total, count } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [q, setQ] = useState('')
  const dq = useDebounce(q, 250)

  const [cat, setCat] = useState<'Todos' | Product['category']>('Todos')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const { theme, toggle } = useDarkMode()

  useEffect(() => {
    import('./data/data.json')
      .then(m => setProducts(m.default as Product[]))
      .catch(() => setError('No se pudo cargar el catálogo'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(
    () => ['Todos', 'Bebidas', 'Snacks', 'Dulces', 'Galletas'] as const,
    []
  )

  const filtered = useMemo(() => {
    return products.filter(p =>
      (cat === 'Todos' || p.category === cat) &&
      p.name.toLowerCase().includes(dq.toLowerCase())
    )
  }, [products, dq, cat])

  return (
    <div className="min-h-dvh">
      <Header
        onOpenCart={() => setCartOpen(true)}
        itemsCount={count}
        total={total}
        theme={theme}
        onToggleTheme={toggle}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* ✅ Toolbar negra en dark */}
        <section className="toolbar">
          <input
            className="input flex-1 min-w-48"
            placeholder="Buscar productos"
            value={q}
            onChange={e => setQ(e.target.value)}
            aria-label="Buscar productos"
          />
          <select
            className="input w-auto"
            value={cat}
            onChange={e => setCat(e.target.value as any)}
            aria-label="Filtrar por categoría"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </section>

        {error && <div className="card p-4 text-red-500">{error}</div>}

        <section>
          <h2 className="sr-only">Productos</h2>

          {/* ✅ Skeleton visible en negro */}
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card p-3 animate-pulse">
                  <div className="aspect-[4/3] rounded-xl bg-[rgb(var(--surface-2))] dark:bg-white/10" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-24 bg-[rgb(var(--surface-2))] dark:bg-white/10 rounded" />
                    <div className="h-4 w-40 bg-[rgb(var(--surface-2))] dark:bg-white/10 rounded" />
                    <div className="h-6 w-20 bg-[rgb(var(--surface-2))] dark:bg-white/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={product => dispatch({ type: 'ADD', product })}
                />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="card p-6 text-center" style={{ color: 'rgb(var(--muted))' }}>
              No encontramos resultados para <strong>{dq}</strong> en {cat}. Prueba con otro término o categoría.
            </div>
          )}
        </section>
      </main>

      <Suspense fallback={null}>
        <Cart
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cart}
          onInc={id => dispatch({ type: 'INC', id })}
          onDec={id => dispatch({ type: 'DEC', id })}
          onRemove={id => dispatch({ type: 'REMOVE', id })}
          onClear={() => dispatch({ type: 'CLEAR' })}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
          total={total}
        />
      </Suspense>

      <Checkout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        total={total}
        onDone={() => dispatch({ type: 'CLEAR' })}
      />
    </div>
  )
}
