import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { useSpecialists } from '../hooks/useSpecialists';
import { useReviews } from '../hooks/useReviews';
import { useQuestions } from '../hooks/useQuestions';
import { useNavigate } from 'react-router-dom';
import SpecialistModal from './SpecialistModal';
import {
  Users,
  MessageSquare,
  HelpCircle,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  Shield,
  Database,
  Star
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { specialists, loading: specialistsLoading, createSpecialist, updateSpecialist, deleteSpecialist } = useSpecialists();
  const { reviews, loading: reviewsLoading } = useReviews();
  const { questions, loading: questionsLoading, markAsRead, markAsUnread } = useQuestions();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [specialistToDelete, setSpecialistToDelete] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // Реальная статистика из API
  const stats = {
    totalSpecialists: specialists.length,
    totalReviews: reviews.length,
    totalQuestions: questions.length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
    responseTime: questions.length > 0 ? Math.round((questions.filter(q => q.admin_reply).length / questions.length) * 24) : 0, // Время ответа в часах
    newQuestionsThisWeek: questions.filter(q => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(q.created_at) > weekAgo;
    }).length // Новые вопросы за неделю
  };

  // Реальная активность на основе данных
  const getRecentActivity = () => {
    const activities = [];
    
    // Добавляем последние отзывы
    const recentReviews = reviews.slice(0, 2);
    recentReviews.forEach(review => {
      const name = review.user?.name || review.guest_name || 'Гость';
      const time = new Date(review.created_at).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
      activities.push({
        type: 'review',
        message: `Отзыв от ${name}`,
        time: time,
        rating: review.rating
      });
    });

    // Добавляем последние вопросы
    const recentQuestions = questions.slice(0, 2);
    recentQuestions.forEach(question => {
      const name = question.user?.name || question.guest_name || 'Гость';
      const time = new Date(question.created_at).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
      activities.push({
        type: 'question',
        message: `Вопрос от ${name}`,
        time: time,
        hasReply: !!question.admin_reply
      });
    });

    // Сортируем по времени и берем последние 4
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 4);
  };

  const recentActivity = getRecentActivity();

  const handleClose = () => {
    navigate('/');
  };

  // Проверка прав администратора
  if (!user?.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Доступ запрещен</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              У вас нет прав для доступа к админ-панели
            </p>
            <Button onClick={handleClose} variant="outline">
              Вернуться на сайт
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateSpecialist = () => {
    setModalMode('create');
    setSelectedSpecialist(null);
    setModalOpen(true);
  };

  const handleEditSpecialist = (specialist: any) => {
    setModalMode('edit');
    setSelectedSpecialist(specialist);
    setModalOpen(true);
  };

  const handleDeleteSpecialist = (specialist: any) => {
    setSpecialistToDelete(specialist);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (specialistToDelete) {
      try {
        await deleteSpecialist(specialistToDelete.id);
        setDeleteDialogOpen(false);
        setSpecialistToDelete(null);
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const handleSaveSpecialist = async (specialistData: any) => {
    if (modalMode === 'create') {
      await createSpecialist(specialistData);
    }
  };

  const handleUpdateSpecialist = async (id: number, specialistData: any) => {
    await updateSpecialist(id, specialistData);
  };

  // Функции для управления системой
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const fetchBookings = async () => {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const response = await fetch(`${API_URL}/bookings/admin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Ошибка загрузки записей');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      setBookingsError('Не удалось загрузить записи');
      console.error('Ошибка загрузки записей:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const handleDeleteBooking = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Ошибка удаления записи');
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Ошибка удаления записи:', error);
      alert('Не удалось удалить запись');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Админ-панель Биосфера
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Управление ветеринарной клиникой
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Администратор
              </Badge>
              <Button onClick={handleClose} variant="outline" size="sm">
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Дашборд</span>
            </TabsTrigger>
            <TabsTrigger value="specialists" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Специалисты</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Отзывы</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4" />
              <span>Вопросы</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Записи</span>
            </TabsTrigger>
          </TabsList>

          {/* Дашборд */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Специалистов</p>
                      <p className="text-3xl font-bold">{stats.totalSpecialists}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Отзывов</p>
                      <p className="text-3xl font-bold">{stats.totalReviews}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Вопросов</p>
                      <p className="text-3xl font-bold">{stats.totalQuestions}</p>
                    </div>
                    <HelpCircle className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Средний рейтинг</p>
                      <p className="text-3xl font-bold">{stats.averageRating}</p>
                    </div>
                    <Star className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Показатели эффективности</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Время ответа (часы)</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {stats.responseTime}ч
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Новые вопросы за неделю</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {stats.newQuestionsThisWeek}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Непрочитанных вопросов</span>
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        {questions.filter(q => !q.is_read).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Отзывов с ответами</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {reviews.filter(r => r.admin_reply).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Последняя активность</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'review' ? 'bg-green-500' :
                            activity.type === 'question' ? 'bg-blue-500' :
                            'bg-purple-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                          {activity.type === 'review' && activity.rating && (
                            <div className="text-xs text-gray-500">
                              {activity.rating}⭐
                            </div>
                          )}
                          {activity.type === 'question' && (
                            <div className="text-xs text-gray-500">
                              {activity.hasReply ? '✅' : '⏳'}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Пока нет активности</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Специалисты */}
          <TabsContent value="specialists" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление специалистами</h2>
              <Button onClick={handleCreateSpecialist} className="bg-biosphere-primary hover:bg-biosphere-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Добавить специалиста
              </Button>
            </div>

            {specialistsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-biosphere-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Загрузка специалистов...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialists.map((specialist) => (
                  <Card key={specialist.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-biosphere-primary to-biosphere-secondary rounded-full overflow-hidden">
                          <img 
                            src={specialist.photo}
                            alt={specialist.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                              const fallback = document.createElement('div');
                              fallback.innerHTML = `<svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>`;
                              e.currentTarget.parentElement?.appendChild(fallback);
                            }}
                          />
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditSpecialist(specialist)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSpecialist(specialist)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{specialist.name}</h3>
                      <Badge variant="secondary" className="mb-2">
                        {specialist.position}
                      </Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {specialist.specialization}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {specialist.workplace}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Отзывы */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Управление отзывами ({reviews.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-biosphere-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Загрузка отзывов...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">
                              {review.user?.name || review.guest_name || 'Гость'}
                            </p>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                            {review.guest_phone && (
                              <p className="text-xs text-gray-500">Телефон гостя: {review.guest_phone}</p>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
                        {review.admin_reply && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Ответ администратора:</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{review.admin_reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {reviews.length > 5 && (
                      <p className="text-center text-gray-500 text-sm">
                        Показано 5 из {reviews.length} отзывов
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    Пока нет отзывов
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вопросы */}
          <TabsContent value="questions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <span>Управление вопросами ({questions.length})</span>
                  <Badge variant="secondary" className="ml-2">
                    {questions.filter(q => !q.is_read).length} непрочитанных
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {questionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-biosphere-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Загрузка вопросов...</p>
                  </div>
                ) : questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.slice(0, 10).map((question) => (
                      <div key={question.id} className={`p-4 border rounded-lg transition-all duration-200 ${
                        !question.is_read ? 'bg-blue-50 dark:bg-blue-900/200 dark:border-blue-700' : 'bg-white dark:bg-gray-800'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <div>
                              <p className="font-medium">
                                {question.user?.name || question.guest_name || 'Гость'}
                              </p>
                              <span className="text-sm text-gray-500">
                                {new Date(question.created_at).toLocaleDateString('ru-RU')}
                              </span>
                              {question.guest_phone && (
                                <p className="text-xs text-gray-500">Телефон гостя: {question.guest_phone}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={question.admin_reply ? "secondary" : "destructive"}>
                                {question.admin_reply ? 'Отвечено' : 'Ожидает ответа'}
                              </Badge>
                              <Badge variant={question.is_read ? "outline" : "default"} className={question.is_read ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"}>
                                {question.is_read ? 'Прочитано' : 'Непрочитано'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => question.is_read ? markAsUnread(question.id) : markAsRead(question.id)}
                              className={question.is_read ? "text-gray-600" : "text-blue-600"}
                            >
                              {question.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{question.text}</p>
                        {question.admin_reply && (
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">Ответ администратора:</p>
                            <p className="text-sm text-green-700 dark:text-green-300">{question.admin_reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {questions.length > 10 && (
                      <p className="text-center text-gray-500 text-sm">
                        Показано 10 из {questions.length} вопросов
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    Пока нет вопросов
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Записи */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Записи ({bookings.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-biosphere-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Загрузка записей...</p>
                  </div>
                ) : bookingsError ? (
                  <p className="text-red-600 text-center py-8">{bookingsError}</p>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div key={b.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{b.full_name}</p>
                            <div className="text-sm text-gray-500">
                              <span className="mr-2">{b.phone}</span>
                              <span>{b.email}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="secondary">{b.branch}</Badge>
                            <Badge variant="secondary">{b.doctor}</Badge>
                            <Badge variant="secondary">{b.service}</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            <span className="mr-2">Дата: {b.date}</span>
                            <span>Время: {b.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Создано: {new Date(b.created_at).toLocaleString('ru-RU')}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteBooking(b.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {b.comments && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Комментарий:</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{b.comments}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    Пока нет записей
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Модальное окно для создания/редактирования */}
      <SpecialistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        specialist={selectedSpecialist}
        onSave={handleSaveSpecialist}
        onUpdate={handleUpdateSpecialist}
        mode={modalMode}
        positions={['Ветеринарный врач', 'Ветеринарный врач-хирург', 'Ветеринарный врач-терапевт', 'Ветеринарный врач-кардиолог', 'Ветеринарный врач-офтальмолог', 'Ветеринарный врач-дерматолог']}
        workplaces={['ул. Московская, д. 4', 'ул. Ленина, д. 15', 'ул. Пушкина, д. 8', 'ул. Гагарина, д. 12', 'ул. Мира, д. 25', 'ул. Советская, д. 7']}
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
    </div>
  );
}
