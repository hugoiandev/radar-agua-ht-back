import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FeedService } from './feed.service';

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly service: FeedService) {}

  @Get()
  @ApiOperation({ summary: 'Timeline de relatos recentes' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(@Query('limit') limit = '20', @Query('offset') offset = '0') {
    return this.service.findAll(parseInt(limit), parseInt(offset));
  }
}
