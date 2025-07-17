import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Loader2, CreditCard, Truck, Shield } from 'lucide-react'
import { CartItem } from '@/types/product'

interface CheckoutFormProps {
  cartItems: CartItem[]
  totalPrice: number
  onCheckout: (customerInfo: CustomerInfo) => Promise<void>
  isLoading: boolean
}

export interface CustomerInfo {
  email: string
  name: string
  address: string
  city: string
  postalCode: string
  phone: string
}

export function CheckoutForm({ cartItems, totalPrice, onCheckout, isLoading }: CheckoutFormProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: '',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  })

  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {}

    if (!customerInfo.email) newErrors.email = 'E-post er påkrevd'
    if (!customerInfo.name) newErrors.name = 'Navn er påkrevd'
    if (!customerInfo.address) newErrors.address = 'Adresse er påkrevd'
    if (!customerInfo.city) newErrors.city = 'By er påkrevd'
    if (!customerInfo.postalCode) newErrors.postalCode = 'Postnummer er påkrevd'
    if (!customerInfo.phone) newErrors.phone = 'Telefon er påkrevd'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (customerInfo.email && !emailRegex.test(customerInfo.email)) {
      newErrors.email = 'Ugyldig e-postadresse'
    }

    // Norwegian postal code validation (4 digits)
    const postalCodeRegex = /^\d{4}$/
    if (customerInfo.postalCode && !postalCodeRegex.test(customerInfo.postalCode)) {
      newErrors.postalCode = 'Postnummer må være 4 siffer'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onCheckout(customerInfo)
    } catch (error) {
      console.error('Checkout error:', error)
    }
  }

  const updateField = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const shippingCost = totalPrice >= 500 ? 0 : 49
  const finalTotal = totalPrice + shippingCost

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Fullfør bestilling</h1>
        <p className="text-muted-foreground">
          Fyll ut informasjonen nedenfor for å fullføre kjøpet
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Customer Information Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Leveringsinformasjon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Fullt navn *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Ola Nordmann"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+47 123 45 678"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-postadresse *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="ola@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Storgata 1"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postnummer *</Label>
                  <Input
                    id="postalCode"
                    value={customerInfo.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    placeholder="0123"
                    maxLength={4}
                    className={errors.postalCode ? 'border-red-500' : ''}
                  />
                  {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">By *</Label>
                  <Input
                    id="city"
                    value={customerInfo.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Oslo"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Behandler...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Gå til betaling ({finalTotal} kr)
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Bestillingsoversikt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-4">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × {item.product.price} kr
                  </p>
                </div>
                <div className="font-medium">
                  {item.quantity * item.product.price} kr
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{totalPrice} kr</span>
              </div>
              <div className="flex justify-between">
                <span>Frakt:</span>
                <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                  {shippingCost === 0 ? 'Gratis' : `${shippingCost} kr`}
                </span>
              </div>
              {totalPrice < 500 && (
                <p className="text-sm text-muted-foreground">
                  Gratis frakt ved kjøp over 500 kr
                </p>
              )}
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{finalTotal} kr</span>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Sikker betaling med Stripe</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-blue-600" />
                <span>Levering 2-3 virkedager</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}