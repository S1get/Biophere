import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Hero } from '@/sections/Hero'
import { Emergency, Ticker } from '@/sections/Emergency'
import { Services } from '@/sections/Services'
import { Story } from '@/sections/Story'
import { Doctors } from '@/sections/Doctors'
import { Equipment } from '@/sections/Equipment'
import { Branches } from '@/sections/Branches'
import { Reviews } from '@/sections/Reviews'
import { FinalCta, Faq, Pharmacy } from '@/sections/Closing'
import { usePageTitle } from '@/lib/usePageTitle'

export default function Home() {
  usePageTitle()
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <>
      <Hero />
      <Ticker />
      <Services />
      <Emergency />
      <Faq />
      <Story />
      <Doctors />
      <Equipment />
      <Branches />
      <Reviews />
      <Pharmacy />
      <FinalCta />
    </>
  )
}
