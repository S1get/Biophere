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
  'ул. Солнечная, 19Б',
  'ул. Московская, 4',
  'ул. Молодой Гвардии, 2Д, Нововятский район',
  'пр-т Строителей, 9, корпус 1',
  'ул. Чернышевского, 7',
  'ул. Украинская, 18',
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  const handleBranchClick = (branch: string) => {
    const encodedAddress = encodeURIComponent(branch)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }

  return (
    <footer className="bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-biosphere-secondary" />
              <h3 className="text-2xl font-bold text-black dark:text-white">Биосфера</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Современная ветеринарная клиника, обеспечивающая качественную медицинскую помощь домашним животным с 2004 года.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://vk.com/biosre" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0077FF] rounded-lg flex items-center justify-center hover:bg-[#4680C2]/80 transition-colors"
                aria-label="ВКонтакте"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="#0077FF"/>
                  <path d="M13.37 16.5C8.41 16.5 5.47 13.23 5.35 7.5H8.02C8.1 11.41 9.98 13.13 11.41 13.47V7.5H13.92V11.09C15.32 10.94 16.79 9.37 17.28 7.5H19.8C19.48 9.13 17.91 10.7 16.81 11.32C17.91 11.81 19.66 13.13 20.2 16.5H17.41C16.87 14.41 15.56 13.19 13.92 13.03V16.5H13.37Z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Branches */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black dark:text-white">Наши филиалы</h4>
            <div className="space-y-2">
              {branches.map((branch, index) => (
                <button
                  key={index}
                  onClick={() => handleBranchClick(branch)}
                  className="flex items-start space-x-2 text-left hover:text-biosphere-secondary transition-colors group"
                >
                  <MapPin className="h-4 w-4 text-biosphere-secondary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">{branch}</span>
                </button>
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
