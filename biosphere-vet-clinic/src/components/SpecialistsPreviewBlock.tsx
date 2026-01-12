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
    if (isMobile) return
    setSelectedImage({
      src: specialist.photo,
      alt: specialist.name,
      name: specialist.name
    })
    setImageModalOpen(true)
  }

  return (
    <section id="main-specialists" className="py-16 bg-gradient-to-br from-white to-[#e3eaff] dark:bg-[#1f2937] dark:from-[#1f2937] dark:to-[#1f2937]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Наши лучшие специалисты</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialists.map((specialist, idx) => (
            <Card key={specialist.name + String(idx)} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
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
                    <span className="font-semibold">Место работы:</span>
                    <span className="ml-2 leading-tight">{specialist.workplace}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold">Образование:</span>
                    <span className="ml-2 leading-tight">{specialist.education}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold">Доп. квалификация:</span>
                    <span className="ml-2 leading-tight">{specialist.extra_qual}</span>
                  </div>
                </div>
                {specialist.bio && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {specialist.bio}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/specialists-page" className="inline-block bg-biosphere-primary text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-biosphere-secondary transition-colors">Смотреть всех специалистов</Link>
        </div>
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
    </section>
  )
}
