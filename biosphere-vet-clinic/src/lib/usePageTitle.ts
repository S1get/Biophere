import { useEffect } from 'react'

const BASE = 'Биосфера — сеть ветеринарных клиник в Кирове'

export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Биосфера, Киров` : `${BASE} · круглосуточно`
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
