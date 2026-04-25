import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistory(period: '24h' | '7d' | '30d', neighborhoodId?: string) {
    const periodMs: Record<string, number> = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    const since = new Date(Date.now() - periodMs[period]);

    const evaluations = await this.prisma.evaluation.findMany({
      where: {
        createdAt: { gte: since },
        ...(neighborhoodId ? { neighborhoodId } : {}),
      },
      select: { odor: true, color: true, taste: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const bucketSize = period === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    const buckets = new Map<string, { sum: number; count: number; time: Date }>();

    for (const e of evaluations) {
      const bucketTime = new Date(
        Math.floor(e.createdAt.getTime() / bucketSize) * bucketSize,
      );
      const key = bucketTime.toISOString();
      const avg = (e.odor + e.color + e.taste) / 3;

      if (!buckets.has(key)) {
        buckets.set(key, { sum: 0, count: 0, time: bucketTime });
      }
      const bucket = buckets.get(key)!;
      bucket.sum += avg;
      bucket.count += 1;
    }

    const points = Array.from(buckets.values()).map((b) => ({
      time: b.time.toISOString(),
      index: parseFloat((b.sum / b.count).toFixed(2)),
      count: b.count,
    }));

    const trend = this.calcTrend(points);

    return { period, points, trend, totalEvaluations: evaluations.length };
  }

  private calcTrend(points: { index: number }[]): 'melhora' | 'piora' | 'estavel' {
    if (points.length < 2) return 'estavel';
    const first = points.slice(0, Math.ceil(points.length / 2));
    const last = points.slice(Math.floor(points.length / 2));
    const avgFirst = first.reduce((s, p) => s + p.index, 0) / first.length;
    const avgLast = last.reduce((s, p) => s + p.index, 0) / last.length;
    if (avgLast - avgFirst > 0.3) return 'melhora';
    if (avgFirst - avgLast > 0.3) return 'piora';
    return 'estavel';
  }
}
