import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, ShoppingCart } from 'lucide-react'
import { products } from '@/data/products'
import { Product } from '@/types/product'

interface ProductsProps {
  onAddToCart: (product: Product) => void
}

export function Products({ onAddToCart }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle')
  
  const categories = ['Alle', 'Klassisk', 'Krydret', 'Premium', 'Spesial', 'Økologisk']
  
  const filteredProducts = selectedCategory === 'Alle' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Våre Produkter
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hver krukke er håndlaget med kjærlighet og tradisjonelle fermenterings-teknikker. 
            Alle produkter er laget av lokale, norske ingredienser.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge 
                    className="absolute top-4 left-4"
                    variant={product.category === 'Premium' || product.category === 'Økologisk' ? 'default' : 'secondary'}
                  >
                    {product.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {product.price} kr
                  </span>
                  <span className="text-sm text-gray-500">{product.weight}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Ingredienser:</p>
                  <p className="text-sm text-gray-600">{product.ingredients.join(', ')}</p>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <Button 
                  className="w-full"
                  onClick={() => onAddToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Legg i handlekurv' : 'Utsolgt'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}