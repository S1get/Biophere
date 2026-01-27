import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Phone, HeartPulse, Shield, CheckCircle } from 'lucide-react';
import { ArticleNavigation } from './ArticleNavigation';

export default function About24_7Page() {
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
            <Clock className="h-10 w-10 text-biosphere-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900 dark:text-white">
            Круглосуточная <span className="text-transparent bg-clip-text bg-gradient-to-r from-biosphere-primary to-biosphere-secondary">помощь</span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Мы понимаем, что экстренные ситуации не выбирают время. Наша клиника работает 24/7, чтобы ваш питомец мог получить квалифицированную помощь в любую минуту.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {[
            {
              title: "Без выходных и праздников",
              desc: "Мы работаем 365 дней в году, включая новогодние праздники и выходные дни. Ваша безопасность — наш приоритет.",
              icon: <Clock className="h-8 w-8" />,
              color: "from-blue-500 to-cyan-500"
            },
            {
              title: "Экстренная помощь",
              desc: "В случае критических состояний наша реанимационная бригада готова к приему пациента без предварительной записи.",
              icon: <Phone className="h-8 w-8" />,
              color: "from-red-500 to-rose-500"
            },
            {
              title: "Ночной стационар",
              desc: "Врачи и ассистенты ведут непрерывное наблюдение за пациентами в стационаре даже в ночное время.",
              icon: <HeartPulse className="h-8 w-8" />,
              color: "from-emerald-500 to-teal-500"
            },
            {
              title: "Гарантия безопасности",
              desc: "В любое время суток мы обеспечиваем полный спектр диагностических услуг: УЗИ, рентген и анализы.",
              icon: <Shield className="h-8 w-8" />,
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
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10 p-10 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-5xl font-black mb-8">Мы всегда рядом</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <CheckCircle className="h-10 w-10 mx-auto mb-4 text-white" />
                <p className="font-bold text-lg">Мгновенная реакция</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <HeartPulse className="h-10 w-10 mx-auto mb-4 text-white" />
                <p className="font-bold text-lg">Круглосуточный мониторинг</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <Shield className="h-10 w-10 mx-auto mb-4 text-white" />
                <p className="font-bold text-lg">Полный спектр услуг 24/7</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Возникла проблема?</p>
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-6">Не ждите утра, если питомцу плохо. Звоните прямо сейчас:</p>
          <a href="tel:44-37-97" className="text-4xl font-black text-biosphere-primary hover:text-biosphere-secondary transition-colors inline-block">44-37-97</a>
        </div>
      </div>
    </section>
  );
} 
