import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/modules/modules-system/token/token.service';
import { get } from 'http';
import { Users } from 'generated/prisma';
import { RegisterDto } from './dto/register-auth.dto';
import { TotpService } from '../totp/totp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly totpService: TotpService
  ) { }

  // API Login
  async login(loginDto: LoginDto) {
    const { email, password, token } = loginDto

    const userExits = await this.prisma.users.findUnique({
      where: {
        email: email
      }
    })

    if (!userExits) throw new BadRequestException("Người dùng chưa tồn tại, vui lòng đăng ký!")

    // Nếu tài khoản người dùng có bật 2FA thì mới xử lý
    if (userExits.totpSecret) {
      if (userExits.totpSecret) {
        if (!token) {
          // bước 1: Không gửi token
          // trả về isTotp là true để cho FE chuyển sang giao diện nhập token
          return { isTotp: true }
        } else {
          // bước 2: Phải gửi token
          // có token rồi thì sẽ kiểm tra xem token hợp lệ hay không
          this.totpService.verify({ token: token }, userExits)
        }
      }
    }

    if (!userExits.password) {
      throw new BadRequestException("Vui lòng đăng nhập bằng mạng xã hội (gmail, facebook) để cập nhật lại mật khẩu mới trong setting")
    }

    const isPassword = bcrypt.compareSync(password, userExits.password);
    if (!isPassword) throw new BadRequestException("Mật khẩu không chính xác")

    const tokens = this.tokenService.createTokens(userExits.id)

    // sendMail(email) // gửi mail khi login

    return tokens;
  }

  // API Register
  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;

    const userExits = await this.prisma.users.findUnique({
      where: {
        email: email
      }
    })

    if (userExits) {
      throw new BadRequestException("Ông có tài khoản đăng ký chi nữa")
    }

    // Mã hóa password
    const passwordHash = bcrypt.hashSync(password, 10)  // Băm 10 lần

    // password: _ (là để loại bỏ password trong kết quả trả về)
    const { password: _, ...userNew } = await this.prisma.users.create({
      data: {
        email: email,
        password: passwordHash,
        fullName: fullName
      }
    })

    // console.log({ userNew })

    // delete userNew.password;

    return userNew;
  }

  // API Get Info User
  getInfo(user: Users) {
    return { ...user, isTotp: !!user.totpSecret };   // chuyển totpSecret thành boolean (! = fale, !! = true)
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
