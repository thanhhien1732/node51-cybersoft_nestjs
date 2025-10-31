// Paste code từ phần Implementing Passport JWT của trang https://docs.nestjs.com/recipes/passport#implementing-passport-jwt
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ACCESS_TOKEN_SECRET } from 'src/common/constant/app.constant';
import { Users } from 'generated/prisma';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
// import { jwtConstants } from './constants';

@Injectable()
export class ProtectStrategy2 extends PassportStrategy(Strategy, 'protect') {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // không bỏ qua kiểm tra hết hạn => kiểm tra hết hạn
            secretOrKey: ACCESS_TOKEN_SECRET,
        });
    }

    async validate({ userId }: { userId: Users['id'] }) {
        // paste từ source express - protect.middleware.js
        const user = await this.prisma.users.findUnique({
            where: {
                id: userId
            },
            // ẩn password tại gốc
            omit: {
                password: true
            }
        })

        if (!user) {
            {
                return false
            }
        }

        console.log(`validate`, user)

        return user;
    }
}
