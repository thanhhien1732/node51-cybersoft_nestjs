import { Module } from '@nestjs/common';
import { TotpService } from './totp.service';
import { TotpController } from './totp.controller';

@Module({
  controllers: [TotpController],
  providers: [TotpService],
  exports: [TotpService],
})
export class TotpModule { }
