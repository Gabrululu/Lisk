import type { Product } from '../types'
import { formatPEN } from '../utils/format'

type Props = {
  product: Product
  onAdd: (p: Product) => void
}

export default function ProductCard({ product, onAdd }: Props) {
  const { name, price, category, image, inStock, unit } = product

  return (
    <article className="card card--interactive p-4 flex flex-col">
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-xl img-surface border"
        style={{ borderColor: 'rgb(var(--border))' }}
      >
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-contain p-3" />
        ) : (
          <div className="absolute inset-0 grid place-content-center text-5xl">🛒</div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <div className="text-xs" style={{ color: 'rgb(var(--muted))' }}>{category}</div>
        <h3 className="font-semibold leading-tight">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{formatPEN(price)}</span>
          {unit && <span className="text-xs" style={{ color: 'rgb(var(--muted))' }}>· {unit}</span>}
        </div>
      </div>

      <div className="mt-3">
        <button
          className="btn btn-primary w-full disabled:opacity-50"
          onClick={() => onAdd(product)}
          disabled={!inStock}
        >
          {inStock ? 'Agregar al carrito' : 'Sin stock'}
        </button>
      </div>
    </article>
  )
}
