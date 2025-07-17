import { Button } from '@/components/ui/button'
import { ArrowDown } from 'lucide-react'

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Autentisk Norsk
            <span className="text-primary block">Sauerkraut</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Håndlaget fermentert kål fra Oslo-regionen. 
            Tradisjonelle oppskrifter møter moderne kvalitet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Se Produkter
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Vår Historie
            </Button>
          </div>

          {/* Health Benefits Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Probiotika</h3>
              <p className="text-gray-600 text-sm">Naturlige melkesyrebakterier for god tarmhelse</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Vitamin C</h3>
              <p className="text-gray-600 text-sm">Høyt innhold av naturlig vitamin C</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Fiber</h3>
              <p className="text-gray-600 text-sm">Rik på kostfiber for god fordøyelse</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-gray-400" />
      </div>
    </section>
  )
}