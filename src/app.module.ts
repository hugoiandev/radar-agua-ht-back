import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { NeighborhoodsModule } from './neighborhoods/neighborhoods.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { FeedModule } from './feed/feed.module';
import { AlertsModule } from './alerts/alerts.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'global', ttl: 60000, limit: 60 },      // 60 req/min por IP (GETs)
      { name: 'evaluation', ttl: 600000, limit: 1 },   // 1 req/10min por IP (POST avaliação)
    ]),
    PrismaModule,
    NeighborhoodsModule,
    EvaluationsModule,
    FeedModule,
    AlertsModule,
    HistoryModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
