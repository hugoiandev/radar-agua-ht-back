"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
const OSM_RELATION_ID = 298407;
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
function toSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
async function main() {
    console.log('Buscando bairros de Hortolândia via OpenStreetMap (Overpass API)...');
    const response = await axios_1.default.post(OVERPASS_URL, `data=${encodeURIComponent(QUERY)}`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*',
            'User-Agent': 'radar-agua-hortolandia/1.0 (educational project)',
        },
        timeout: 35000,
    });
    const elements = response.data.elements ?? [];
    const names = [
        ...new Set(elements.map((e) => e.tags?.name).filter(Boolean)),
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
//# sourceMappingURL=seed.js.map