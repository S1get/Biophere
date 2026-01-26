import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'

const previewServices = [
  { name: 'Первичный прием', price: 'от 800', description: 'Осмотр и консультация врача, постановка предварительного диагноза' },
  { name: 'УЗИ диагностика', price: 'от 1200', description: 'Ультразвуковое исследование органов брюшной полости и сердца' },
  { name: 'Вакцинация', price: 'от 1200', description: 'Комплексная защита от инфекционных заболеваний с регистрацией' },
  { name: 'Хирургия', price: 'от 2500', description: 'Плановые и экстренные операции любой сложности' },
  { name: 'Стоматология', price: 'от 2000', description: 'Профессиональная чистка зубов ультразвуком и лечение' },
  { name: 'Лаборатория', price: 'от 800', description: 'Общий и биохимический анализы крови за 15 минут' },
]

export default function PricePreviewBlock() {
  return (
    <section id="main-prices" className="py-12 bg-gradient-to-br from-white via-[#f0f4ff] to-[#e3eaff] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-biosphere-primary/30 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-biosphere-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-biosphere-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-biosphere-primary/10 rounded-xl mb-4 rotate-6 hover:rotate-0 transition-all duration-500 shadow-inner">
            <DollarSign className="h-8 w-8 text-biosphere-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-biosphere-primary to-biosphere-secondary">услуги и цены</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Мы предлагаем полный спектр ветеринарных услуг по доступным ценам. Наша клиника оснащена современным оборудованием для точной диагностики и эффективного лечения.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {previewServices.map((service, idx) => (
            <Card key={idx} className={`group hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] transition-all duration-500 border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md overflow-hidden ${idx >= 3 ? 'hidden md:flex' : 'flex'} flex-col transform hover:-translate-y-2`}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-biosphere-primary to-biosphere-secondary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-biosphere-primary/10 transition-colors">
                      <Stethoscope className="w-5 h-5 text-biosphere-primary" />
                    </div>
                    <Badge variant="outline" className="border-biosphere-primary/20 text-biosphere-primary text-[10px] px-2 py-0">Популярное</Badge>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg lg:text-xl mb-2 group-hover:text-biosphere-primary transition-colors">
                    {service.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Стоимость</span>
                    <span className="text-xl font-black text-biosphere-primary">
                      {service.price} ₽
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-biosphere-primary/20 flex items-center justify-center text-biosphere-primary group-hover:bg-biosphere-primary group-hover:text-white group-hover:border-biosphere-primary transition-all duration-300 transform group-hover:rotate-[360deg]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/pricelist" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-biosphere-primary/40 hover:scale-105 transition-all duration-300 group"
          >
            <span>Посмотреть весь прайс-лист</span>
            <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
} 
