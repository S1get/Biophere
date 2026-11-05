// Обновляет запасную копию прайса (server/data/pricelist.snapshot.json).
// Она нужна, если p.bios.re временно недоступен. Запуск: npm run prices:update
import { fetchFromSource, writeSnapshot, SNAPSHOT_PATH } from '../server/pricelist.mjs'

const data = await fetchFromSource(30000)
await writeSnapshot(data)
const services = data.items.filter((i) => !i.goods).length
console.log(`Сохранено: ${services} услуг и ${data.items.length - services} препаратов в ${data.sections.length} разделах → ${SNAPSHOT_PATH}`)
