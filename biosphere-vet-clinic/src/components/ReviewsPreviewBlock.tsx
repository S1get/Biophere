import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'

const reviews = [
  {
    id: 1,
    name: 'Анна Петрова',
    avatar: 'АП',
    rating: 5,
    date: '15 мая 2024',
    text: 'Прекрасная клиника! Врачи очень внимательные и профессиональные. Мой кот выздоровел благодаря качественному лечению.',
    pet: 'кот Мурзик',
  },
  {
    id: 2,
    name: 'Михаил Козлов',
    avatar: 'МК',
    rating: 4,
    date: '8 мая 2024',
    text: 'Отличный сервис и современное оборудование. Провели операцию моей собаке на высшем уровне.',
    pet: 'собака Рекс',
  },
  {
    id: 3,
    name: 'Елена Волкова',
    avatar: 'ЕВ',
    rating: 5,
    date: '2 мая 2024',
    text: 'Замечательная клиника с квалифицированными специалистами. Быстро поставили диагноз и назначили эффективное лечение.',
    pet: 'кошка Мася',
  },
  {
    id: 4,
    name: 'Александр Иванов',
    avatar: 'АИ',
    rating: 5,
    date: '28 апреля 2024',
    text: 'Очень доволен обслуживанием! Врачи действительно любят животных, это видно сразу. Провели качественную диагностику и помогли моему попугаю. Буду обращаться только сюда.',
    pet: 'попугай Кеша',
  },
  {
    id: 5,
    name: 'Мария Сидорова',
    avatar: 'МС',
    rating: 5,
    date: '20 апреля 2024',
    text: 'Спасибо огромное за спасение нашего хомячка! Думали уже всё, но врачи клиники сделали невозможное. Профессионализм на высшем уровне, рекомендую всем!',
    pet: 'хомяк Пушок',
  },
  {
    id: 6,
    name: 'Дмитрий Новиков',
    avatar: 'ДН',
    rating: 5,
    date: '15 апреля 2024',
    text: 'Отличная ветклиника! Удобная запись онлайн, вежливый персонал, чистые кабинеты. Врач подробно рассказал о состоянии питомца и дал полезные рекомендации по уходу.',
    pet: 'кролик Снежок',
  },
]

function renderStars(rating: number) {
  return [...Array(5)].map((_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${index < rating ? 'text-biosphere-warm fill-biosphere-warm' : 'text-gray-300'}`}
    />
  ))
}

export default function ReviewsPreviewBlock() {
  return (
    <section id="main-reviews" className="py-16 bg-gradient-to-br from-white via-[#f0f4ff] to-[#e3eaff] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-biosphere-primary/30 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-biosphere-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-biosphere-secondary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-biosphere-primary/10 rounded-xl mb-4 rotate-12 hover:rotate-0 transition-all duration-500 shadow-inner">
            <Quote className="h-8 w-8 text-biosphere-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Отзывы о <span className="text-transparent bg-clip-text bg-gradient-to-r from-biosphere-primary to-biosphere-secondary">клинике</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Нам доверяют самое ценное. Прочитайте истории наших клиентов и их питомцев.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map((review, idx) => (
            <Card key={review.id} className={`group hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] transition-all duration-500 border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md overflow-hidden ${idx >= 3 ? 'hidden md:flex' : 'flex'} flex-col transform hover:-translate-y-2`}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-biosphere-primary to-biosphere-secondary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 ring-2 ring-biosphere-primary/20 group-hover:ring-biosphere-primary/40 transition-all duration-300">
                        <AvatarFallback className="bg-gradient-to-br from-biosphere-primary to-biosphere-secondary text-white font-black text-lg">
                          {review.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1 shadow-md">
                        <div className="bg-biosphere-warm rounded-full p-1">
                          <Star className="h-2 w-2 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white text-lg group-hover:text-biosphere-primary transition-colors">
                        {review.name}
                      </h4>
                      <p className="text-xs font-bold text-biosphere-primary/70 uppercase tracking-widest">
                        {review.pet}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-lg">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <div className="relative flex-1">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-biosphere-primary/5 -z-10" />
                  <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed text-sm mb-6">
                    "{review.text}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {review.date}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-biosphere-primary/20"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-biosphere-primary/40"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-biosphere-primary"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/reviews-page" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-biosphere-primary/40 hover:scale-105 transition-all duration-300 group"
          >
            <span>Читать все отзывы</span>
            <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
} 
