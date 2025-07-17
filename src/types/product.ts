export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  weight: string
  ingredients: string[]
  nutritionFacts?: {
    calories: number
    protein: number
    carbs: number
    fiber: number
    sodium: number
  }
}

export interface CartItem {
  product: Product
  quantity: number
}