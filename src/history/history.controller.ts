import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { HistoryService } from './history.service';

@ApiTags('history')
@Controller('history')
@UseInterceptors(CacheInterceptor)
export class HistoryController {
  constructor(private readonly service: HistoryService) {}

  @Get()
  @CacheTTL(120000) // 2 minutos
  @ApiOperation({ summary: 'Histórico de qualidade da água (city ou bairro)' })
  @ApiQuery({ name: 'period', enum: ['24h', '7d', '30d'], required: false })
  @ApiQuery({ name: 'neighborhoodId', required: false })
  getHistory(
    @Query('period') period: '24h' | '7d' | '30d' = '24h',
    @Query('neighborhoodId') neighborhoodId?: string,
  ) {
    return this.service.getHistory(period, neighborhoodId);
  }
}
