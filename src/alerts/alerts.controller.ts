import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AlertsService } from './alerts.service';

@ApiTags('alerts')
@Controller('alerts')
@UseInterceptors(CacheInterceptor)
export class AlertsController {
  constructor(private readonly service: AlertsService) {}

  @Get('active')
  @CacheTTL(60000) // 60 segundos
  @ApiOperation({ summary: 'Retorna alertas ativos de degradação da qualidade' })
  findActive() {
    return this.service.findActive();
  }
}
