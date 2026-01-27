import React, { useEffect, useCallback, useState } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import FAQSection from '@/components/FAQSection'
import FAQPreviewBlock from '@/components/FAQPreviewBlock'
import { PriceSection } from '@/components/PriceSection'
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Stethoscope, Filter, XCircle, Pencil, Trash, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Award, GraduationCap } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'
import { AuthProvider } from '@/contexts/AuthContext'
import ReviewsPage from './components/ReviewsPage'
import SpecialistsPage from './components/SpecialistsPage'
import SpecialistsPreviewBlock from './components/SpecialistsPreviewBlock'
import ReviewsPreviewBlock from './components/ReviewsPreviewBlock'
import PricePreviewBlock from './components/PricePreviewBlock'
import PharmacyPreviewBlock from './components/PharmacyPreviewBlock'
import NewsPreviewBlock from './components/NewsPreviewBlock'
import PricelistPage from './components/PricelistPage'
import AdminLoginPage from './components/AdminLoginPage'
import AdminPanel from './components/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'
import AboutEquipmentPage from './components/AboutEquipmentPage'
import About24_7Page from './components/About24_7Page'
import AboutDoctorsPage from './components/AboutDoctorsPage'
import AboutBranchesPage from './components/AboutBranchesPage'
import ImageModal from '@/components/ImageModal'

const specialists = [
  {
    id: 1,
    name: 'Смирнова Анна Петровна',
    position: 'Главный ветеринарный врач',
    specialization: 'Терапия, диагностика',
    experience: '15 лет',
    education: 'КВИ, специальность "Ветеринария"',
    photo: '/images/specialists/doctor1.jpg',
    bio: 'Опытный специалист в области ветеринарной терапии и диагностики. Постоянно повышает квалификацию на семинарах и конференциях.',
    branch: 'ул. Солнечная, 19Б',
  },
  {
    id: 2,
    name: 'Козлов Михаил Андреевич',
    position: 'Ветеринарный хирург',
    specialization: 'Хирургия, травматология',
    experience: '12 лет',
    education: 'МВА, кандидат ветеринарных наук',
    photo: '/images/specialists/doctor2.jpg',
    bio: 'Специализируется на сложных хирургических операциях. Владеет современными методами лечения травм и заболеваний.',
    branch: 'ул. Московская, 4',
  },
  {
    id: 3,
    name: 'Волкова Елена Сергеевна',
    position: 'Ветеринарный дерматолог',
    specialization: 'Дерматология, аллергология',
    experience: '8 лет',
    education: 'СПбГВМ, специализация по дерматологии',
    photo: '/images/specialists/doctor3.webp',
    bio: 'Эксперт по кожным заболеваниям и аллергическим реакциям у животных. Применяет современные методы диагностики.',
    branch: 'ул. Молодой Гвардии, 2Д',
  },
  {
    id: 4,
    name: 'Петров Алексей Николаевич',
    position: 'Ветеринарный кардиолог',
    specialization: 'Кардиология, УЗИ диагностика',
    experience: '10 лет',
    education: 'МГАВМ, специализация по кардиологии',
    photo: '/images/specialists/doctor4.jpg',
    bio: 'Специалист по заболеваниям сердечно-сосудистой системы. Проводит эхокардиографию и другие виды кардиологической диагностики.',
    branch: 'пр-т Строителей, 9',
  },
  {
    id: 5,
    name: 'Иванова Мария Викторовна',
    position: 'Ветеринарный офтальмолог',
    specialization: 'Офтальмология, микрохирургия глаза',
    experience: '7 лет',
    education: 'КазГВМ, постдипломное образование по офтальмологии',
    photo: '/images/specialists/doctor5.jpg',
    bio: 'Занимается лечением заболеваний глаз у животных. Выполняет микрохирургические операции на глазах.',
    branch: 'ул. Чернышевского, 7',
  },
  {
    id: 6,
    name: 'Соколов Дмитрий Павлович',
    position: 'Ветеринарный ортопед',
    specialization: 'Ортопедия, неврология',
    experience: '9 лет',
    education: 'УрГСХА, специализация по ортопедии',
    photo: '/images/specialists/doctor6.jpg',
    bio: 'Специализируется на лечении заболеваний опорно-двигательного аппарата и нервной системы у животных.',
    branch: 'ул. Украинская, 18',
  },
]

function MainSpecialistsPage() {
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [branch, setBranch] = useState('')
  
  // Состояние для модального окна просмотра фотографий
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string, name: string} | null>(null)

  const uniquePositions = Array.from(new Set(specialists.map(s => s.position)))
  const uniqueSpecializations = Array.from(new Set(specialists.map(s => s.specialization)))
  const uniqueBranches = Array.from(new Set(specialists.map(s => s.branch)))

  const filtered = specialists.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase())) &&
    (!position || s.position === position) &&
    (!specialization || s.specialization === specialization) &&
    (!branch || s.branch === branch)
  )

  const resetFilters = () => {
    setSearch('')
    setPosition('')
    setSpecialization('')
    setBranch('')
  }

  const handleImageClick = (specialist: any) => {
    setSelectedImage({
      src: specialist.photo,
      alt: specialist.name,
      name: specialist.name
    })
    setImageModalOpen(true)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#1f2937] dark:bg-[#1f2937] bg-gradient-to-br from-[#f8fafc] to-[#e6f9ef] dark:from-[#1f2937] dark:to-[#1f2937] text-foreground flex flex-col">
        <Header onNavigateToSection={() => {}} />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Поиск по имени</label>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Введите имя специалиста..."
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-biosphere-primary bg-white dark:bg-[rgb(17,24,39)] bg-gradient-to-br from-white to-[#e3eaff] dark:from-[rgb(17,24,39)] dark:to-[rgb(17,24,39)] text-gray-900 dark:text-gray-100 placeholder-gray-400"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Должность</label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className="border rounded-lg px-4 py-2 bg-white dark:bg-[rgb(17,24,39)] bg-gradient-to-br from-white to-[#e3eaff] dark:from-[rgb(17,24,39)] dark:to-[rgb(17,24,39)] text-gray-900 dark:text-gray-100"
                >
                  <option value="">Все</option>
                  {uniquePositions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Место работы</label>
                <select
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="border rounded-lg px-4 py-2 bg-white dark:bg-[rgb(17,24,39)] bg-gradient-to-br from-white to-[#e3eaff] dark:from-[rgb(17,24,39)] dark:to-[rgb(17,24,39)] text-gray-900 dark:text-gray-100"
                >
                  <option value="">Все</option>
                  {uniqueBranches.map(br => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Специализация</label>
                <select
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  className="border rounded-lg px-4 py-2 bg-white dark:bg-[rgb(17,24,39)] bg-gradient-to-br from-white to-[#e3eaff] dark:from-[rgb(17,24,39)] dark:to-[rgb(17,24,39)] text-gray-900 dark:text-gray-100"
                >
                  <option value="">Все</option>
                  {uniqueSpecializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mt-6 md:mt-0 h-12"
                title="Сбросить фильтры"
              >
                <XCircle className="h-5 w-5" />
                Сбросить
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
                  Специалисты не найдены
                </div>
              ) : (
                filtered.map((specialist) => (
                  <Card key={specialist.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white dark:bg-[rgb(17,24,39)] bg-gradient-to-br from-white to-[#e3eaff] dark:from-[rgb(17,24,39)] dark:to-[rgb(17,24,39)]">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div 
                          className="w-24 h-24 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-full mx-auto mb-4 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => handleImageClick(specialist)}
                          title="Нажмите для просмотра в полном размере"
                        >
                          <img 
                            src={specialist.photo} 
                            alt={specialist.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center')
                              const fallback = document.createElement('div')
                              fallback.innerHTML = `<svg class='h-12 w-12 text-white' fill='currentColor' viewBox='0 0 24 24'><path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z'/></svg>`
                              e.currentTarget.parentElement?.appendChild(fallback)
                            }}
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {specialist.name}
                        </h3>
                        <Badge variant="secondary" className="mb-2">
                          {specialist.position}
                        </Badge>
                        <p className="text-sm text-biosphere-primary font-medium">
                          {specialist.specialization}
                        </p>
                      </div>
                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-biosphere-warm" />
                          <span>Опыт: {specialist.experience}</span>
                        </div>
                        <div className="flex items-start">
                          <GraduationCap className="h-4 w-4 mr-2 mt-0.5 text-biosphere-warm flex-shrink-0" />
                          <span className="leading-tight">{specialist.education}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {specialist.bio}
                        </p>
                      </div>
                      <div className="mt-6">
                        <button className="w-full bg-gradient-to-r from-biosphere-primary to-biosphere-secondary text-white py-2 px-4 rounded-lg hover:shadow-md transition-all duration-300 text-sm font-medium">
                          Записаться к врачу
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Модальное окно для просмотра фотографий */}
      {selectedImage && (
        <ImageModal
          isOpen={imageModalOpen}
          onClose={() => {
            setImageModalOpen(false)
            setSelectedImage(null)
          }}
          imageSrc={selectedImage.src}
          imageAlt={selectedImage.alt}
          specialistName={selectedImage.name}
        />
      )}
    </ThemeProvider>
  )
}

const testimonials = [
  {
    id: 1,
    name: 'Анна Петрова',
    avatar: 'АП',
    rating: 5,
    date: '15 мая 2024',
    text: 'Прекрасная клиника! Врачи очень внимательные и профессиональные. Мой кот выздоровел благодаря качественному лечению. Особенно хочу поблагодарить доктора Смирнову за терпение и заботу.',
    pet: 'кот Мурзик',
  },
  {
    id: 2,
    name: 'Михаил Козлов',
    avatar: 'МК',
    rating: 5,
    date: '8 мая 2024',
    text: 'Отличный сервис и современное оборудование. Провели операцию моей собаке на высшем уровне. Персонал заботливый, всё объяснили подробно. Рекомендую всем владельцам питомцев!',
    pet: 'собака Рекс',
  },
  {
    id: 3,
    name: 'Елена Волкова',
    avatar: 'ЕВ',
    rating: 5,
    date: '2 мая 2024',
    text: 'Замечательная клиника с квалифицированными специалистами. Быстро поставили диагноз и назначили эффективное лечение. Цены разумные, а качество услуг на высоте.',
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

function TestimonialsPage() {
  const [search, setSearch] = useState('')
  const [rating, setRating] = useState('')

  const filtered = testimonials.filter(t =>
    (!search || t.text.toLowerCase().includes(search.toLowerCase())) &&
    (!rating || t.rating === Number(rating))
  )

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-biosphere-warm fill-biosphere-warm' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#1f2937] dark:bg-[#1f2937] bg-gradient-to-br from-[#f8fafc] to-[#e6f9ef] dark:from-[#1f2937] dark:to-[#1f2937] text-foreground flex flex-col">
        <Header onNavigateToSection={() => {}} />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Поиск по тексту отзыва</label>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Введите текст..."
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-biosphere-primary bg-white dark:bg-[rgb(17,24,39)] bg-gradient-to-br from-white to-[#e3eaff] dark:from-[rgb(17,24,39)] dark:to-[rgb(17,24,39)] text-gray-900 dark:text-gray-100 placeholder-gray-400"
                />
              </div>
              <div className="flex flex-col gap-2 w-48">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Рейтинг</label>
                <select
                  value={rating}
                  onChange={e => setRating(e.target.value)}
                  className="border rounded-lg px-4 py-2 bg-white dark:bg-[rgb(17,24,39)] bg-gradient-to-br from-white to-[#e3eaff] dark:from-[rgb(17,24,39)] dark:to-[rgb(17,24,39)] text-gray-900 dark:text-gray-100"
                >
                  <option value="">Все</option>
                  {[5,4,3,2,1].map(r => (
                    <option key={r} value={r}>{r} звёзд</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
                  Отзывы не найдены
                </div>
              ) : (
                filtered.map((testimonial) => (
                  <Card key={testimonial.id} className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white dark:bg-[rgb(17,24,39)] bg-gradient-to-br from-white to-[#e3eaff] dark:from-[rgb(17,24,39)] dark:to-[rgb(17,24,39)]">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-biosphere-primary text-white font-medium">
                              {testimonial.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {testimonial.pet}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <Quote className="h-6 w-6 text-biosphere-primary/30 mb-2" />
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                          {testimonial.text}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                        {testimonial.date}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

const initialFaq = [
  { id: 1, question: 'Как записаться на приём?', answer: 'Вы можете записаться онлайн через сайт или по телефону.' },
  { id: 2, question: 'Какие услуги предоставляет клиника?', answer: 'Мы предоставляем полный спектр ветеринарных услуг: терапия, хирургия, диагностика, профилактика, стоматология и др.' },
  { id: 3, question: 'Можно ли вызвать врача на дом?', answer: 'Да, вы можете оформить вызов врача на дом через сайт или по телефону.' },
]

function FaqPage() {
  const [faq, setFaq] = useState(() => {
    const saved = localStorage.getItem('faq-list')
    return saved ? JSON.parse(saved) : initialFaq
  })
  const [myQuestions, setMyQuestions] = useState(() => {
    const saved = localStorage.getItem('my-questions')
    return saved ? JSON.parse(saved) : []
  })
  const [question, setQuestion] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    localStorage.setItem('faq-list', JSON.stringify(faq))
    localStorage.setItem('my-questions', JSON.stringify(myQuestions))
  }, [faq, myQuestions])

  const handleAdd = () => {
    if (question.trim().length < 5) return
    const newId = Date.now()
    setFaq([...faq, { id: newId, question, answer: null }])
    setMyQuestions([...myQuestions, newId])
    setQuestion('')
  }

  const handleEdit = (id) => {
    setEditingId(id)
    setEditText(faq.find(q => q.id === id)?.question || '')
  }

  const handleEditSave = (id) => {
    setFaq(faq.map(q => q.id === id ? { ...q, question: editText } : q))
    setEditingId(null)
    setEditText('')
  }

  const handleDelete = (id) => {
    setFaq(faq.filter(q => q.id !== id))
    setMyQuestions(myQuestions.filter(qid => qid !== id))
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#1f2937] dark:bg-[#1f2937] bg-gradient-to-br from-[#f8fafc] to-[#e6f9ef] dark:from-[#1f2937] dark:to-[#1f2937] text-foreground flex flex-col">
        <Header onNavigateToSection={() => {}} />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Вопросы и ответы</h2>
            <div className="mb-8 flex gap-2">
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Задайте свой вопрос..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-biosphere-primary bg-white dark:bg-[rgb(17,24,39)] bg-gradient-to-br from-white to-[#e3eaff] dark:from-[rgb(17,24,39)] dark:to-[rgb(17,24,39)] text-gray-900 dark:text-gray-100 placeholder-gray-400"
              />
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-biosphere-primary text-white rounded-lg hover:bg-biosphere-primary/90 transition-colors"
                title="Задать вопрос"
              >
                <Send className="h-5 w-5" />
                Задать
              </button>
            </div>
            <div className="space-y-4">
              {faq.map(item => (
                <div key={item.id} className="rounded-lg bg-white dark:bg-[rgb(17,24,39)] bg-gradient-to-br from-white to-[#e3eaff] dark:from-[rgb(17,24,39)] dark:to-[rgb(17,24,39)] p-6 shadow-md flex flex-col gap-2">
                  {editingId === item.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        className="flex-1 border rounded-lg px-2 py-1"
                      />
                      <button onClick={() => handleEditSave(item.id)} className="text-green-600 hover:text-green-800 font-bold">Сохранить</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">Отмена</button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white mb-1">{item.question}</div>
                        {item.answer && <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">{item.answer}</div>}
                      </div>
                      {myQuestions.includes(item.id) && (
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(item.id)} className="text-blue-600 hover:text-blue-800" title="Редактировать"><Pencil className="h-5 w-5" /></button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800" title="Удалить"><Trash className="h-5 w-5" /></button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.classList.add('smooth-scroll')
    
    // SEO meta tags
    document.title = 'Биосфера - Ветеринарная клиника в Кирове | Лечение животных 24/7'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Ветеринарная клиника Биосфера в Кирове - профессиональная медицинская помощь животным 24/7. 6 филиалов, опытные врачи, современное оборудование. Записаться онлайн.')
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'ветеринарная клиника, ветеринар, лечение животных, Киров, ветврач, вакцинация, операции, УЗИ, анализы')
    }
  }, [])

  const handleNavigateToSection = (section: string) => {
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(section)
      if (element) {
        const headerHeight = 80 // Account for fixed header
        const elementPosition = element.offsetTop - headerHeight
        window.scrollTo({ top: elementPosition, behavior: 'smooth' })
      }
    }
  }

  const mainSectionIds = ['home', 'main-prices', 'faq', 'main-specialists', 'main-reviews', 'main-pharmacy', 'main-news'];
  const [currentMainSection, setCurrentMainSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const offsets = mainSectionIds.map(id => {
        const el = document.getElementById(id)
        return el ? el.getBoundingClientRect().top : Infinity
      })
      // Find the index of the first section that is below the header
      const index = offsets.findIndex(offset => offset > 120)
      setCurrentMainSection(index === -1 ? mainSectionIds.length - 1 : Math.max(0, index - 1))
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, []);

  const scrollToMainSection = (index: number) => {
    const el = document.getElementById(mainSectionIds[index]);
    if (el) {
      const headerHeight = 80;
      const top = el.offsetTop - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Header onNavigateToSection={handleNavigateToSection} />
            <main>
              <Routes>
                <Route path="/" element={
                  <>
                    <HeroSection />
                    <PricePreviewBlock />
                    <FAQPreviewBlock />
                    <SpecialistsPreviewBlock />
                    <ReviewsPreviewBlock />
                    <PharmacyPreviewBlock />
                    <NewsPreviewBlock />
                    
                    {/* Navigation Arrows for Main Page */}
                    <div className="fixed z-50 right-6 bottom-24 md:bottom-32 flex flex-col gap-6">
                      {currentMainSection > 0 && (
                        <button
                          onClick={() => scrollToMainSection(currentMainSection - 1)}
                          className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all bg-white dark:bg-gray-800 text-biosphere-primary dark:text-biosphere-secondary border-2 border-biosphere-primary/20 dark:border-gray-700 hover:bg-biosphere-primary hover:text-white dark:hover:bg-biosphere-secondary dark:hover:text-white active:scale-90 group"
                          title="Вверх к предыдущему разделу"
                        >
                          <svg className="w-7 h-7 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        </button>
                      )}
                      {currentMainSection < mainSectionIds.length - 1 && (
                        <button
                          onClick={() => scrollToMainSection(currentMainSection + 1)}
                          className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all bg-white dark:bg-gray-800 text-biosphere-primary dark:text-biosphere-secondary border-2 border-biosphere-primary/20 dark:border-gray-700 hover:bg-biosphere-primary hover:text-white dark:hover:bg-biosphere-secondary dark:hover:text-white active:scale-90 group"
                          title="Вниз к следующему разделу"
                        >
                          <svg className="w-7 h-7 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      )}
                    </div>
                  </>
                } />
                <Route path="/pricelist" element={<PricelistPage />} />
                <Route path="/specialists-page" element={<SpecialistsPage />} />
                <Route path="/reviews-page" element={<ReviewsPage />} />
                <Route path="/faq" element={<FAQSection />} />
                <Route path="/admin" element={<AdminLoginPage />} />
                <Route path="/admin-panel" element={<ProtectedRoute requireAdmin={true}><AdminPanel /></ProtectedRoute>} />
                <Route path="/about-equipment" element={<AboutEquipmentPage />} />
                <Route path="/about-24-7" element={<About24_7Page />} />
                <Route path="/about-doctors" element={<AboutDoctorsPage />} />
                <Route path="/about-branches" element={<AboutBranchesPage />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
