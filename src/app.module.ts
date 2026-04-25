import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { NeighborhoodsModule } from './neighborhoods/neighborhoods.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { FeedModule } from './feed/feed.module';
import { AlertsModule } from './alerts/alerts.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 600000, limit: 1 }]),
    PrismaModule,
    NeighborhoodsModule,
    EvaluationsModule,
    FeedModule,
    AlertsModule,
    HistoryModule,
  ],
})
export class AppModule {}
