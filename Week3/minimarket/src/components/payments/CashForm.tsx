import { useMemo, useState } from 'react'
import { onlyDigits } from '../../utils/payment'

type Props = {
  total: number
  onValid: (payload: { given: number; change: number }) => void
}

export default function CashForm({ total, onValid }: Props) {
  const [given, setGiven] = useState('')

  const givenNumber = useMemo(() => parseFloat((onlyDigits(given) || '0')) / 100, [given])
  const change = useMemo(() => Math.max(0, givenNumber - total), [givenNumber, total])
  const canConfirm = givenNumber >= total

  return (
    <div className="space-y-3">
      <div className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
        Total a pagar: <strong>S/ {total.toFixed(2)}</strong>
      </div>

      <div>
        <label className="text-sm block mb-1">Con cuánto pagarás</label>
        <input
          className="input"
          inputMode="numeric"
          placeholder="Ej: 20.00"
          value={given}
          onChange={e => {
            
            const d = e.target.value.replace(/[^\d.]/g, '')
            setGiven(d)
          }}
        />
      </div>

      <div className="text-sm">
        {canConfirm
          ? <>Vuelto: <strong>S/ {change.toFixed(2)}</strong></>
          : <span className="text-red-500">El monto ingresado no cubre el total.</span>}
      </div>

      <button
        className="btn btn-primary w-full disabled:opacity-50"
        disabled={!canConfirm}
        onClick={() => onValid({ given: givenNumber, change })}
      >
        Confirmar pago en efectivo
      </button>
    </div>
  )
}
