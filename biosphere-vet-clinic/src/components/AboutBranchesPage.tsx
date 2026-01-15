import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Users, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutBranchesPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">6 филиалов</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-biosphere-primary">Удобное расположение по городу</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Мы стремимся быть ближе к вам и вашим питомцам — наши филиалы расположены в разных районах города для вашего удобства.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <MapPin className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">В каждом районе города</h3>
                <p className="text-gray-700 dark:text-gray-300">Вы легко найдёте ближайший филиал — мы рядом с вами!</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Home className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Комфортные условия</h3>
                <p className="text-gray-700 dark:text-gray-300">Все филиалы оборудованы современно и удобно для животных и их владельцев.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Users className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Дружелюбный персонал</h3>
                <p className="text-gray-700 dark:text-gray-300">В каждом филиале вас встретят опытные специалисты, готовые помочь вашему питомцу.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80">
            <CardContent className="p-6 flex items-start gap-4">
              <Clock className="h-10 w-10 text-biosphere-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-2">Удобный график работы</h3>
                <p className="text-gray-700 dark:text-gray-300">Мы работаем по удобному для вас расписанию, чтобы вы могли обратиться в любое время.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-biosphere-primary/10 dark:bg-biosphere-primary/20 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-biosphere-primary">Почему это удобно?</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-8 w-8 text-biosphere-primary mb-2" />
              <span className="font-semibold">Экономия времени и сил</span>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-biosphere-primary mb-2" />
              <span className="font-semibold">Быстрый доступ к помощи</span>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          <p>
            Мы всегда рядом, чтобы заботиться о здоровье вашего питомца — выберите ближайший филиал и приходите в удобное для вас время!
          </p>
        </div>

        <Link
          to="/"
          className="fixed z-50 right-6 bottom-24 md:bottom-32 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors bg-white dark:bg-gray-800 text-biosphere-primary dark:text-biosphere-secondary border border-gray-200 dark:border-gray-700 hover:bg-biosphere-primary hover:text-white dark:hover:bg-biosphere-secondary dark:hover:text-white"
          title="На главную"
        >
          <Home className="w-6 h-6" />
        </Link>
      </div>
    </section>
  );
} 
