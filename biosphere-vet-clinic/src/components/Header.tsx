import React, { useState } from 'react'
import { Moon, Sun, MapPin, Menu, X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BookingModal } from './BookingModal'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface HeaderProps {
  onNavigateToSection: (section: string) => void
}

const branches = [
  'ул. Солнечная, 19Б',
  'ул. Московская, 4',
  'ул. Молодой Гвардии, 2Д, Нововятский район',
  'пр-т Строителей, 9, корпус 1',
  'ул. Чернышевского, 7',
  'ул. Украинская, 18',
]

export function Header({ onNavigateToSection }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const handleBranchClick = (branch: string) => {
    const encodedAddress = encodeURIComponent('Киров, ' + branch.replace(/^Россия, г\. Киров, /, ''))
    window.open(`https://yandex.ru/maps/?text=${encodedAddress}`, '_blank')
  }

  // Универсальная функция для перехода и скролла вверх
  const handleNavScroll = (path: string) => {
    if (window.location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(path)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100) // небольшой таймаут для корректного скролла после перехода
    }
  }

  const navigationItems = [
    { label: 'Вопрос–Ответ', action: () => handleNavScroll('/faq') },
    { label: 'Прейскурант', action: () => handleNavScroll('/pricelist') },
    // { label: 'Специалисты', action: () => handleNavScroll('/specialists') },
    // { label: 'Отзывы', action: () => handleNavScroll('/testimonials') },
  ]

  const handleLogout = () => {
    logout()
    toast({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из аккаунта',
    })
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Left side - Logo and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNavScroll('/')}
              className="flex items-center space-x-3 group"
            >
              <img 
                src="/logo.jpg" 
                alt="Биосфера" 
                className="h-10 w-auto rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 dark:brightness-110 dark:contrast-110" 
              />
              <span className="text-2xl font-bold text-biosphere-primary hover:text-biosphere-accent transition-colors">
                Биосфера
              </span>
            </button>
            <Button
              size="sm"
              onClick={() => setIsBookingOpen(true)}
              className="hidden md:inline-flex bg-gradient-to-r from-biosphere-primary to-biosphere-secondary text-white px-4 py-2 hover:shadow-lg"
            >
              Записаться онлайн
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 p-0"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Right side - Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {user && (
              <>
                {user.is_admin && (
                  <Link
                    to="/admin-panel"
                    className="text-sm font-medium hover:text-biosphere-primary transition-colors"
                  >
                    Админка
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-sm font-medium hover:text-biosphere-primary"
                >
                  Выйти
                </Button>
              </>
            )}
            
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-sm font-medium hover:text-biosphere-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/specialists-page"
              className="text-sm font-medium hover:text-biosphere-primary transition-colors"
            >
              Специалисты
            </Link>
            <Link
              to="/reviews-page"
              className="text-sm font-medium hover:text-biosphere-primary transition-colors"
            >
              Отзывы
            </Link>

            {/* Branches Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium hover:text-biosphere-primary">
                  <MapPin className="h-4 w-4 mr-1" />
                  Филиалы
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                {branches.map((branch, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleBranchClick(branch)}
                    className="cursor-pointer py-3 text-sm"
                  >
                    <MapPin className="h-4 w-4 mr-2 text-biosphere-primary" />
                    {branch}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {/* Mobile Navigation - Moved outside header for better stacking and isolation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop for closing menu */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div 
            className="absolute right-0 top-0 h-full w-[280px] bg-background shadow-2xl border-l flex flex-col animate-in slide-in-from-right duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
              <span className="font-bold text-biosphere-primary text-lg">Меню</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <Link
                  to="/specialists-page"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                >
                  Специалисты
                </Link>
                <Link
                  to="/reviews-page"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                >
                  Отзывы
                </Link>
              </div>

              <div className="pt-4 border-t">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 mb-2">Филиалы</div>
                <div className="space-y-1">
                  {branches.map((branch, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleBranchClick(branch)
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-start w-full px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-left"
                    >
                      <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-biosphere-primary" />
                      <span>{branch}</span>
                    </button>
                  ))}
                </div>
              </div>

              {user && user.is_admin && (
                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Выйти из системы
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}
