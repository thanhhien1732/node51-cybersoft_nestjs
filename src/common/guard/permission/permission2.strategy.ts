// Paste code từ phần Implementing Passport JWT của trang https://docs.nestjs.com/recipes/passport#implementing-passport-jwt
import { Strategy } from 'passport-custom';  // npm i passport-custom
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ACCESS_TOKEN_SECRET } from 'src/common/constant/app.constant';
import { Users } from 'generated/prisma';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { Request } from 'express';
// import { jwtConstants } from './constants';

@Injectable()
export class PermissionStrategy2 extends PassportStrategy(Strategy, 'permission') {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async validate(req: Request & { user: Users }) {
        console.log(`GUARD ----- PERMISSION - validate`)

        const user = req?.user
        if (!user) {
            console.log(`User Not Found In Protect`)
            throw new BadRequestException("User Not Found")
        }

        // role admin thì cho qua
        if (user.roleId === 1) {

            return user;
        }

        //method
        const method = req.method

        //endpoint
        const endpoint = req.baseUrl + req.route?.path

        const rolePermissionExist = await this.prisma.rolePermission.findFirst({
            where: {
                roleId: user.roleId,
                Permissions: {
                    endpoint: endpoint,
                    method: method,
                },

                isActive: true
            }
        })

        if (!rolePermissionExist) {
            throw new BadRequestException("User not Permission")
        }

        return user;
    }
}
