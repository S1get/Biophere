import { Card, CardContent } from '@/components/ui/card'
import { ShoppingBag, Pill, CheckCircle, ArrowRight } from 'lucide-react'

const pharmacyFeatures = [
  {
    title: 'Широкий ассортимент',
    desc: 'Лекарственные препараты, лечебные корма, витамины и средства ухода.',
    icon: <Pill className="h-6 w-6" />
  },
  {
    title: 'Только проверенные бренды',
    desc: 'Работаем напрямую с официальными дистрибьюторами мировых производителей.',
    icon: <CheckCircle className="h-6 w-6" />
  },
  {
    title: 'Консультация специалиста',
    desc: 'Наши фармацевты помогут подобрать нужный препарат по назначению врача.',
    icon: <ShoppingBag className="h-6 w-6" />
  }
]

export default function PharmacyPreviewBlock() {
  return (
    <section id="main-pharmacy" className="py-12 bg-gradient-to-br from-[#f8fafc] to-[#e6f9ef] dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-xl mb-6 rotate-3 hover:rotate-0 transition-all duration-500 shadow-inner">
              <ShoppingBag className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
              Ветаптека и <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">зоотовары</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-teal-500 mx-auto lg:mx-0 rounded-full mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed font-medium">
              В каждом нашем филиале работает специализированная аптека. Вам не нужно искать лекарства по всему городу — всё необходимое можно приобрести сразу после приема.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600">
                  <Pill className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200">Препараты</span>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200">Лечебные корма</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative group/image">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-1 group-hover:rotate-0 transition-all duration-700">
              <img 
                src="https://images.unsplash.com/photo-1583947581924-860bda6a26df?q=80&w=2067" 
                alt="Ветаптека Биосфера" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                  <p className="text-emerald-700 dark:text-emerald-400 font-bold mb-1">Всегда в наличии</p>
                  <p className="text-gray-900 dark:text-white text-sm font-medium">Более 2000 наименований товаров для здоровья ваших питомцев</p>
                </div>
              </div>
            </div>
            
            {/* Floating elements for extra style */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center animate-bounce duration-[3000ms]">
              <Pill className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {pharmacyFeatures.map((feature, idx) => (
            <Card key={idx} className="group border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-emerald-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
