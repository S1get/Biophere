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
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Современное оборудование',
      description: 'Новейшие технологии диагностики',
      link: '/about-equipment',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Опытные врачи',
      description: 'Более 50 специалистов',
      link: '/about-doctors',
      color: 'from-biosphere-primary to-biosphere-secondary'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: '6 филиалов',
      description: 'Удобное расположение по городу',
      link: '/about-branches',
      color: 'from-purple-500 to-indigo-500'
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
      <section id="home" className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24">
        {/* Background animation blobs */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-biosphere-primary rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-biosphere-secondary rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-biosphere-accent rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left column - Text content (Takes more space now) */}
            <div className="lg:col-span-7 space-y-10 text-center lg:text-left">
              <div className="space-y-6 flex flex-col items-center lg:items-start">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] animate-in fade-in slide-in-from-left-8 duration-1000">
                  <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-biosphere-primary via-biosphere-accent to-biosphere-secondary">
                    Биосфера
                    {/* Elegant Tapered Smooth Swoosh (Minimalist) */}
                    <div className="absolute -top-[2.2em] left-[-10%] w-[120%] h-[3.0em] pointer-events-none select-none overflow-visible">
                      <svg 
                        viewBox="0 0 400 120" 
                        fill="none" 
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                      > 
                        <path 
                          d="M 10,100 C 40,5 280,5 375,65 C 377,67 377,67 375,68 C 280,15 50,25 10,110 Z" 
                          fill="#28A745"
                          className="drop-shadow-sm"
                        /> 
                      </svg> 
                    </div>
                  </span>
                </h1>
                
                <div className="relative group">
                  <div className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 animate-in fade-in slide-in-from-left-12 duration-1000 delay-200">
                    Окружаем заботой
                  </div>
                  <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-biosphere-primary to-transparent rounded-full transform origin-left transition-transform duration-500 group-hover:scale-x-150"></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-gradient-to-r from-biosphere-primary to-biosphere-secondary hover:shadow-lg transition-all duration-300 text-white px-8 py-6 text-lg rounded-md flex items-center justify-center gap-2"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Записаться онлайн
                </Button>
              </div>

              {/* Stats - Responsive Version */}
              <div className="pt-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
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
                <div className="flex md:hidden flex-wrap justify-center gap-8">
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
              <div className="space-y-8">
                <Link to="/about-24-7" className="block group">
                  <div className="rounded-2xl border-zinc-200 text-zinc-950 dark:border-zinc-800 dark:text-zinc-50 group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                          <Clock className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Работаем 24/7</h3>
                          <p className="text-gray-600 dark:text-gray-300">Круглосуточная помощь вашим питомцам</p>
                        </div>
                      </div>
                      <span className="absolute right-6 bottom-6 px-4 py-2 bg-biosphere-primary text-white text-xs font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none select-none">Подробнее</span>
                    </div>
                  </div>
                </Link>

                <Link to="/about-equipment" className="block group">
                  <div className="rounded-2xl border-zinc-200 text-zinc-950 dark:border-zinc-800 dark:text-zinc-50 group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                          <Shield className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Современное оборудование</h3>
                          <p className="text-gray-600 dark:text-gray-300">Новейшие технологии диагностики</p>
                        </div>
                      </div>
                      <span className="absolute right-6 bottom-6 px-4 py-2 bg-biosphere-primary text-white text-xs font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none select-none">Подробнее</span>
                    </div>
                  </div>
                </Link>

                <Link to="/about-doctors" className="block group">
                  <div className="rounded-2xl border-zinc-200 text-zinc-950 dark:border-zinc-800 dark:text-zinc-50 group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                          <Heart className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Опытные врачи</h3>
                          <p className="text-gray-600 dark:text-gray-300">Более 50 специалистов</p>
                        </div>
                      </div>
                      <span className="absolute right-6 bottom-6 px-4 py-2 bg-biosphere-primary text-white text-xs font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none select-none">Подробнее</span>
                    </div>
                  </div>
                </Link>

                <Link to="/about-branches" className="block group">
                  <div className="rounded-2xl border-zinc-200 text-zinc-950 dark:border-zinc-800 dark:text-zinc-50 group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                          <MapPin className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">6 филиалов</h3>
                          <p className="text-gray-600 dark:text-gray-300">Удобное расположение по городу</p>
                        </div>
                      </div>
                      <span className="absolute right-6 bottom-6 px-4 py-2 bg-biosphere-primary text-white text-xs font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none select-none">Подробнее</span>
                    </div>
                  </div>
                </Link>

                {/* Compact Emergency Card */}
                <Link to="/about-24-7" className="block group">
                  <div className="rounded-2xl border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 bg-gradient-to-r from-red-500/90 to-red-600/90 dark:from-red-500/70 dark:to-red-600/70 text-white border-0 shadow-md cursor-pointer overflow-hidden relative transition-all duration-300 hover:shadow-xl">
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
