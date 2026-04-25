import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit: number, offset: number) {
    const evaluations = await this.prisma.evaluation.findMany({
      take: Math.min(limit, 50),
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        odor: true,
        color: true,
        taste: true,
        tags: true,
        comment: true,
        createdAt: true,
        neighborhood: { select: { id: true, name: true, slug: true } },
      },
    });

    return evaluations.map((e) => ({
      ...e,
      avgIndex: parseFloat(((e.odor + e.color + e.taste) / 3).toFixed(2)),
    }));
  }
}
