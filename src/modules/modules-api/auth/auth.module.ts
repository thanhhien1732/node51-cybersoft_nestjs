import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/modules/modules-system/token/token.module';
import { TotpModule } from '../totp/totp.module';

@Module({
  imports: [TokenModule, TotpModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
