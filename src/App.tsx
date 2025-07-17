import { useState, useEffect } from 'react'
import { createClient } from '@blinkdotnew/sdk'
import { ShoppingCart, Menu, X, Star, Heart, Plus, Minus } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet'
import { CheckoutForm, CustomerInfo } from './components/checkout/CheckoutForm'
import { SuccessPage } from './components/pages/SuccessPage'
import { createCheckoutSession, redirectToCheckout } from './services/stripe'
import { products } from './data/products'
import { Product, CartItem } from './types/product'

const blink = createClient({
  projectId: 'oslo-sauerkraut-shop-uyk4aagl',
  authRequired: false
})

type Page = 'home' | 'checkout' | 'success'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  // Check URL for success page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('session_id')) {
      setCurrentPage('success')
    }
  }, [])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== id))
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = async (customerInfo: CustomerInfo) => {
    setIsCheckoutLoading(true)
    try {
      const session = await createCheckoutSession(cart, customerInfo)
      redirectToCheckout(session.url)
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Det oppstod en feil under bestillingen. Vennligst prøv igjen.')
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  const goToCheckout = () => {
    if (cart.length === 0) {
      alert('Handlekurven er tom')
      return
    }
    setCurrentPage('checkout')
  }

  // Render success page
  if (currentPage === 'success') {
    return <SuccessPage />
  }

  // Render checkout page
  if (currentPage === 'checkout') {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setCurrentPage('home')}
              className="text-xl font-bold text-primary"
            >
              ← Oslo Sauerkraut
            </Button>
          </div>
        </header>
        <CheckoutForm
          cartItems={cart}
          totalPrice={getTotalPrice()}
          onCheckout={handleCheckout}
          isLoading={isCheckoutLoading}
        />
      </div>
    )
  }

  // Render main home page
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            <h1 className="text-lg sm:text-xl font-bold text-primary">Oslo Sauerkraut</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">Hjem</a>
            <a href="#products" className="text-sm font-medium hover:text-primary transition-colors">Produkter</a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">Om Oss</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Kontakt</a>
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Handlekurv</SheetTitle>
                <SheetDescription>
                  {cart.length === 0 ? 'Din handlekurv er tom' : `${getTotalItems()} varer i kurven`}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 py-4 border-b">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-md object-cover" />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.product.price} kr</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {cart.length > 0 && (
                  <div className="pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span>{getTotalPrice()} kr</span>
                    </div>
                    <Button className="w-full mt-4" size="lg" onClick={goToCheckout}>
                      Gå til kassen
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto px-4 sm:px-6 py-4 space-y-2">
              <a 
                href="#home" 
                className="block py-3 text-sm font-medium hover:text-primary transition-colors border-b border-border/50"
                onClick={() => setIsMenuOpen(false)}
              >
                Hjem
              </a>
              <a 
                href="#products" 
                className="block py-3 text-sm font-medium hover:text-primary transition-colors border-b border-border/50"
                onClick={() => setIsMenuOpen(false)}
              >
                Produkter
              </a>
              <a 
                href="#about" 
                className="block py-3 text-sm font-medium hover:text-primary transition-colors border-b border-border/50"
                onClick={() => setIsMenuOpen(false)}
              >
                Om Oss
              </a>
              <a 
                href="#contact" 
                className="block py-3 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">Håndlaget i Oslo</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Autentisk
                  <span className="text-primary block">Sauerkraut</span>
                  fra hjertet av Norge
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Opplev den rene smaken av tradisjonell fermentering. Våre produkter er laget med kjærlighet, 
                  tålmodighet og de beste norske ingrediensene.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                  Utforsk produkter
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                  Vår historie
                </Button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Naturlig</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">6</div>
                  <div className="text-sm text-muted-foreground">Varianter</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Oslo</div>
                  <div className="text-sm text-muted-foreground">Produsert</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                <img 
                  src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop" 
                  alt="Fersk sauerkraut" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg border">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.9/5</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Fra 200+ fornøyde kunder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto">Våre Produkter</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">Fermentert med tradisjon</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hver krukke er håndlaget med omsorg og fermentert til perfeksjon. 
              Opplev den autentiske smaken av norsk håndverk.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute top-2 left-2">{product.category}</Badge>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Utsolgt</Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <CardDescription className="text-sm mb-3">
                    {product.description}
                  </CardDescription>
                  <div className="text-xs text-muted-foreground mb-3">
                    <strong>Ingredienser:</strong> {product.ingredients.join(', ')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong>Vekt:</strong> {product.weight}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">{product.price} kr</div>
                  <Button 
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="ml-auto"
                  >
                    {product.inStock ? 'Legg i kurv' : 'Utsolgt'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <Badge variant="secondary" className="w-fit mx-auto lg:mx-0">Vår Historie</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Tradisjon møter
                <span className="text-primary block">moderne kvalitet</span>
              </h2>
              <div className="space-y-4 text-muted-foreground text-sm sm:text-base">
                <p>
                  Oslo Sauerkraut ble grunnlagt av en familie med dyp respekt for tradisjonelle 
                  fermenteringsteknikker. Vi kombinerer århundregamle oppskrifter med moderne 
                  kvalitetsstandarder for å skape produkter som både smaker fantastisk og er 
                  utrolig sunne.
                </p>
                <p>
                  Hver krukke fermenteres naturlig i 3-4 uker, uten tilsetningsstoffer eller 
                  konserveringsmidler. Vi bruger kun de beste norske ingrediensene og følger 
                  strenge hygienestandarder for å sikre konsistent kvalitet.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 max-w-sm mx-auto lg:max-w-none lg:mx-0">
                <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">2019</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Grunnlagt</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">1000+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Krukker solgt</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 order-first lg:order-last">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=400&fit=crop" 
                alt="Fermentering prosess" 
                className="rounded-lg object-cover h-48 sm:h-64"
              />
              <img 
                src="https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=400&fit=crop" 
                alt="Håndverk" 
                className="rounded-lg object-cover h-48 sm:h-64 mt-4 sm:mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-primary text-primary-foreground py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="space-y-4 text-center sm:text-left lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold">Oslo Sauerkraut</h3>
              <p className="text-primary-foreground/80 text-sm sm:text-base">
                Autentisk fermentert sauerkraut laget med kjærlighet i Oslo.
              </p>
            </div>
            <div className="space-y-4 text-center sm:text-left">
              <h4 className="font-semibold text-sm sm:text-base">Produkter</h4>
              <ul className="space-y-2 text-primary-foreground/80 text-sm">
                <li>Klassisk Sauerkraut</li>
                <li>Krydret Sauerkraut</li>
                <li>Rødkål Sauerkraut</li>
                <li>Økologisk Sauerkraut</li>
              </ul>
            </div>
            <div className="space-y-4 text-center sm:text-left">
              <h4 className="font-semibold text-sm sm:text-base">Informasjon</h4>
              <ul className="space-y-2 text-primary-foreground/80 text-sm">
                <li>Om oss</li>
                <li>Leveringsinformasjon</li>
                <li>Returpolicy</li>
                <li>Personvern</li>
              </ul>
            </div>
            <div className="space-y-4 text-center sm:text-left">
              <h4 className="font-semibold text-sm sm:text-base">Kontakt</h4>
              <ul className="space-y-2 text-primary-foreground/80 text-sm">
                <li>post@oslosauerkraut.no</li>
                <li>+47 123 45 678</li>
                <li>Oslo, Norge</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-primary-foreground/60">
            <p className="text-xs sm:text-sm">&copy; 2024 Oslo Sauerkraut. Alle rettigheter reservert.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App