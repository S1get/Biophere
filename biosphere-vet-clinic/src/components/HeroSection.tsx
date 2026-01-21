import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Shield, 
  Clock, 
  MapPin, 
  Phone, 
  Stethoscope,
  Award,
  Users,
  Calendar,
  Star,
  FlaskConical
} from 'lucide-react'
import { BookingModal } from './BookingModal'
import { Link } from 'react-router-dom'

export function HeroSection() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const features = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Работаем 24/7',
      description: 'Круглосуточная помощь вашим питомцам',
      link: '/about-24-7',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Современное оборудование',
      description: 'Новейшие технологии диагностики',
      link: '/about-equipment',
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Опытные врачи',
      description: 'Более 50 специалистов',
      link: '/about-doctors',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: '6 филиалов',
      description: 'Удобное расположение по городу',
      link: '/about-branches',
    },
  ]

  const stats = [
    { number: '20+', label: 'лет работы', icon: <Award className="h-5 w-5" /> },
    { number: '4.9', label: 'Рейтинг', icon: <Star className="h-5 w-5" /> },
    { number: '50+', label: 'специалистов', icon: <Stethoscope className="h-5 w-5" /> },
    { number: '20+', label: 'видов анализов', icon: <FlaskConical className="h-5 w-5" /> },
  ]

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 bg-biosphere-primary rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-biosphere-secondary rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-biosphere-accent rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text content */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* <Badge variant="secondary">
                  <Heart className="h-3 w-3 mr-1" />
                  Ветеринарная клиника №1 в Кирове
                </Badge> */}
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight relative inline-block py-4">
                  <div className="absolute inset-0 pointer-events-none select-none overflow-visible -z-10 flex items-center justify-center">
                    <svg
                      viewBox="0 0 200 100"
                      className="w-[150%] h-[200%] opacity-25 dark:opacity-35"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 170,10 A 85,40 0 1,0 170,90 A 70,30 0 1,1 170,10"
                        fill="url(#moon-gradient)"
                        className="animate-pulse"
                        transform="rotate(-5, 100, 50)"
                      />
                      <defs>
                        <linearGradient id="moon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0285a2" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#4caf50" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <span className="text-transparent bg-clip-text relative z-10" style={{ background: 'linear-gradient(to right, rgb(2, 133, 162), rgb(76, 175, 80))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Биосфера
                  </span>
                </h1>
                <div className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                  Клиника, где окружают заботой
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-gradient-to-r from-biosphere-primary to-biosphere-secondary hover:shadow-lg transition-all duration-300 text-white px-8 py-6 text-lg"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Записаться онлайн
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-md">
                    <div className="flex items-center justify-center mb-2 text-biosphere-primary">
                      {stat.icon}
                    </div>
                    <div className="font-extrabold text-2xl text-gray-900 dark:text-white">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column - Features cards */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Link to={feature.link} key={index} className="block group">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <span className="absolute right-4 bottom-4 px-3 py-1 bg-biosphere-primary text-white text-xs rounded-lg shadow opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none select-none">
                        Подробнее
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {/* Emergency Contact Card */}
              <Link to="/about-24-7" className="block group">
                <Card className="bg-gradient-to-r from-red-500/90 to-red-600/90 dark:from-red-500/70 dark:to-red-600/70 text-white border-0 shadow-md cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Phone className="h-8 w-8" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold mb-1">Работаем круглосуточно</div>
                        <div className="text-lg mb-1">пр-т Строителей, 9, корпус 1</div>
                        <div className="text-xl font-bold">44-37-97</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}
