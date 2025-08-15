import { useEffect, useMemo, useState } from 'react'
import type { CartItem } from '../types'
import { formatPEN } from '../utils/format'
import CardForm from './payments/CardForm'
import CashForm from './payments/CashForm'
import WalletQR from './payments/WalletQR'
import { clearCheckout, loadCheckout, saveCheckout, type SavedMethod } from '../utils/storage'

type Props = {
  open: boolean
  onClose: () => void
  items: CartItem[]
  total: number
  onDone: () => void 
}

type Method = 'card' | 'cash' | 'wallet'

export default function Checkout({ open, onClose, items, total, onDone }: Props) {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  
  const [remember, setRemember] = useState<boolean>(true)
  const [method, setMethod] = useState<Method>('card')

  
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState<{ id: string; message?: string } | null>(null)
  const [orderId, setOrderId] = useState('')

  const shipping = useMemo(() => (total >= 30 ? 0 : 7.5), [total])
  const grand = useMemo(() => total + shipping, [total, shipping])

  
  useEffect(() => {
    const saved = loadCheckout()
    if (saved) {
      setRemember(saved.remember ?? true)
    }
  }, [])

  
  useEffect(() => {
    if (!open) return
    setSuccess(null)
    setProcessing(false)
    setOrderId('ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase())

    const saved = loadCheckout()
    if (saved?.remember) {
      setName(saved.name || '')
      setEmail(saved.email || '')
      setAddress(saved.address || '')
      setMethod((saved.method as SavedMethod) || 'card')
    } else {
      setName(''); setEmail(''); setAddress(''); setMethod('card')
    }

    
    setTimeout(() => (document.getElementById('checkout-name') as HTMLInputElement | null)?.focus(), 0)
  }, [open])

  
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  
  useEffect(() => {
    if (!remember) return
    const hasAny = name.trim() || email.trim() || address.trim()
    if (!hasAny) return
    const timer = setTimeout(() => {
      saveCheckout({ name, email, address, method, remember })
    }, 300)
    return () => clearTimeout(timer)
  }, [name, email, address, method, remember])

  
  useEffect(() => {
    if (!remember) clearCheckout()
  }, [remember])

  const baseFormOk = name.trim().length > 2 && /\S+@\S+\.\S+/.test(email) && address.trim().length > 3

  
  async function handleCardPay(payload: { token: string; brand: string; last4: string }) {
    if (!baseFormOk) return
    setProcessing(true)
    await new Promise(r => setTimeout(r, 1000))
    setSuccess({ id: orderId, message: `Tarjeta ${payload.brand} •••• ${payload.last4}` })
    setProcessing(false)
    onDone()
    
    if (!remember) clearCheckout()
  }

  async function handleCashPay(payload: { given: number; change: number }) {
    if (!baseFormOk) return
    setProcessing(true)
    await new Promise(r => setTimeout(r, 700))
    setSuccess({ id: orderId, message: `Efectivo: recibido S/ ${payload.given.toFixed(2)} · Vuelto S/ ${payload.change.toFixed(2)}` })
    setProcessing(false)
    onDone()
    if (!remember) clearCheckout()
  }

  async function handleWalletPaid() {
    if (!baseFormOk) return
    setProcessing(true)
    await new Promise(r => setTimeout(r, 800))
    setSuccess({ id: orderId, message: 'Pago confirmado vía Yape/Plin' })
    setProcessing(false)
    onDone()
    if (!remember) clearCheckout()
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'hidden'}`} role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-3xl card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 id="checkout-title" className="text-lg font-semibold">Checkout</h2>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cerrar</button>
          </div>

          {/* ÉXITO */}
          {success ? (
            <div className="text-center space-y-3">
              <div className="text-5xl">✅</div>
              <h3 className="text-xl font-semibold">¡Pago realizado!</h3>
              <p className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
                Orden <strong>{success.id}</strong>. {success.message}
              </p>
              <button type="button" className="btn btn-primary" onClick={onClose}>Volver a la tienda</button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* FORM DATOS + MÉTODO */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm block mb-1" htmlFor="checkout-name">Nombre y apellido</label>
                  <input id="checkout-name" className="input w-full" value={name} onChange={e=>setName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm block mb-1" htmlFor="checkout-email">Email</label>
                  <input id="checkout-email" className="input w-full" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm block mb-1" htmlFor="checkout-address">Dirección</label>
                  <input id="checkout-address" className="input w-full" value={address} onChange={e=>setAddress(e.target.value)} />
                </div>

                {/* Toggle recordar + borrar */}
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  <label htmlFor="remember" className="text-sm">Recordar mis datos para la próxima</label>
                  <button
                    type="button"
                    className="text-xs underline ml-auto"
                    onClick={() => { clearCheckout(); }}
                    title="Eliminar datos guardados"
                  >
                    Borrar guardados
                  </button>
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-sm mb-1">Método de pago</legend>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="pay" checked={method==='card'} onChange={()=>setMethod('card')} /> Tarjeta
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="pay" checked={method==='wallet'} onChange={()=>setMethod('wallet')} /> Yape / Plin (QR)
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="pay" checked={method==='cash'} onChange={()=>setMethod('cash')} /> Efectivo
                  </label>
                </fieldset>
              </div>

              {/* RESUMEN + FORM ESPECÍFICO */}
              <div className="space-y-3">
                <div className="card p-3">
                  <h4 className="font-semibold mb-2">Resumen</h4>
                  <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {items.map(ci => (
                      <li key={ci.product.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{ci.qty}× {ci.product.name}</span>
                        <span>{formatPEN(ci.qty * ci.product.price)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 border-t" style={{ borderColor: 'rgb(var(--border))' }}>
                    <div className="pt-3 space-y-1 text-sm">
                      <div className="flex justify-between"><span>Subtotal</span><span>{formatPEN(total)}</span></div>
                      <div className="flex justify-between"><span>Envío</span><span>{shipping === 0 ? 'Gratis' : formatPEN(shipping)}</span></div>
                      <div className="flex justify-between font-semibold text-base"><span>Total</span><span>{formatPEN(grand)}</span></div>
                    </div>
                  </div>
                </div>

                <div className="card p-3">
                  {method === 'card' && <CardForm amount={grand} onValid={handleCardPay} />}
                  {method === 'cash' && <CashForm total={grand} onValid={handleCashPay} />}
                  {method === 'wallet' && <WalletQR amount={grand} orderId={orderId} onPaid={handleWalletPaid} />}
                </div>

                {processing && <div className="text-sm" style={{ color: 'rgb(var(--muted))' }}>Procesando…</div>}
                <p className="text-xs" style={{ color: 'rgb(var(--muted))' }}>
                  Simulación de pago para demo. No se realiza ningún cobro real.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
