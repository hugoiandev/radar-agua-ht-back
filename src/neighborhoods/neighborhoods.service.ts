import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type WaterStatus = 'boa' | 'atencao' | 'critica';

export function calcStatus(avg: number): WaterStatus {
  if (avg >= 4) return 'boa';
  if (avg >= 2.5) return 'atencao';
  return 'critica';
}

@Injectable()
export class NeighborhoodsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWithIndex() {
    const neighborhoods = await this.prisma.neighborhood.findMany({
      include: {
        evaluations: {
          select: { odor: true, color: true, taste: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
      },
      orderBy: { name: 'asc' },
    });

    return neighborhoods.map((n) => {
      const evals = n.evaluations;
      if (evals.length === 0) {
        return { id: n.id, name: n.name, slug: n.slug, index: null, status: null, totalEvaluations: 0 };
      }
      const avg =
        evals.reduce((sum, e) => sum + (e.odor + e.color + e.taste) / 3, 0) / evals.length;
      return {
        id: n.id,
        name: n.name,
        slug: n.slug,
        index: parseFloat(avg.toFixed(2)),
        status: calcStatus(avg),
        totalEvaluations: evals.length,
      };
    });
  }
}
