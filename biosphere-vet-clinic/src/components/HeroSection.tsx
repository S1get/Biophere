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
      <section id="home" className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-white via-[#f0f4ff] to-[#e3eaff] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden pt-16 pb-28 lg:pt-24 lg:pb-36">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-biosphere-primary/30 to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-biosphere-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-biosphere-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        {/* Background animation blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-biosphere-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-biosphere-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-biosphere-accent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left column - Text content */}
            <div className="lg:col-span-7 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="relative flex flex-col items-center lg:items-start">
                <div className="relative">
                  {/* The Globus Image - Positioned to encompass the letter 'Б' */}
                  <div className="absolute left-1/2 -translate-x-1/2 lg:left-[1rem] lg:translate-x-0 top-1/2 -translate-y-1/2 w-24 h-24 md:w-40 md:h-40 lg:w-56 lg:h-56 pointer-events-none select-none z-0 overflow-hidden">
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
                  <h1 className="relative z-10 text-6xl md:text-8xl lg:text-[120px] lg:pl-8 font-bold tracking-tight leading-none animate-in fade-in slide-in-from-left-8 duration-1000">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-biosphere-primary via-biosphere-accent to-biosphere-secondary">
                      Биосфера
                    </span>
                  </h1>
                </div>
                
                {/* Subtitle - Aligned with the start of the title/globus */}
                <div className="mt-10 lg:pl-8 relative group inline-block">
                  <div className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 animate-in fade-in slide-in-from-left-12 duration-1000 delay-200">
                    Окружаем заботой
                  </div>
                  <div className="absolute -bottom-2 left-0 lg:left-8 w-full lg:w-[calc(100%-2rem)] h-0.5 bg-gradient-to-r from-biosphere-primary to-transparent rounded-full transform origin-left transition-transform duration-500 group-hover:scale-x-110"></div>
                </div>
              </div>

              <div className="lg:pl-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <Button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-gradient-to-r from-biosphere-primary to-biosphere-secondary hover:shadow-lg transition-all duration-300 text-white px-8 py-6 text-lg rounded-md flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Записаться онлайн
                </Button>
              </div>

              {/* Stats - Responsive Version */}
              <div className="lg:pl-8 pt-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 w-full">
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
                <div className="flex md:hidden flex-wrap justify-center gap-x-8 gap-y-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center group min-w-[120px]">
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

            {/* Right column - Articles & Emergency Info */}
            <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-12 duration-1000">
              <div className="flex justify-center lg:justify-start mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-biosphere-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-biosphere-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 2v4h4" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 8h5M7 12h8M7 16h8" />
                    </svg>
                  </div>
                  Полезные статьи
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Link to="/about-24-7" className="group h-full">
                  <div className="h-full rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 shadow-lg group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                      <Clock className="w-16 h-16" />
                    </div>
                    <div className="w-10 h-10 bg-biosphere-primary/10 rounded-lg flex items-center justify-center text-biosphere-primary mb-4 group-hover:bg-biosphere-primary group-hover:text-white transition-all duration-300">
                      <Clock className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-biosphere-primary transition-colors">Работаем 24/7</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">Узнайте о нашей круглосуточной помощи и стандартах ухода в любое время.</p>
                    <div className="mt-auto pt-4 flex items-center text-[10px] font-bold text-biosphere-primary uppercase tracking-widest">
                      Читать статью <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </Link>

                <Link to="/about-equipment" className="group h-full">
                  <div className="h-full rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 shadow-lg group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                      <Shield className="w-16 h-16" />
                    </div>
                    <div className="w-10 h-10 bg-biosphere-primary/10 rounded-lg flex items-center justify-center text-biosphere-primary mb-4 group-hover:bg-biosphere-primary group-hover:text-white transition-all duration-300">
                      <Shield className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-biosphere-primary transition-colors">Оборудование</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">Обзор передовых технологий, которые мы используем для лечения.</p>
                    <div className="mt-auto pt-4 flex items-center text-[10px] font-bold text-biosphere-primary uppercase tracking-widest">
                      Читать статью <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </Link>

                <Link to="/about-doctors" className="group h-full">
                  <div className="h-full rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 shadow-lg group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                      <Heart className="w-16 h-16" />
                    </div>
                    <div className="w-10 h-10 bg-biosphere-primary/10 rounded-lg flex items-center justify-center text-biosphere-primary mb-4 group-hover:bg-biosphere-primary group-hover:text-white transition-all duration-300">
                      <Heart className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-biosphere-primary transition-colors">Опытные врачи</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">Познакомьтесь с нашей командой экспертов и их подходом к лечению.</p>
                    <div className="mt-auto pt-4 flex items-center text-[10px] font-bold text-biosphere-primary uppercase tracking-widest">
                      Читать статью <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </Link>

                <Link to="/about-branches" className="group h-full">
                  <div className="h-full rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 shadow-lg group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform duration-500">
                      <MapPin className="w-16 h-16" />
                    </div>
                    <div className="w-10 h-10 bg-biosphere-primary/10 rounded-lg flex items-center justify-center text-biosphere-primary mb-4 group-hover:bg-biosphere-primary group-hover:text-white transition-all duration-300">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-biosphere-primary transition-colors">6 филиалов</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">Информация о наших клиниках и удобных маршрутах до них.</p>
                    <div className="mt-auto pt-4 flex items-center text-[10px] font-bold text-biosphere-primary uppercase tracking-widest">
                      Читать статью <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Enhanced Emergency Info Block (Not a link to article) */}
              <div className="rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-[length:200%_auto] animate-gradient-x text-white border-0 shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="p-6 relative z-10">
                  <div className="flex items-center space-x-5">
                    <div className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center animate-pulse shadow-inner">
                      <Phone className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block w-2 h-2 bg-white rounded-full animate-ping"></span>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Экстренная помощь 24/7</div>
                      </div>
                      <a href="tel:44-37-97" className="text-3xl font-black hover:text-white/80 transition-colors block">44-37-97</a>
                      <div className="text-xs font-bold opacity-80 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        пр-т Строителей, 9, корпус 1
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}
