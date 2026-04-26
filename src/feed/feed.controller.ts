import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { FeedService } from './feed.service';

@ApiTags('feed')
@Controller('feed')
@UseInterceptors(CacheInterceptor)
export class FeedController {
  constructor(private readonly service: FeedService) {}

  @Get()
  @CacheTTL(30000) // 30 segundos — feed muda com frequência
  @ApiOperation({ summary: 'Timeline de relatos recentes' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query('limit') limit = '20', @Query('offset') offset = '0') {
    return this.service.findAll(parseInt(limit), parseInt(offset));
  }
}
