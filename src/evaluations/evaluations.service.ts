import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationDto } from './create-evaluation.dto';
import { hashIp } from '../common/ip-hash.util';
import { calcStatus } from '../neighborhoods/neighborhoods.service';

const VALID_TAGS = new Set([
  'Cheiro de esgoto',
  'Água turva',
  'Gosto estranho',
  'Cor escura',
  'Sem problemas',
]);

@Injectable()
export class EvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEvaluationDto, ip: string) {
    const ipHash = hashIp(ip);

    if (dto.tags) {
      for (const tag of dto.tags) {
        if (!VALID_TAGS.has(tag)) throw new BadRequestException(`Tag inválida: ${tag}`);
      }
    }

    const neighborhood = await this.prisma.neighborhood.findUnique({
      where: { id: dto.neighborhoodId },
    });
    if (!neighborhood) throw new BadRequestException('Bairro não encontrado');

    const evaluation = await this.prisma.evaluation.create({
      data: {
        neighborhoodId: dto.neighborhoodId,
        odor: dto.odor,
        color: dto.color,
        taste: dto.taste,
        tags: dto.tags ?? [],
        comment: dto.comment,
        ipHash,
      },
      include: { neighborhood: true },
    });

    await this.checkAndTriggerAlert(dto.neighborhoodId);

    return evaluation;
  }

  async getCityIndex() {
    const evals = await this.prisma.evaluation.findMany({
      select: { odor: true, color: true, taste: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    if (evals.length === 0) return { index: null, status: null, totalEvaluations: 0 };

    const avg = evals.reduce((sum, e) => sum + (e.odor + e.color + e.taste) / 3, 0) / evals.length;
    return {
      index: parseFloat(avg.toFixed(2)),
      status: calcStatus(avg),
      totalEvaluations: evals.length,
    };
  }

  private async checkAndTriggerAlert(neighborhoodId: string) {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

    const [recent, older] = await Promise.all([
      this.prisma.evaluation.findMany({
        where: { neighborhoodId, createdAt: { gte: threeHoursAgo } },
        select: { odor: true, color: true, taste: true },
      }),
      this.prisma.evaluation.findMany({
        where: { neighborhoodId, createdAt: { gte: sixHoursAgo, lt: threeHoursAgo } },
        select: { odor: true, color: true, taste: true },
      }),
    ]);

    if (recent.length < 3 || older.length < 3) return;

    const avgRecent = recent.reduce((s, e) => s + (e.odor + e.color + e.taste) / 3, 0) / recent.length;
    const avgOlder = older.reduce((s, e) => s + (e.odor + e.color + e.taste) / 3, 0) / older.length;

    if (avgOlder - avgRecent >= 1.5) {
      const neighborhood = await this.prisma.neighborhood.findUnique({ where: { id: neighborhoodId } });
      await this.prisma.alert.create({
        data: {
          neighborhoodId,
          message: `Qualidade da água caiu nas últimas horas no bairro ${neighborhood?.name}`,
        },
      });
    }
  }
}
