import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Package, Truck, Mail } from 'lucide-react'

export function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const session = urlParams.get('session_id')
    setSessionId(session)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-800">
            Takk for din bestilling!
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            Din betaling er mottatt og bestillingen er bekreftet.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {sessionId && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Bestillingsnummer:</p>
              <p className="font-mono text-sm">{sessionId}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Hva skjer nå?</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Bekreftelse sendt</h4>
                  <p className="text-sm text-muted-foreground">
                    Du vil motta en e-post med bestillingsdetaljer og sporingsinformasjon.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium">Pakking og klargjøring</h4>
                  <p className="text-sm text-muted-foreground">
                    Vi pakker din ferske sauerkraut med omhu for å sikre kvaliteten.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Truck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Levering</h4>
                  <p className="text-sm text-muted-foreground">
                    Forventet leveringstid er 2-3 virkedager til din adresse.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">Oppbevaringsinstruksjoner</h4>
            <p className="text-sm text-muted-foreground">
              Hold sauerkrauten kjølig (under 4°C) og konsumer innen 2 uker etter åpning. 
              Produktet kan holde seg friskt i opptil 6 måneder uåpnet.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Tilbake til forsiden
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/#products'}
              className="flex-1"
            >
              Handle mer
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Spørsmål om din bestilling? Kontakt oss på{' '}
              <a href="mailto:post@oslosauerkraut.no" className="text-primary hover:underline">
                post@oslosauerkraut.no
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}