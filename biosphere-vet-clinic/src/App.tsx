import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MobileBar } from '@/components/MobileBar'
import { BookingProvider } from '@/components/booking/BookingContext'
import Home from '@/pages/Home'
import { NotFound, Privacy } from '@/pages/Misc'

const Prices = lazy(() => import('@/pages/Prices'))
const DoctorsPage = lazy(() => import('@/pages/DoctorsPage'))
const Admin = lazy(() => import('@/pages/Admin'))

/** Прокрутка наверх при переходе и учёт просмотров (без cookies и IP) */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    const body = JSON.stringify({ path: pathname })
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
  }, [pathname])
  return null
}

function Layout() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-full bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        К содержанию
      </a>
      <Header />
      <main id="main">
        <Suspense fallback={<div className="min-h-[70vh]" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <MobileBar />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <RouteEffects />
        <Layout />
      </BookingProvider>
    </BrowserRouter>
  )
}
