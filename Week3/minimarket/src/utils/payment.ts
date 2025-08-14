// Utilidades de formato y validación para pagos

export function onlyDigits(s: string) {
  return (s || '').replace(/\D+/g, '')
}

// Luhn para tarjeta
export function luhnCheck(card: string) {
  const num = onlyDigits(card)
  let sum = 0
  let dbl = false
  for (let i = num.length - 1; i >= 0; i--) {
    let d = parseInt(num[i], 10)
    if (dbl) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    dbl = !dbl
  }
  return sum % 10 === 0 && num.length >= 13
}

export function detectBrand(card: string): 'Visa'|'Mastercard'|'Amex'|'Desconocida' {
  const n = onlyDigits(card)
  if (/^4\d{12,18}$/.test(n)) return 'Visa'
  if (/^5[1-5]\d{14}$/.test(n) || /^2(2[2-9]|[3-6]\d|7[01])\d{12}$/.test(n)) return 'Mastercard'
  if (/^3[47]\d{13}$/.test(n)) return 'Amex'
  return 'Desconocida'
}

// 1234 5678 9012 3456
export function formatCardNumber(v: string) {
  const d = onlyDigits(v).slice(0, 19)
  return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

// MM/YY
export function formatExpiry(v: string) {
  const d = onlyDigits(v).slice(0, 4)
  if (d.length <= 2) return d
  return d.slice(0, 2) + '/' + d.slice(2)
}

export function validateExpiry(exp: string) {
  const m = /^(\d{2})\/(\d{2})$/.exec(exp)
  if (!m) return false
  let [ , mm, yy ] = m
  const month = parseInt(mm, 10)
  if (month < 1 || month > 12) return false
  const now = new Date()
  const curYY = now.getFullYear() % 100
  const curMM = now.getMonth() + 1
  const year = parseInt(yy, 10)
  if (year < curYY) return false
  if (year === curYY && month < curMM) return false
  return true
}

export function validateCVV(cvv: string, brand: string) {
  const d = onlyDigits(cvv)
  return brand === 'Amex' ? d.length === 4 : d.length === 3
}
