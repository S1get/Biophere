import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, Shield, Heart, MapPin, Award, Star, Stethoscope, FlaskConical, Calendar, Phone } from 'lucide-react'
import { BookingModal } from './BookingModal'
import { Link } from 'react-router-dom'

export function HeroSection() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const stats = [
    { number: '20+', label: 'лет работы', icon: <Award className="h-5 w-5" /> },
    { number: '4.9', label: 'Рейтинг', icon: <Star className="h-5 w-5" /> },
    { number: '50+', label: 'специалистов', icon: <Stethoscope className="h-5 w-5" /> },
    { number: '20+', label: 'видов анализов', icon: <FlaskConical className="h-5 w-5" /> },
  ]

  return (
    <>
      <section id="home" className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden pt-16 pb-28 lg:pt-24 lg:pb-36">
        {/* Background animation blobs */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-biosphere-primary rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-biosphere-secondary rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-biosphere-accent rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left column - Text content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="relative flex flex-col items-start">
                <div className="relative">
                  {/* The Globus Image - Positioned to encompass the letter 'Б' */}
                  <div className="absolute -left-4 md:-left-6 lg:-left-8 top-1/2 -translate-y-1/2 w-20 h-20 md:w-32 md:h-32 lg:w-44 lg:h-44 pointer-events-none select-none z-0 overflow-hidden">
                     <div 
                        className="w-full h-full bg-cover bg-center mix-blend-multiply dark:mix-blend-screen"
                        style={{ 
                          backgroundImage: 'url("/globus.jpg")',
                          maskImage: 'url("/globus.jpg")',
                          WebkitMaskImage: 'url("/globus.jpg")',
                          maskMode: 'luminance',
                          WebkitMaskMode: 'luminance',
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                          filter: 'contrast(300%) brightness(105%) drop-shadow(0.3px 0.3px 0px rgba(0,0,0,0.7))'
                        }}
                      />
                   </div>

                  {/* Main Title */}
                  <h1 className="relative z-10 pl-4 md:pl-6 lg:pl-8 text-6xl md:text-8xl lg:text-[120px] font-bold tracking-tight leading-none animate-in fade-in slide-in-from-left-8 duration-1000">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-biosphere-primary via-biosphere-accent to-biosphere-secondary">
                      Биосфера
                    </span>
                  </h1>
                </div>
                
                {/* Subtitle - Aligned with the start of the title/globus */}
                <div className="mt-4 pl-4 md:pl-6 lg:pl-8 relative group inline-block">
                  <div className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 animate-in fade-in slide-in-from-left-12 duration-1000 delay-200">
                    Окружаем заботой
                  </div>
                  <div className="absolute -bottom-2 left-4 md:left-6 lg:left-8 w-[calc(100%-1rem)] md:w-[calc(100%-1.5rem)] lg:w-[calc(100%-2rem)] h-0.5 bg-gradient-to-r from-biosphere-primary to-transparent rounded-full transform origin-left transition-transform duration-500 group-hover:scale-x-110"></div>
                </div>
              </div>

              <div className="pl-4 md:pl-6 lg:pl-8 flex flex-col sm:flex-row gap-4 justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-gradient-to-r from-biosphere-primary to-biosphere-secondary hover:shadow-lg transition-all duration-300 text-white px-8 py-6 text-lg rounded-md flex items-center justify-center gap-2"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Записаться онлайн
                </Button>
              </div>

              {/* Stats - Responsive Version */}
              <div className="pl-4 md:pl-6 lg:pl-8 pt-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
                {/* Desktop Grid Version */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-md">
                      <div className="flex items-center justify-center mb-2 text-biosphere-primary">
                        {stat.icon}
                      </div>
                      <div className="font-extrabold text-2xl text-gray-900 dark:text-white">{stat.number}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mobile Flex Version */}
                <div className="flex md:hidden flex-wrap justify-start gap-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center group">
                      <div className="flex items-center space-x-2 text-biosphere-primary mb-1">
                        {stat.icon}
                        <span className="font-black text-2xl text-gray-900 dark:text-white">{stat.number}</span>
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Feature Cards */}
            <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-12 duration-1000">
              <div className="space-y-6">
                <Link to="/about-24-7" className="block group">
                  <div className="rounded-2xl border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                          <Clock className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Работаем 24/7</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Круглосуточная помощь вашим питомцам</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="/about-equipment" className="block group">
                  <div className="rounded-2xl border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                          <Shield className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Современное оборудование</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Новейшие технологии диагностики</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="/about-doctors" className="block group">
                  <div className="rounded-2xl border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                          <Heart className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Опытные врачи</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Более 50 специалистов</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="/about-branches" className="block group">
                  <div className="rounded-2xl border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                          <MapPin className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">6 филиалов</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Удобное расположение по городу</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Compact Emergency Card */}
                <Link to="/about-24-7" className="block group">
                  <div className="rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-md cursor-pointer overflow-hidden relative transition-all duration-300 hover:shadow-xl">
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center animate-pulse">
                          <Phone className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">Экстренная помощь 24/7</div>
                          <div className="text-2xl font-black">44-37-97</div>
                          <div className="text-sm font-medium opacity-90">пр-т Строителей, 9, корпус 1</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}
