import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSpecialists } from '../hooks/useSpecialists'
import { useAuth } from '../contexts/AuthContext'
import SpecialistModal from './SpecialistModal'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Edit, Trash2, Plus } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import ImageModal from './ImageModal'
import { useIsMobile } from '@/hooks/use-mobile'
import { comparePositions } from '../constants/positionRank'

export default function SpecialistsPage() {
  const { specialists, loading, error, createSpecialist, updateSpecialist, deleteSpecialist } = useSpecialists()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])
  const [selectedWorkplaces, setSelectedWorkplaces] = useState<string[]>([])
  const [selectedPosition, setSelectedPosition] = useState<string>('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const isMobile = useIsMobile()
  
  // Модальные окна
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [specialistToDelete, setSpecialistToDelete] = useState<any>(null)
  
  // Состояние для модального окна просмотра фотографий
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string, name: string} | null>(null)

  const isAdmin = user?.is_admin

  // Получаем уникальные специализации и места работы из данных с бэка
  const allSpecs = Array.from(
    new Set(
      specialists
        .flatMap(s => (s.specialization ? s.specialization.split(',').map(x => x.trim()) : []))
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, 'ru', { sensitivity: 'base' }))
  const allWorkplaces = [
    'ул. Солнечная, 19Б',
    'ул. Московская, 4',
    'ул. Молодой Гвардии, 2Д, Нововятский район',
    'пр-т Строителей, 9, корпус 1',
    'ул. Чернышевского, 7',
    'ул. Украинская, 18',
  ]
  const positions = Array.from(new Set(specialists.map(s => s.position))).sort(comparePositions)

  // Получаем 6 уникальных должностей и 6 уникальных мест работы (филиалов)
  const uniquePositions = positions.slice(0, 6);
  const uniqueWorkplaces = allWorkplaces.slice(0, 6);

  const handleSpecChange = (spec: string) => {
    setSelectedSpecs(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    )
  }
  const handleWorkplaceChange = (work: string) => {
    setSelectedWorkplaces(prev =>
      prev.includes(work) ? prev.filter(w => w !== work) : [...prev, work]
    )
  }
  const handlePositionChange = (pos: string) => {
    setSelectedPosition(prev => (prev === pos ? '' : pos))
  }

  const filtered = specialists.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.specialization || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.position || '').toLowerCase().includes(search.toLowerCase())
    const specArr = s.specialization ? s.specialization.split(',').map(x => x.trim()) : []
    const workArr = s.workplace ? s.workplace.split(',').map(x => x.trim()) : []
    const normalizedWorkArr = workArr.map(w => w === 'Нововятский район' ? 'ул. Молодой Гвардии, 2Д, Нововятский район' : w)
      .filter(w => allWorkplaces.some(aw => w.includes(aw) || aw.includes(w)))
    const matchesSpec =
      selectedSpecs.length === 0 || selectedSpecs.some(spec => specArr.includes(spec))
    const matchesWork =
      selectedWorkplaces.length === 0 || selectedWorkplaces.some(w => normalizedWorkArr.includes(w))
    const matchesPos = !selectedPosition || s.position === selectedPosition
    return matchesSearch && matchesSpec && matchesWork && matchesPos
  })

  const resetFilters = () => {
    setSelectedSpecs([])
    setSelectedWorkplaces([])
    setSelectedPosition('')
  }

  const filterBtnClass =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-zinc-300 shadow-sm hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 h-9 flex-1 min-w-[200px] px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700'

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 100)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // Админ функции
  const handleCreateSpecialist = () => {
    setModalMode('create')
    setSelectedSpecialist(null)
    setModalOpen(true)
  }

  const handleEditSpecialist = (specialist: any) => {
    setModalMode('edit')
    setSelectedSpecialist(specialist)
    setModalOpen(true)
  }

  const handleDeleteSpecialist = (specialist: any) => {
    setSpecialistToDelete(specialist)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (specialistToDelete) {
      try {
        await deleteSpecialist(specialistToDelete.id)
        setDeleteDialogOpen(false)
        setSpecialistToDelete(null)
      } catch (error) {
        console.error('Ошибка при удалении специалиста:', error)
      }
    }
  }

  const handleImageClick = (specialist: any) => {
    setSelectedImage({
      src: specialist.photo,
      alt: specialist.name,
      name: specialist.name
    })
    setImageModalOpen(true)
  }

  const handleSaveSpecialist = async (specialistData: any) => {
    if (modalMode === 'create') {
      await createSpecialist(specialistData)
    }
  }

  const handleUpdateSpecialist = async (id: number, specialistData: any) => {
    await updateSpecialist(id, specialistData)
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-white to-[#e3eaff] dark:bg-[#1f2937] dark:from-[#1f2937] dark:to-[#1f2937] min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Поиск по имени, специализации, должности..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-6 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-biosphere-primary shadow-sm mb-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-gray-300 dark:border-gray-700"
            />
            <div className="overflow-x-auto">
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch max-w-full min-w-[320px]">
                {/* Фильтр по специализациям */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={filterBtnClass}>
                      Специализация
                      {selectedSpecs.length > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {selectedSpecs.length}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-72 overflow-y-auto">
                    {allSpecs.map((spec: string) => (
                      <DropdownMenuCheckboxItem
                        key={spec}
                        checked={selectedSpecs.includes(spec)}
                        onCheckedChange={() => handleSpecChange(spec)}
                        onSelect={e => e.preventDefault()}
                      >
                        {spec}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Фильтр по должности (одиночный выбор, современный стиль) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={filterBtnClass}>
                      Должность
                      {selectedPosition && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          1
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-72 overflow-y-auto">
                    {positions.map((pos: string) => (
                      <DropdownMenuCheckboxItem
                        key={pos}
                        checked={selectedPosition === pos}
                        onCheckedChange={() => handlePositionChange(pos)}
                        onSelect={e => e.preventDefault()}
                      >
                        {pos}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Фильтр по месту работы */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={filterBtnClass}>
                      Место работы
                      {selectedWorkplaces.length > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {selectedWorkplaces.length}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-72 overflow-y-auto">
                    {allWorkplaces.map((work: string) => (
                      <DropdownMenuCheckboxItem
                        key={work}
                        checked={selectedWorkplaces.includes(work)}
                        onCheckedChange={() => handleWorkplaceChange(work)}
                        onSelect={e => e.preventDefault()}
                      >
                        {work}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  onClick={resetFilters}
                  className="flex-1 min-w-[150px] px-4 py-2 rounded-lg border border-red-300 dark:border-red-600 text-red-600 dark:text-white bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 transition-colors text-sm font-medium"
                  style={{ minWidth: 0 }}
                >
                  Сбросить фильтры
                </button>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-12 text-lg">Загрузка специалистов...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">Ошибка: {error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Карточка "+" для админа */}
              {isAdmin && (
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md border-dashed border-2 border-gray-300 dark:border-gray-600">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Plus className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Добавить специалиста
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        Создать новую карточку специалиста
                      </p>
                      <Button 
                        onClick={handleCreateSpecialist}
                        className="w-full bg-biosphere-primary hover:bg-biosphere-secondary"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Карточки специалистов */}
              {filtered.map((specialist, idx) => (
                <Card key={specialist.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md relative">
                  {/* Кнопки админа */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSpecialist(specialist)}
                        className="h-8 w-8 p-0 bg-white/90 dark:bg-gray-800/90"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteSpecialist(specialist)}
                        className="h-8 w-8 p-0 bg-white/90 dark:bg-gray-800/90 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div 
                        className={`w-24 h-24 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-full mx-auto mb-4 overflow-hidden ${isMobile ? '' : 'cursor-pointer hover:scale-105 transition-transform duration-200'}`}
                        onClick={() => handleImageClick(specialist)}
                        title={isMobile ? undefined : 'Нажмите для просмотра в полном размере'}
                      >
                        <img 
                          src={specialist.photo}
                          alt={specialist.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center')
                            const fallback = document.createElement('div')
                            fallback.innerHTML = `<svg class=\"h-12 w-12 text-white\" fill=\"currentColor\" viewBox=\"0 0 24 24\"><path d=\"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z\"/></svg>`
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
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                        {specialist.specialization}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        {specialist.workplace}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                        {specialist.education}
                      </div>
                      {specialist.extra_qual && (
                        <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                          {specialist.extra_qual}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Модальное окно для создания/редактирования */}
      <SpecialistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        specialist={selectedSpecialist}
        onSave={handleSaveSpecialist}
        onUpdate={handleUpdateSpecialist}
        mode={modalMode}
        positions={uniquePositions}
        workplaces={uniqueWorkplaces}
      />

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить специалиста?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить специалиста "{specialistToDelete?.name}"? 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-biosphere-primary text-white shadow-lg hover:bg-biosphere-secondary transition-colors"
        >
          ↑
        </button>
      )}

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
    </>
  )
}
