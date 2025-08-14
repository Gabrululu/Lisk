import { useEffect, useMemo, useReducer } from 'react'
import type { CartItem, Product } from '../types'

// acciones
type Action =
  | { type: 'ADD'; product: Product }
  | { type: 'INC'; id: string }
  | { type: 'DEC'; id: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'CLEAR' }

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const idx = state.findIndex(ci => ci.product.id === action.product.id)
      if (idx >= 0) {
        const copy = [...state]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 }
        return copy
      }
      return [...state, { product: action.product, qty: 1 }]
    }
    case 'INC':
      return state.map(ci =>
        ci.product.id === action.id ? { ...ci, qty: ci.qty + 1 } : ci
      )
    case 'DEC':
      return state.map(ci =>
        ci.product.id === action.id ? { ...ci, qty: Math.max(1, ci.qty - 1) } : ci
      )
    case 'REMOVE':
      return state.filter(ci => ci.product.id !== action.id)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

const STORAGE_KEY = 'minimarket:cart'

export function useCart() {
  const [cart, dispatch] = useReducer(reducer, [], () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CartItem[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const total = useMemo(
    () => cart.reduce((acc, ci) => acc + ci.qty * ci.product.price, 0),
    [cart]
  )
  const count = useMemo(
    () => cart.reduce((acc, ci) => acc + ci.qty, 0),
    [cart]
  )

  return { cart, dispatch, total, count }
}
