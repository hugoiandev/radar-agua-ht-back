import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : [];

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (/^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
      if (allowedOrigins.some((o) => origin === o || origin.endsWith(o))) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  // Health check para Railway
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/health', (_req: any, res: any) => res.status(200).json({ status: 'ok' }));

  const config = new DocumentBuilder()
    .setTitle('Radar Água Hortolândia')
    .setDescription('API para monitoramento da qualidade da água em Hortolândia/SP')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend rodando na porta ${port}`);
}
bootstrap();
