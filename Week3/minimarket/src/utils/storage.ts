// Helpers seguros para localStorage del Checkout

export type SavedMethod = 'card' | 'cash' | 'wallet'
export interface SavedCheckout {
  name: string
  email: string
  address: string
  method: SavedMethod
  remember: boolean
}

const KEY = 'mm_checkout_v1'

function canUseStorage() {
  try {
    const test = '__test__'
    window.localStorage.setItem(test, '1')
    window.localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

export function loadCheckout(): SavedCheckout | null {
  if (!canUseStorage()) return null
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as SavedCheckout) : null
  } catch {
    return null
  }
}

export function saveCheckout(data: SavedCheckout) {
  if (!canUseStorage()) return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    /* noop */
  }
}

export function clearCheckout() {
  if (!canUseStorage()) return
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}
