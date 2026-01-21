import React, { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Clock, MapPin, User, Phone, Mail, FileText, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import servicesData from './services-data.js'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

const bookingSchema = z.object({
  branch: z.string().min(2, 'Выберите филиал'),
  service: z.string().min(2, 'Выберите услугу'),
  doctor: z.string().min(2, 'Выберите врача'),
  date: z.string().min(1, 'Выберите дату'),
  time: z.string().min(1, 'Выберите время'),
  full_name: z.string().min(2, 'Введите ваше ФИО'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email'),
  comments: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

const branches = [
  'ул. Солнечная, 19Б',
  'ул. Московская, 4',
  'ул. Молодой Гвардии, 2Д',
  'пр-т Строителей, 9, корпус 1',
  'ул. Чернышевского, 7',
  'ул. Украинская, 18',
]

const serviceNames = Array.from(new Set(servicesData.map((s: any) => s.name))).sort((a: string, b: string) => a.localeCompare(b, 'ru'))

const doctors = [
  'Волкова Елена Сергеевна - Дерматолог',
  'Иванова Мария Викторовна - Офтальмолог',
  'Козлов Михаил Андреевич - Хирург',
  'Петров Алексей Николаевич - Кардиолог',
  'Смирнова Анна Петровна - Терапевт',
  'Соколов Дмитрий Павлович - Ортопед',
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
]

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  
  const [serviceSearch, setServiceSearch] = useState('')
   const [isServiceSelectOpen, setIsServiceSelectOpen] = useState(false)
   
   const filteredServices = useMemo(() => {
     return serviceNames.filter(s => s.toLowerCase().includes(serviceSearch.toLowerCase()))
   }, [serviceSearch])

   useEffect(() => {
      if (!isServiceSelectOpen) {
        setServiceSearch('')
      }
    }, [isServiceSelectOpen])

   const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  useEffect(() => {
    const tomorrow = getTomorrowDate()
    form.setValue('date', tomorrow, { shouldValidate: true })
  }, [])
  const handleSubmit = async (data: BookingFormData) => {
    try {
      const res = await fetch(`${API_URL}/bookings/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Ошибка сервера' }));
        throw new Error(errorData.detail || 'Не удалось оформить запись');
      }

      toast({
        title: 'Запись успешно оформлена!',
        description: 'Администратор увидит вашу запись в админ-панели.',
      })
      form.reset()
      onClose()
    } catch (e: any) {
      toast({ 
        title: 'Ошибка', 
        description: e.message || 'Не удалось оформить запись', 
        variant: 'destructive' 
      })
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <DialogHeader className="p-6 pb-2 shrink-0 relative">
          <DialogTitle className="text-center text-biosphere-primary pr-8">
            Записаться на консультацию
          </DialogTitle>
          <DialogDescription className="text-center pr-8">
            Заполните форму ниже, и наш администратор свяжется с вами для подтверждения записи.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pb-4">
            {/* Branch Selection */}
          <div className="space-y-2">
            <Label htmlFor="branch">
              <MapPin className="h-4 w-4 inline mr-1" />
              Филиал
            </Label>
            <Select onValueChange={(value) => form.setValue('branch', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите филиал" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.branch && (
              <p className="text-sm text-destructive">{form.formState.errors.branch.message}</p>
            )}
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service">
              <FileText className="h-4 w-4 inline mr-1" />
              Услуга
            </Label>
            <Select 
              onValueChange={(value) => form.setValue('service', value)}
              onOpenChange={setIsServiceSelectOpen}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите услугу" />
              </SelectTrigger>
              <SelectContent 
                className="max-h-[300px] w-[var(--radix-select-trigger-width)] overflow-x-hidden p-0"
                position="popper"
                sideOffset={4}
              >
                <div className="px-2 py-2 sticky top-0 bg-white dark:bg-gray-800 z-10 border-b w-full box-border">
                  <div className="relative w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск услуги..."
                      className="pl-8 h-9 w-full bg-gray-50 dark:bg-gray-900/50"
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()} 
                    />
                  </div>
                </div>
                <div className="p-1">
                  {filteredServices.length === 0 ? (
                    <div className="p-4 text-sm text-center text-muted-foreground">
                      Услуги не найдены
                    </div>
                  ) : (
                    filteredServices.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
            {form.formState.errors.service && (
              <p className="text-sm text-destructive">{form.formState.errors.service.message}</p>
            )}
          </div>

          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label htmlFor="doctor">
              <User className="h-4 w-4 inline mr-1" />
              Врач
            </Label>
            <Select onValueChange={(value) => form.setValue('doctor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите врача" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.doctor && (
              <p className="text-sm text-destructive">{form.formState.errors.doctor.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                <Calendar className="h-4 w-4 inline mr-1" />
                Дата
              </Label>
              <Input
                id="date"
                type="date"
                min={getTomorrowDate()}
                {...form.register('date')}
                inputMode="numeric"
              />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">
                <Clock className="h-4 w-4 inline mr-1" />
                Время
              </Label>
              <Select onValueChange={(value) => form.setValue('time', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Время" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.time && (
                <p className="text-sm text-destructive">{form.formState.errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                <User className="h-4 w-4 inline mr-1" />
                ФИО
              </Label>
              <Input
                id="full_name"
                placeholder="Иванов Иван Иванович"
                {...form.register('full_name')}
              />
              {form.formState.errors.full_name && (
                <p className="text-sm text-destructive">{form.formState.errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="h-4 w-4 inline mr-1" />
                Телефон
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (900) 123-45-67"
                inputMode="tel"
                {...form.register('phone')}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="h-4 w-4 inline mr-1" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.ru"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Комментарии</Label>
              <Textarea
                id="comments"
                placeholder="Дополнительная информация о вашем питомце или жалобах..."
                rows={3}
                {...form.register('comments')}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-biosphere-secondary hover:bg-biosphere-secondary/90"
            >
              Записаться
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
    </Dialog>
  )
}
