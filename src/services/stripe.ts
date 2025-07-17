import { CartItem } from '@/types/product'
import { CustomerInfo } from '@/components/checkout/CheckoutForm'

export interface CheckoutSession {
  url: string
  sessionId: string
}

export async function createCheckoutSession(
  cartItems: CartItem[],
  customerInfo: CustomerInfo
): Promise<CheckoutSession> {
  try {
    // Calculate shipping
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const shippingCost = subtotal >= 500 ? 0 : 49

    // Prepare line items for Stripe
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'nok',
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: [item.product.image],
          metadata: {
            category: item.product.category,
            weight: item.product.weight
          }
        },
        unit_amount: item.product.price * 100 // Convert to øre (cents)
      },
      quantity: item.quantity
    }))

    // Add shipping as a line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'nok',
          product_data: {
            name: 'Frakt',
            description: 'Levering til din adresse'
          },
          unit_amount: shippingCost * 100
        },
        quantity: 1
      })
    }

    const response = await fetch('https://uyk4aagl--create-checkout-session.functions.blink.new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        line_items: lineItems,
        customer_info: customerInfo,
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cart`
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create checkout session')
    }

    const data = await response.json()
    return {
      url: data.url,
      sessionId: data.sessionId
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export function redirectToCheckout(checkoutUrl: string) {
  // Open in new tab for iframe compatibility
  window.open(checkoutUrl, '_blank')
}