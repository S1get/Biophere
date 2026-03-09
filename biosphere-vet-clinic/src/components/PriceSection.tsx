import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DollarSign, AlertCircle } from 'lucide-react'

export function PriceSection() {
  return (
    <section id="prices" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-biosphere-warm/10 rounded-full mb-4">
            <DollarSign className="h-8 w-8 text-biosphere-warm" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Прейскурант услуг
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Актуальный прейскурант на услуги ветеринарной клиники Биосфера.
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white dark:bg-gray-800 overflow-hidden h-[800px] w-full">
          <CardContent className="p-0 h-full relative">
            <iframe 
              src="https://p.bios.re/pricelist/services?onlySearch=true" 
              className="w-full h-full border-0"
              title="Прейскурант услуг Биосфера"
              loading="lazy"
              allowFullScreen
            />
          </CardContent>
        </Card>
        
        <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Обратите внимание: цены могут меняться. Точную стоимость услуг уточняйте у администраторов клиники или по телефону.
          </p>
        </div>
      </div>
    </section>
  )
}
