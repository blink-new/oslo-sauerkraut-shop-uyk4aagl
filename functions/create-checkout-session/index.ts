import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (req) => {
  // Handle CORS for frontend calls
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  try {
    const { line_items, customer_info, success_url, cancel_url } = await req.json()

    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('Missing Stripe secret key')
    }

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'success_url': success_url,
        'cancel_url': cancel_url,
        'customer_email': customer_info.email,
        'billing_address_collection': 'required',
        'shipping_address_collection[allowed_countries][0]': 'NO',
        'phone_number_collection[enabled]': 'true',
        'metadata[customer_name]': customer_info.name,
        'metadata[customer_phone]': customer_info.phone,
        'metadata[shipping_address]': customer_info.address,
        'metadata[shipping_city]': customer_info.city,
        'metadata[shipping_postal_code]': customer_info.postalCode,
        ...line_items.reduce((acc: Record<string, string>, item: any, index: number) => {
          acc[`line_items[${index}][price_data][currency]`] = item.price_data.currency
          acc[`line_items[${index}][price_data][product_data][name]`] = item.price_data.product_data.name
          acc[`line_items[${index}][price_data][product_data][description]`] = item.price_data.product_data.description || ''
          if (item.price_data.product_data.images && item.price_data.product_data.images[0]) {
            acc[`line_items[${index}][price_data][product_data][images][0]`] = item.price_data.product_data.images[0]
          }
          acc[`line_items[${index}][price_data][unit_amount]`] = item.price_data.unit_amount.toString()
          acc[`line_items[${index}][quantity]`] = item.quantity.toString()
          return acc
        }, {})
      })
    })

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text()
      console.error('Stripe API error:', errorText)
      throw new Error(`Stripe API error: ${stripeResponse.status}`)
    }

    const session = await stripeResponse.json()

    return new Response(JSON.stringify({
      url: session.url,
      sessionId: session.id
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    return new Response(JSON.stringify({
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
})