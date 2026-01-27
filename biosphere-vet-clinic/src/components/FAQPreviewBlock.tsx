import React from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion'
import { Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const popularFaq = [
  {
    question: 'Как записаться на прием?',
    answer: 'Вы можете записаться через онлайн форму или по телефону.'
  },
  {
    question: 'Какие услуги мы предоставляем?',
    answer: 'Мы предоставляем полный спектр ветеринарных услуг: терапия, хирургия, диагностика, профилактика, стоматология и др.'
  },
  {
    question: 'Могу ли я выбрать врача?',
    answer: 'Да, вы можете выбрать специалиста при записи на прием.'
  },
  {
    question: 'Когда проводить вакцинацию?',
    answer: 'Рекомендуемая схема вакцинации зависит от возраста и состояния животного. Подробности уточняйте у наших специалистов.'
  },
  {
    question: 'Что делать при подозрении на болезнь?',
    answer: 'Обратитесь в клинику как можно скорее для консультации и диагностики.'
  },
]

export default function FAQPreviewBlock() {
  return (
    <section id="faq" className="py-16 bg-gradient-to-br from-white via-[#f0f4ff] to-[#e3eaff] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-biosphere-primary/30 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-biosphere-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-biosphere-secondary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-biosphere-primary/10 rounded-xl mb-4 rotate-6 hover:rotate-0 transition-all duration-500 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-help h-8 w-8 text-biosphere-primary"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Вопрос – <span className="text-transparent bg-clip-text bg-gradient-to-r from-biosphere-primary to-biosphere-secondary">Ответ</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Ответы на часто задаваемые вопросы о наших услугах и работе клиники
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {popularFaq.map((item, idx) => (
              <AccordionItem key={idx} value={String(idx)} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border-0 px-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-biosphere-primary to-biosphere-secondary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
                <AccordionTrigger className="text-lg font-bold text-gray-900 dark:text-white pr-4 hover:no-underline hover:text-biosphere-primary transition-colors">{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed pb-4 font-medium">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">Не нашли ответ на свой вопрос?</p>
          <Link 
            to="/faq" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-biosphere-primary to-biosphere-secondary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-biosphere-primary/40 hover:scale-105 transition-all duration-300 group"
          >
            <span>Задать свой вопрос</span>
            <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
} 
