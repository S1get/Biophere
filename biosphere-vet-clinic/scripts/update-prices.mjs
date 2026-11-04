// Обновляет запасную копию прайса (server/data/pricelist.snapshot.json).
// Она нужна, если p.bios.re временно недоступен. Запуск: npm run prices:update
import { fetchFromSource, writeSnapshot, SNAPSHOT_PATH } from '../server/pricelist.mjs'

const data = await fetchFromSource(30000)
await writeSnapshot(data)
console.log(`Сохранено: ${data.items.length} услуг в ${data.sections.length} разделах → ${SNAPSHOT_PATH}`)
