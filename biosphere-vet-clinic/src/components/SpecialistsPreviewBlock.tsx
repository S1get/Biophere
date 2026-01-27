import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import ImageModal from './ImageModal'
import { useIsMobile } from '@/hooks/use-mobile'

const specialists = [
  {
    name: 'Жаворонков Олег Николаевич',
    position: 'Главный хирург сети клиник',
    specialization: 'травматология, ортопедия, нейрохирургия, абдоминальная и торакальная хирургия',
    experience: '',
    education: 'Московская Ветеринарная Академия',
    workplace: 'ул. Московская, д. 4',
    extra_qual: 'Кардиология, УЗИ-диагностика',
    photo: '../doctors/olzhavoronkov.jpg',
    bio: '',
  },
  {
    name: 'Орлова Роза Сергеевна',
    position: 'Главный врач',
    specialization: 'терапия, визуальная диагностика (УЗИ), кардиология, онкология, неврология',
    experience: '',
    education: 'Московская Ветеринарная Академия',
    workplace: 'ул. Солнечная, у д. 19 Б, ул. Московская, д. 4',
    extra_qual: 'Кардиология, УЗИ-диагностика',
    photo: '/doctors/rgogoleva.jpg',
    bio: '',
  },
  {
    name: 'Вавилова Ульяна Юрьевна',
    position: 'Главный врач',
    specialization: 'терапия, офтальмология',
    experience: '',
    education: 'Московская Ветеринарная Академия',
    workplace: 'ул. Московская, д. 4, ул. Молодой Гвардии, д. 2 Д',
    extra_qual: 'Кардиология, УЗИ-диагностика',
    photo: '/doctors/ulvavilova.jpg',
    bio: '',
  },
  {
    name: 'Малышева Ольга Юрьевна',
    position: 'Ветеринарный врач-хирург',
    specialization: 'торакальная хирургия, абдоминальная хирургия, косметическая и реконструктивная хирургия',
    experience: '',
    education: 'Московская Ветеринарная Академия',
    workplace: 'ул. Чернышевского, д. 7, ул. Солнечная, у д. 19 Б',
    extra_qual: 'Кардиология, УЗИ-диагностика',
    photo: '/doctors/olmalisheva.jpg',
    bio: '',
  },
  {
    name: 'Заболотская Анастасия Михайловна',
    position: 'Ветеринарный врач',
    specialization: 'терапия, визуальная диагностика (УЗИ)',
    experience: '',
    education: 'Московская Ветеринарная Академия',
    workplace: 'пр-т. Строителей, д. 9, к. 1',
    extra_qual: 'Кардиология, УЗИ-диагностика',
    photo: '/doctors/anvvedenskaya.jpg',
    bio: '',
  },
  {
    name: 'Суханова Елена Михайловна',
    position: 'Ветеринарный врач',
    specialization: 'терапия, дерматология, лабораторная диагностика',
    experience: '',
    education: 'Московская Ветеринарная Академия',
    workplace: 'ул. Солнечная, д. 19 Б, ул. Чернышевского, д. 7',
    extra_qual: 'Кардиология, УЗИ-диагностика',
    photo: '/doctors/elsuhanova.jpg',
    bio: '',
  },
]

export default function SpecialistsPreviewBlock() {
  // Состояние для модального окна просмотра фотографий
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string, name: string} | null>(null)
  const isMobile = useIsMobile()

  const handleImageClick = (specialist: any) => {
    setSelectedImage({
      src: specialist.photo,
      alt: specialist.name,
      name: specialist.name
    })
    setImageModalOpen(true)
  }

  return (
    <section id="main-specialists" className="py-16 bg-gradient-to-br from-white via-[#f0f4ff] to-[#e3eaff] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-biosphere-primary/30 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-biosphere-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-biosphere-secondary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-biosphere-primary/10 rounded-xl mb-4 -rotate-6 hover:rotate-0 transition-all duration-500 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-biosphere-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Наши лучшие <span className="text-transparent bg-clip-text bg-gradient-to-r from-biosphere-primary to-biosphere-secondary">специалисты</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Команда профессионалов, преданных своему делу. Мы заботимся о здоровье ваших питомцев как о своих собственных.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {specialists.map((specialist, idx) => (
            <Card key={specialist.name + String(idx)} className={`group hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] transition-all duration-500 border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md overflow-hidden ${idx >= 3 ? 'hidden md:flex' : 'flex'} flex-col transform hover:-translate-y-2`}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-biosphere-primary to-biosphere-secondary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="text-center mb-6 relative">
                  <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden ring-4 ring-gray-50 dark:ring-gray-700 group-hover:ring-biosphere-primary/20 transition-all duration-500 cursor-zoom-in" onClick={() => handleImageClick(specialist)}>
                    <img 
                      src={specialist.photo} 
                      alt={specialist.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-biosphere-primary text-biosphere-primary dark:text-white border-biosphere-primary/20 hover:bg-biosphere-primary hover:text-white transition-colors px-4 py-1 rounded-full shadow-md text-xs font-bold whitespace-nowrap">
                    Опыт 10+ лет
                  </Badge>
                </div>

                <div className="text-center flex-1 flex flex-col">
                  <h4 className="font-black text-gray-900 dark:text-white text-xl mb-1 group-hover:text-biosphere-primary transition-colors">
                    {specialist.name}
                  </h4>
                  <p className="text-biosphere-primary font-bold text-sm mb-4 uppercase tracking-wider">
                    {specialist.position}
                  </p>
                  
                  <div className="space-y-3 mb-6 text-left flex-1">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 mt-0.5 rounded bg-biosphere-primary/10 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-biosphere-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.993 7.993 0 002 12a7.998 7.998 0 007 7.938V4.804zM11 4.804v15.134A7.998 7.998 0 0018 12a7.993 7.993 0 00-7-7.196z"></path></svg>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
                        <span className="font-bold text-gray-900 dark:text-gray-200">Специализация:</span> {specialist.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto relative z-20">
                    <Link 
                      to="/specialists-page"
                      className="block w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-bold text-sm text-center hover:bg-biosphere-primary hover:text-white transition-all duration-300"
                    >
                      Подробнее о враче
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/specialists-page" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-biosphere-primary/40 hover:scale-105 transition-all duration-300 group"
          >
            <span>Познакомиться со всеми врачами</span>
            <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
      
      <ImageModal 
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        imageSrc={selectedImage?.src || ''}
        imageAlt={selectedImage?.alt || ''}
        title={selectedImage?.name || ''}
      />
    </section>
  )
}
