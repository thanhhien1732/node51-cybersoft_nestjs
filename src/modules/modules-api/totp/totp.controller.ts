import { Body, Controller, Post } from '@nestjs/common';
import { TotpService } from './totp.service';
import { User } from 'src/common/decorators/user.decorator';
import type { Users } from 'generated/prisma';  // thêm type
import { SkipPermission } from 'src/common/decorators/skip-permission.decorator';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { SaveTotpDto } from './dto/save-totp.dto';
import { DisableTotpDto } from './dto/disable-totp.dto';
import { VerifyTotpDto } from './dto/verify-totp.dto';

@Controller('totp')
export class TotpController {
  constructor(private readonly totpService: TotpService) { }

  @Post('generate')
  @SkipPermission()
  @MessageResponse('GENERATE SUCCESS')
  generate(@User() user: Users) {
    return this.totpService.generate(user);
  }

  @Post('save')
  @SkipPermission()
  @MessageResponse('save success')
  save(@Body() saveTotpDto: SaveTotpDto, @User() user: Users) {
    return this.totpService.save(saveTotpDto, user);
  }

  @Post('disable')
  @SkipPermission()
  @MessageResponse('disable success')
  disable(@Body() disableTotpDto: DisableTotpDto, @User() user: Users) {
    return this.totpService.disable(disableTotpDto, user);
  }

  @Post('verify')
  @SkipPermission()
  @MessageResponse('verify success')
  verify(@Body() verifyTotpDto: VerifyTotpDto, @User() user: Users) {
    return this.totpService.verify(verifyTotpDto, user);
  }
}
