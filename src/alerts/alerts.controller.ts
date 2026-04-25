import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';

@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly service: AlertsService) {}

  @Get('active')
  @ApiOperation({ summary: 'Retorna alertas ativos de degradação da qualidade' })
  findActive() {
    return this.service.findActive();
  }
}
