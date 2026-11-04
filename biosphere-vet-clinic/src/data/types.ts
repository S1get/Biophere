export type BranchId = 'stl' | 'sol' | 'mos' | 'crn' | 'ukr' | 'mgv'

export interface Staff {
  id: string | null
  name: string
  position: string | null
  branches: BranchId[] | string[]
  photo: string | null
  /** object-position для кадрирования фото, напр. "40% 30%" */
  focal?: string
}

export interface Doctor extends Staff {
  specialization: string | null
  education: string | null
  graduated: number | null
  training: string[]
}

/** Часы работы по дням недели: 0 — воскресенье … 6 — суббота. null — выходной. */
export type DayHours = [open: number, close: number] | null

export interface Branch {
  id: BranchId
  short: string
  address: string
  district: string
  phone: string
  hoursText: string[]
  hours: DayHours[] | 'always'
  coords: [lat: number, lon: number]
  photo: string
  opened: string
  openedYear: number
  about: string
  features: string[]
  yandexOrgId?: string
  routeUrl: string
}

export interface PriceVariant {
  name: string
  from: number | null
  to: number | null
}
export interface PriceItem {
  id: string
  section: number
  name: string
  variants: PriceVariant[]
}
export interface PriceSection {
  id: number
  name: string
}
export interface Pricelist {
  updatedAt: string
  source: 'live' | 'snapshot'
  sections: PriceSection[]
  items: PriceItem[]
}
