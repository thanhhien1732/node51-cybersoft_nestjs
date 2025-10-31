import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from 'generated/prisma';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { SaveTotpDto } from './dto/save-totp.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { DisableTotpDto } from './dto/disable-totp.dto';
import { VerifyTotpDto } from './dto/verify-totp.dto';

@Injectable()
export class TotpService {
    constructor(private readonly prisma: PrismaService) { }

    // Bước 1: Không save secrect
    async generate(user: Users) {
        // Nếu người dùng đã bật TOTP thì không tạo nữa
        if (user.totpSecret) {
            throw new BadRequestException('User already has totpSecret');
        }

        // tạo secret
        const secret = authenticator.generateSecret();

        const url = authenticator.keyuri(user.email, "Cyber Community", secret);

        // tạo qr từ secret
        const qrCode = await toDataURL(url)

        return { secret, qrCode };
    }

    // Bước 2: Save secret 
    async save(saveTotpDto: SaveTotpDto, user: Users) {
        // Nếu người dùng đã bật TOTP thì không save nữa
        if (user.totpSecret) {
            throw new BadRequestException('User already has totpSecret');
        }

        const { token, secret } = saveTotpDto;

        const isCheck = authenticator.check(token, secret);

        if (!isCheck) {
            throw new BadRequestException('Token invalid');
        }

        await this.prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                totpSecret: secret
            },
        });

        return true;
    }

    // Tắt TOTP: Chỉ áp dụng cho người đã bật
    async disable(disableTotpDto: DisableTotpDto, user: Users) {
        if (!user.totpSecret) {
            throw new BadRequestException('User does not have totpSecret');
        }

        const { token } = disableTotpDto;

        const isCheck = authenticator.check(token, user.totpSecret);
        if (!isCheck) {
            throw new BadRequestException('Token invalid');
        }

        await this.prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                totpSecret: null
            },
        });

        return true;
    }

    // Xác thực token: Chỉ áp dụng cho người đã bật
    verify(verifyTotpDto: VerifyTotpDto, user: Users) {
        if (!user.totpSecret) {
            throw new BadRequestException('User does not have totpSecret');
        }

        const { token } = verifyTotpDto;

        const isCheck = authenticator.check(token, user.totpSecret);
        if (!isCheck) {
            throw new BadRequestException('Token invalid');
        }

        return true;
    }
}
