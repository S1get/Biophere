import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, CheckCircle, Home } from 'lucide-react';
import { ArticleNavigation } from './ArticleNavigation';

export default function AboutBranchesPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-[#f0f4ff] to-[#e3eaff] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-biosphere-primary/30 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-biosphere-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-biosphere-secondary/5 rounded-full blur-3xl"></div>
      
      <ArticleNavigation />
      
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-biosphere-primary/10 rounded-2xl mb-6 rotate-3 hover:rotate-0 transition-all duration-500 shadow-inner">
            <MapPin className="h-10 w-10 text-biosphere-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900 dark:text-white">
            Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-biosphere-primary to-biosphere-secondary">филиалы</span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Мы стремимся быть ближе к вам и вашим питомцам. 6 филиалов в разных районах города — это доступная помощь там, где вам удобно.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {[
            {
              title: "В каждом районе города",
              desc: "Вы легко найдёте ближайший филиал — мы рядом с вами, чтобы путь к врачу был быстрым и комфортным.",
              icon: <MapPin className="h-8 w-8" />,
              color: "from-blue-500 to-cyan-500"
            },
            {
              title: "Комфортные условия",
              desc: "Все филиалы оборудованы современно и удобно для животных и их владельцев. Просторные залы ожидания и уютные кабинеты.",
              icon: <Home className="h-8 w-8" />,
              color: "from-indigo-500 to-blue-600"
            },
            {
              title: "Дружелюбный персонал",
              desc: "В каждом филиале вас встретят опытные специалисты, готовые помочь вашему питомцу с любовью и вниманием.",
              icon: <Users className="h-8 w-8" />,
              color: "from-emerald-500 to-teal-500"
            },
            {
              title: "Удобный график",
              desc: "Мы работаем по удобному расписанию, включая вечерние часы и выходные, чтобы вы могли обратиться в любое время.",
              icon: <Clock className="h-8 w-8" />,
              color: "from-violet-500 to-purple-500"
            }
          ].map((item, idx) => (
            <Card key={idx} className="group hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] transition-all duration-500 border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-biosphere-primary to-biosphere-secondary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
              <CardContent className="p-8 flex items-start gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white group-hover:text-biosphere-primary transition-colors">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517614648417-2f575882aa4d?q=80&w=2070')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10 p-10 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-5xl font-black mb-8">Рядом с вашим домом</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <CheckCircle className="h-10 w-10 mx-auto mb-4 text-white" />
                <p className="font-bold text-lg">Экономия вашего времени</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <MapPin className="h-10 w-10 mx-auto mb-4 text-white" />
                <p className="font-bold text-lg">Быстрый доступ к помощи</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Выберите свой филиал</p>
          <p className="text-gray-600 dark:text-gray-300 font-medium max-w-2xl mx-auto">
            Мы всегда рядом, чтобы заботиться о здоровье вашего питомца. Приходите в ближайший к вам филиал и убедитесь в качестве нашего сервиса лично.
          </p>
        </div>
      </div>
    </section>
  );
} 
