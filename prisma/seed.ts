import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const OSM_RELATION_ID = 298407; // Hortolândia, SP
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const QUERY = `
[out:json][timeout:30];
rel(${OSM_RELATION_ID});map_to_area->.city;
(
  node["place"~"suburb|neighbourhood|quarter|village"](area.city);
  way["place"~"suburb|neighbourhood|quarter|village"](area.city);
  relation["place"~"suburb|neighbourhood|quarter|village"](area.city);
);
out tags;
`.trim();

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('Buscando bairros de Hortolândia via OpenStreetMap (Overpass API)...');

  const response = await axios.post(OVERPASS_URL, `data=${encodeURIComponent(QUERY)}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'User-Agent': 'radar-agua-hortolandia/1.0 (educational project)',
    },
    timeout: 35000,
  });

  const elements: any[] = response.data.elements ?? [];
  const names = [
    ...new Set(elements.map((e: any) => e.tags?.name as string).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  console.log(`${names.length} bairros encontrados no OSM`);

  let inserted = 0;
  for (const name of names) {
    await prisma.neighborhood.upsert({
      where: { slug: toSlug(name) },
      update: { name },
      create: { name, slug: toSlug(name) },
    });
    inserted++;
  }

  console.log(`✅ ${inserted} bairros sincronizados.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
