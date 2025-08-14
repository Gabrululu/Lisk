import { useMemo, useState } from 'react'
import {
  detectBrand,
  formatCardNumber,
  formatExpiry,
  luhnCheck,
  validateCVV,
  validateExpiry,
} from '../../utils/payment'

type Props = {
  amount: number
  onValid: (payload: { token: string; brand: string; last4: string }) => void
}

export default function CardForm({ amount, onValid }: Props) {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const brand = useMemo(() => detectBrand(number), [number])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs: string[] = []
    if (name.trim().length < 3) errs.push('Nombre muy corto.')
    if (!luhnCheck(number)) errs.push('Número de tarjeta inválido.')
    if (!validateExpiry(expiry)) errs.push('Fecha de expiración inválida.')
    if (!validateCVV(cvv, brand)) errs.push('CVV inválido.')
    setErrors(errs)
    if (errs.length === 0) {
      const last4 = number.replace(/\D/g, '').slice(-4)
      const token = 'tok_' + Math.random().toString(36).slice(2, 10)
      onValid({ token, brand, last4 })
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
        Pagarás con <strong>{brand}</strong> por <strong>S/ {amount.toFixed(2)}</strong>
      </div>

      <div>
        <label className="text-sm block mb-1">Nombre del titular</label>
        <input
          className="input w-full"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Como figura en la tarjeta"
        />
      </div>

      <div>
        <label className="text-sm block mb-1">Número de tarjeta</label>
        <input
          className="input w-full"
          inputMode="numeric"
          autoComplete="cc-number"
          value={number}
          onChange={e => setNumber(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
        />
      </div>

      {/* 👉 Grid con CVV angosto y contenido */}
      <div className="grid grid-cols-[1fr_112px] gap-3">
        <div>
          <label className="text-sm block mb-1">Expiración</label>
          <input
            className="input w-full"
            inputMode="numeric"
            autoComplete="cc-exp"
            value={expiry}
            onChange={e => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
          />
        </div>

        <div className="min-w-0">
          <label className="text-sm block mb-1">CVV</label>
          <input
            className="input w-full text-center"
            inputMode="numeric"
            autoComplete="cc-csc"
            value={cvv}
            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder={brand === 'Amex' ? 'CVV (4)' : 'CVV (3)'}
            aria-label="CVV"
          />
        </div>
      </div>

      {errors.length > 0 && (
        <ul className="text-sm text-red-500 list-disc pl-5">
          {errors.map((er, i) => (
            <li key={i}>{er}</li>
          ))}
        </ul>
      )}

      <button className="btn btn-primary w-full" type="submit">
        Pagar con tarjeta
      </button>
    </form>
  )
}
