import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NeighborhoodsService } from './neighborhoods.service';
import { OsmSyncService } from './osm-sync.service';

@ApiTags('neighborhoods')
@Controller('neighborhoods')
export class NeighborhoodsController {
  constructor(
    private readonly service: NeighborhoodsService,
    private readonly osmSync: OsmSyncService,
  ) {}

  @Get()
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
