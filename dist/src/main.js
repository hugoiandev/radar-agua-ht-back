"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
        : [];
    app.enableCors({
        origin: (origin, cb) => {
            if (!origin)
                return cb(null, true);
            if (/^http:\/\/localhost:\d+$/.test(origin))
                return cb(null, true);
            if (allowedOrigins.some((o) => origin === o || origin.endsWith(o)))
                return cb(null, true);
            cb(new Error('Not allowed by CORS'));
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Radar Água Hortolândia')
        .setDescription('API para monitoramento da qualidade da água em Hortolândia/SP')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT ?? 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Backend rodando na porta ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map