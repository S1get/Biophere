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
    <section id="main-reviews" className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Отзывы о клинике</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <Card key={review.id} className={`h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md ${idx >= 3 ? 'hidden md:block' : ''}`}>
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-biosphere-primary text-white font-medium">
                        {review.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {review.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {review.pet}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="flex-1">
                  <Quote className="h-6 w-6 text-biosphere-primary/30 mb-2" />
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {review.text}
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                  {review.date}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/reviews-page" className="inline-block bg-biosphere-primary text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-biosphere-secondary transition-colors">Читать все отзывы</Link>
        </div>
      </div>
    </section>
  )
} 
