import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

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

@Injectable()
export class OsmSyncService implements OnApplicationBootstrap {
  private readonly logger = new Logger(OsmSyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  onApplicationBootstrap() {
    // Fire-and-forget: não bloqueia o boot do app
    this.prisma.neighborhood.count().then((count) => {
      if (count === 0) {
        this.logger.log('Nenhum bairro encontrado — sincronizando com OpenStreetMap...');
        this.sync().catch((e) => this.logger.error('Erro no sync OSM:', e.message));
      } else {
        this.logger.log(`${count} bairros cadastrados. Use POST /neighborhoods/sync para atualizar.`);
      }
    });
  }

  async sync(): Promise<{ inserted: number; skipped: number; names: string[] }> {
    this.logger.log('Buscando bairros de Hortolândia via Overpass API...');

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

    this.logger.log(`Encontrados ${names.length} bairros no OSM`);

    let inserted = 0;
    let skipped = 0;

    for (const name of names) {
      const slug = toSlug(name);
      const existing = await this.prisma.neighborhood.findUnique({ where: { slug } });
      if (!existing) {
        await this.prisma.neighborhood.create({ data: { name, slug } });
        inserted++;
      } else {
        skipped++;
      }
    }

    this.logger.log(`Sync concluído: ${inserted} inseridos, ${skipped} já existiam`);
    return { inserted, skipped, names };
  }
}
