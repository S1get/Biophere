import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
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
import { Calendar, Clock, MapPin, User, Phone, Mail, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

const bookingSchema = z.object({
  branch: z.string().min(1, 'Выберите филиал'),
  service: z.string().min(1, 'Выберите услугу'),
  doctor: z.string().min(1, 'Выберите врача'),
  date: z.string().min(1, 'Выберите дату'),
  time: z.string().min(1, 'Выберите время'),
  fullName: z.string().min(2, 'Введите ваше ФИО'),
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

const services = [
  'Первичный осмотр',
  'Вакцинация',
  'Терапия',
  'Хирургия',
  'Стоматология',
  'Дерматология',
  'Кардиология',
  'Офтальмология',
  'Ортопедия',
  'УЗИ диагностика',
  'Рентген',
  'Анализы',
]

const doctors = [
  'Смирнова Анна Петровна - Терапевт',
  'Козлов Михаил Андреевич - Хирург',
  'Волкова Елена Сергеевна - Дерматолог',
  'Петров Алексей Николаевич - Кардиолог',
  'Иванова Мария Викторовна - Офтальмолог',
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
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  const handleSubmit = async (data: BookingFormData) => {
    try {
      const res = await fetch(`${API_URL}/bookings/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Ошибка записи')
      toast({
        title: 'Запись успешно оформлена!',
        description: 'Администратор увидит вашу запись в админ-панели.',
      })
      form.reset()
      onClose()
      navigate('/admin-panel')
    } catch (e) {
      toast({ title: 'Ошибка', description: 'Не удалось оформить запись', variant: 'destructive' })
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-biosphere-primary">
            Записаться на консультацию
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
            <Select onValueChange={(value) => form.setValue('service', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите услугу" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
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
              <Label htmlFor="fullName">
                <User className="h-4 w-4 inline mr-1" />
                ФИО
              </Label>
              <Input
                id="fullName"
                placeholder="Иванов Иван Иванович"
                {...form.register('fullName')}
              />
              {form.formState.errors.fullName && (
                <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
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
      </DialogContent>
    </Dialog>
  )
}
