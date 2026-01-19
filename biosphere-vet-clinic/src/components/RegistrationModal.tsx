import React, { useState } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

const registrationSchema = z.object({
  fullName: z.string().min(2, 'ФИО должно содержать минимум 2 символа'),
  email: z.string().email('Неверный формат email'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

type LoginFormData = z.infer<typeof loginSchema>
type RegistrationFormData = z.infer<typeof registrationSchema>

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()
  const { login, register } = useAuth()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const registrationForm = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      toast({
        title: 'Успешный вход',
        description: 'Добро пожаловать в личный кабинет!',
      })
      onClose()
    } catch (e: any) {
      toast({
        title: 'Ошибка входа',
        description: e.message || 'Не удалось войти',
        variant: 'destructive',
      })
    }
  }

  const handleRegistration = async (data: RegistrationFormData) => {
    try {
      await register(data.fullName, data.email, data.phone, data.password)
      toast({
        title: 'Регистрация успешна',
        description: 'Аккаунт создан. Добро пожаловать!',
      })
      onClose()
    } catch (e: any) {
      toast({
        title: 'Ошибка регистрации',
        description: e.message || 'Не удалось зарегистрироваться',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-biosphere-primary">
            Личный кабинет
          </DialogTitle>
          <DialogDescription className="text-center">
            Войдите в свой аккаунт или зарегистрируйтесь для доступа к услугам клиники.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@mail.ru"
                    className="pl-10"
                    {...loginForm.register('email')}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Введите пароль"
                    className="pl-10 pr-10"
                    {...loginForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-biosphere-primary hover:bg-biosphere-primary/90">
                Войти
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={registrationForm.handleSubmit(handleRegistration)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">ФИО</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Иванов Иван Иванович"
                    className="pl-10"
                    {...registrationForm.register('fullName')}
                  />
                </div>
                {registrationForm.formState.errors.fullName && (
                  <p className="text-sm text-destructive">{registrationForm.formState.errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="example@mail.ru"
                    className="pl-10"
                    {...registrationForm.register('email')}
                  />
                </div>
                {registrationForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{registrationForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (900) 123-45-67"
                    className="pl-10"
                    {...registrationForm.register('phone')}
                  />
                </div>
                {registrationForm.formState.errors.phone && (
                  <p className="text-sm text-destructive">{registrationForm.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Введите пароль"
                    className="pl-10 pr-10"
                    {...registrationForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {registrationForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{registrationForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Повторите пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Повторите пароль"
                    className="pl-10 pr-10"
                    {...registrationForm.register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {registrationForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{registrationForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-biosphere-secondary hover:bg-biosphere-secondary/90">
                Зарегистрироваться
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
