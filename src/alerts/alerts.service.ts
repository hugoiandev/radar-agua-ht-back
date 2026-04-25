import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async findActive() {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.prisma.alert.findMany({
      where: { active: true, triggeredAt: { gte: since } },
      include: { neighborhood: { select: { name: true, slug: true } } },
      orderBy: { triggeredAt: 'desc' },
    });
  }
}
