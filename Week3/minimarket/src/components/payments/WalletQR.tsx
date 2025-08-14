import { useEffect, useMemo, useState } from 'react'
import QRCode from 'react-qr-code'

type Props = {
  amount: number
  orderId: string
  onPaid: () => void
  seconds?: number
}

export default function WalletQR({ amount, orderId, onPaid, seconds = 10 }: Props) {
  const payload = useMemo(() => {
    // payload simple para demo: esquema ficticio "yape:"
    return `yape:minimarket?order=${orderId}&amount=${amount.toFixed(2)}&currency=PEN`
  }, [orderId, amount])

  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    setLeft(seconds)
  }, [payload, seconds])

  useEffect(() => {
    const t = setInterval(() => setLeft(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-3">
      <div className="text-sm" style={{ color: 'rgb(var(--muted))' }}>
        Escanea con <strong>Yape</strong> o <strong>Plin</strong> y confirma.
      </div>

      <div className="grid place-items-center">
        <div className="bg-white p-3 rounded-xl">
          <QRCode value={payload} size={160} />
        </div>
      </div>

      <div className="text-xs" style={{ color: 'rgb(var(--muted))' }}>
        Orden <strong>{orderId}</strong> · Monto <strong>S/ {amount.toFixed(2)}</strong>
      </div>

      <button className="btn btn-primary w-full" onClick={onPaid}>
        Ya pagué con Yape/Plin
      </button>

      <div className="text-xs" style={{ color: 'rgb(var(--muted))' }}>
        Este QR expira en {left}s (demo).
      </div>
    </div>
  )
}
