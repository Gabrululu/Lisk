import { useEffect, useRef } from 'react'
import { formatPEN } from '../utils/format'
import type { CartItem } from '../types'

type Props = {
  open: boolean
  onClose: () => void
  items: CartItem[]
  onInc: (id: string) => void
  onDec: (id: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onCheckout: () => void
  total: number
}

export default function Cart({ open, onClose, items, onInc, onDec, onRemove, onClear, onCheckout, total }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    setTimeout(() => titleRef.current?.focus(), 0)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/30 dark:bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <aside
        role="dialog" aria-modal="true" aria-labelledby="cart-title"
        className={`absolute right-0 top-0 h-full w-full max-w-md shadow-xl transition-transform duration-300
                    ${open ? 'translate-x-0' : 'translate-x-full'} card p-0`}
      >
        <div className="flex items-center justify-between border-b border-[rgb(var(--border))] p-4">
          <h2 id="cart-title" ref={titleRef} tabIndex={-1} className="text-lg font-semibold outline-none">Tu carrito</h2>
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>

        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {items.length === 0 && <div className="text-zinc-600 dark:text-zinc-400 text-sm">Aún no agregas productos.</div>}
          {items.map(ci => (
            <div key={ci.product.id} className="card p-3">
              <div className="flex items-center gap-3">
                {ci.product.image ? (
                  <img src={ci.product.image} alt={ci.product.name} className="size-14 object-contain rounded-lg bg-[rgb(var(--surface-2))]" />
                ) : (
                  <div className="size-14 grid place-content-center rounded-lg bg-[rgb(var(--surface-2))]">🛒</div>
                )}
                <div className="flex-1">
                  <div className="font-medium leading-tight">{ci.product.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{formatPEN(ci.product.price)} c/u</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost" onClick={() => onDec(ci.product.id)}>-</button>
                  <div className="w-8 text-center font-semibold">{ci.qty}</div>
                  <button className="btn btn-ghost" onClick={() => onInc(ci.product.id)}>+</button>
                </div>
                <div className="w-20 text-right font-semibold">{formatPEN(ci.qty * ci.product.price)}</div>
                <button className="ml-2 text-zinc-400 hover:text-red-500" onClick={() => onRemove(ci.product.id)} aria-label="Eliminar">✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto border-t border-[rgb(var(--border))] p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Total</span>
            <span className="text-lg font-bold">{formatPEN(total)}</span>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost flex-1" onClick={onClear} disabled={items.length===0}>Vaciar</button>
            <button className="btn btn-primary flex-1" disabled={items.length===0} onClick={onCheckout}>Pagar</button>
          </div>
        </div>
      </aside>
    </div>
  )
}
