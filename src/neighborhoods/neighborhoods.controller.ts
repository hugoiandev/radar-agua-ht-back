import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { NeighborhoodsService } from './neighborhoods.service';
import { OsmSyncService } from './osm-sync.service';

@ApiTags('neighborhoods')
@Controller('neighborhoods')
@UseInterceptors(CacheInterceptor)
export class NeighborhoodsController {
  constructor(
    private readonly service: NeighborhoodsService,
    private readonly osmSync: OsmSyncService,
  ) {}

  @Get()
  @CacheTTL(300000) // 5 minutos — bairros raramente mudam
  @ApiOperation({ summary: 'Lista bairros de Hortolândia com índice de qualidade' })
  findAll() {
    return this.service.findAllWithIndex();
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sincroniza bairros com OpenStreetMap (Overpass API)' })
  sync() {
    return this.osmSync.sync();
  }
}
