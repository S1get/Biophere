import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Newspaper, Calendar, ArrowRight, Tag } from 'lucide-react'

const news = [
  {
    title: 'Открытие нового филиала на ул. Украинская, 18',
    date: '25.01.2026',
    category: 'Новости',
    desc: 'Рады сообщить об открытии нашего нового филиала! Современное оборудование и лучшие специалисты теперь еще ближе к вам в районе Украинской.',
    image: 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&q=80&w=2070',
    type: 'news'
  },
  {
    title: 'Сезонная защита: время вакцинации',
    date: 'Актуально',
    category: 'Советы',
    desc: 'Напоминаем о необходимости ежегодной вакцинации. Защитите своего любимца от опасных инфекций заранее. Запись открыта во всех филиалах.',
    image: 'https://images.unsplash.com/photo-1628033033904-944f23b99912?auto=format&fit=crop&q=80&w=2070',
    type: 'news'
  },
  {
    title: 'Новое оборудование в офтальмологическом кабинете',
    date: '10.01.2026',
    category: 'Новости',
    desc: 'Мы обновили диагностическую базу для лечения глазных заболеваний. Теперь обследование стало еще точнее и быстрее.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2080',
    type: 'news'
  }
]

export default function NewsPreviewBlock() {
  return (
    <section id="main-news" className="py-12 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-biosphere-primary/30 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-biosphere-primary/10 rounded-xl mb-4 -rotate-3 hover:rotate-0 transition-all duration-500 shadow-inner">
              <Newspaper className="h-8 w-8 text-biosphere-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Последние <span className="text-transparent bg-clip-text bg-gradient-to-r from-biosphere-primary to-biosphere-secondary">новости</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary rounded-full mb-6"></div>
          </div>
          <button className="hidden md:flex items-center gap-2 text-biosphere-primary font-bold hover:gap-3 transition-all mb-6">
            Все новости <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, idx) => (
            <Card key={idx} className="group border-0 shadow-xl bg-white dark:bg-gray-800 overflow-hidden flex flex-col transform hover:-translate-y-2 transition-all duration-500">
              <div className="h-52 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`${item.type === 'promo' ? 'bg-biosphere-secondary' : 'bg-biosphere-primary'} text-white border-0 px-3 py-1`}>
                    {item.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs font-bold mb-3 uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-biosphere-secondary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {item.desc}
                </p>
                <button className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-biosphere-secondary hover:underline group-hover:gap-3 transition-all">
                  Подробнее <ArrowRight className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <button className="w-full mt-8 md:hidden flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white py-4 rounded-xl font-bold">
          Все новости <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}
