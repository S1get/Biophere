import React from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Heart,
  Instagram,
  MessageCircle
} from 'lucide-react'

const branches = [
  {
    address: 'пр-т Строителей, 9, корпус 1',
    hours: 'Ежедневно круглосуточно',
    phone: '44-37-97',
    mapUrl: 'https://yandex.ru/maps/-/CDT6mS2c'
  },
  {
    address: 'ул. Солнечная, 19 Б',
    hours: 'Ежедневно с 8:00 до 21:00',
    phone: '44-97-97',
    mapUrl: 'https://yandex.ru/maps/-/CDT6mS2c'
  },
  {
    address: 'ул. Московская, 4',
    hours: 'Будни: 8:00-21:00, Сб: 8:00-19:00, Вс: 8:00-17:00',
    phone: '38-39-40',
    mapUrl: 'https://yandex.ru/maps/-/CDT6mS2c'
  },
  {
    address: 'ул. Чернышевского, 7',
    hours: 'Будни: 8:00-21:00, Выходные: 8:00-17:00',
    phone: '44-27-97',
    mapUrl: 'https://yandex.ru/maps/-/CDT6mS2c'
  },
  {
    address: 'ул. Украинская, 18',
    hours: 'Будни: 8:00-21:00, Выходные: 8:00-17:00',
    phone: '44-47-97',
    mapUrl: 'https://yandex.ru/maps/-/CDT6mS2c'
  },
  {
    address: 'ул. Молодой Гвардии, 2 Д (Нововятск)',
    hours: 'Будни: 8:00-21:00, Выходные: 8:00-17:00',
    phone: '44-67-97',
    mapUrl: 'https://yandex.ru/maps/-/CDT6mS2c'
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 text-black dark:text-white border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-biosphere-secondary" />
              <h3 className="text-3xl font-bold text-black dark:text-white">Биосфера</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed hidden md:block text-lg">
              Современная ветеринарная клиника, обеспечивающая качественную медицинскую помощь домашним животным с 2004 года.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://vk.com/biosre" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#0077FF] rounded-xl flex items-center justify-center hover:bg-[#0077FF]/90 transition-all hover:scale-110 shadow-lg"
                aria-label="ВКонтакте"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.37 16.5C8.41 16.5 5.47 13.23 5.35 7.5H8.02C8.1 11.41 9.98 13.13 11.41 13.47V7.5H13.92V11.09C15.32 10.94 16.79 9.37 17.28 7.5H19.8C19.48 9.13 17.91 10.7 16.81 11.32C17.91 11.81 19.66 13.13 20.2 16.5H17.41C16.87 14.41 15.56 13.19 13.92 13.03V16.5H13.37Z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Branches Column 1 */}
          <div className="space-y-6 md:col-span-1 lg:col-span-2">
            <h4 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-biosphere-secondary" />
              Наши филиалы
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {branches.map((branch, index) => (
                <div key={index} className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <h5 className="font-bold text-biosphere-secondary">{branch.address}</h5>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-biosphere-secondary" />
                      {branch.hours}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-biosphere-secondary" />
                      <a href={`tel:${branch.phone.replace(/-/g, '')}`} className="hover:text-biosphere-secondary transition-colors font-medium">
                        {branch.phone}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-200 dark:bg-gray-700" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-700 dark:text-gray-400">
            <p>© {currentYear} Ветеринарная клиника "Биосфера". Все права защищены.</p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-biosphere-secondary dark:hover:text-white transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-gray-700 dark:text-gray-400 hover:text-biosphere-secondary dark:hover:text-white transition-colors">
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
