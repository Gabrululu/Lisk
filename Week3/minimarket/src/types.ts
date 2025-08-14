export type Product = {
  id: string
  name: string
  price: number // PEN
  category: 'Bebidas' | 'Snacks' | 'Dulces' | 'Galletas'
  image?: string
  inStock: boolean
  unit?: string
}

export type CartItem = {
  product: Product
  qty: number
}
