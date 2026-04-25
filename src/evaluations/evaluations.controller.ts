import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './create-evaluation.dto';
import type { Request } from 'express';

@ApiTags('evaluations')
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly service: EvaluationsService) {}

  @Post()
  @Throttle({ default: { limit: 1, ttl: 600000 } })
  @ApiOperation({ summary: 'Envia avaliação da qualidade da água (anônimo, 1 por 10min por IP)' })
  create(@Body() dto: CreateEvaluationDto, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? req.ip ?? '0.0.0.0';
    return this.service.create(dto, ip);
  }

  @Get('city-index')
  @ApiOperation({ summary: 'Retorna índice geral de qualidade da cidade' })
  getCityIndex() {
    return this.service.getCityIndex();
  }
}
