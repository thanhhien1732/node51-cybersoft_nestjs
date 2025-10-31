import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './common/constant/app.constant';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptors/response-success.interceptor';
import { ProtectGuard1 } from './common/guard/protect/protect1.guard';
import { PermissionGuard1 } from './common/guard/permission/permission1.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // GLOBAL
  const reflector = app.get(Reflector)
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }));
  app.useGlobalInterceptors(new LoggingInterceptor());                    // interceptor logging
  app.useGlobalInterceptors(new ResponseSuccessInterceptor(reflector));   // interceptor response success
  app.useGlobalGuards(new ProtectGuard1(reflector));                  // protect guard
  app.useGlobalGuards(new PermissionGuard1(reflector));               // permission guard

  // SWAGGER (code từ document của trang https://docs.nestjs.com/openapi/introduction)
  // http://localhost:3069/api-docs
  const config = new DocumentBuilder()
    .setTitle('Cyber Community')
    .setDescription('Cyber Community description')
    .setVersion('1.0')
    // .addTag('cats')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  const logger = new Logger("Bootstrap")

  await app.listen(PORT ?? 3000, () => {
    logger.log(`Server is running on http://localhost:${PORT}`)
  });
}
bootstrap();
