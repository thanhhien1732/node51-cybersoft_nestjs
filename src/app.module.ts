import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './modules/modules-api/article/article.module';
import { PrismaModule } from './modules/modules-system/prisma/prisma.module';
import { AuthModule } from './modules/modules-api/auth/auth.module';
import { TokenModule } from './modules/modules-system/token/token.module';
import { ProtectStrategy2 } from './common/guard/protect/protect2.strategy';
import { PermissionStrategy2 } from './common/guard/permission/permission2.strategy';
import { TotpModule } from './modules/modules-api/totp/totp.module';

@Module({
  imports: [ArticleModule, PrismaModule, AuthModule, TokenModule, TotpModule],
  controllers: [AppController],
  providers: [AppService, ProtectStrategy2, PermissionStrategy2],
})
export class AppModule { }
