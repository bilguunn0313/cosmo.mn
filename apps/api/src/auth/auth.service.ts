import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ChangePasswordInput, LoginInput } from '@cosmo/shared';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthAdmin, JwtPayload } from './authenticated-request';

export const PASSWORD_SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginInput) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    const isPasswordValid =
      admin !== null &&
      (await bcrypt.compare(input.password, admin.passwordHash));

    if (!admin || !isPasswordValid) {
      throw new UnauthorizedException('Имэйл эсвэл нууц үг буруу байна');
    }

    const payload: JwtPayload = { sub: admin.id };
    const accessToken = await this.jwtService.signAsync(payload);
    const authAdmin: AuthAdmin = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };

    return { accessToken, admin: authAdmin };
  }

  async changePassword(adminId: number, input: ChangePasswordInput) {
    const admin = await this.prisma.admin.findUniqueOrThrow({
      where: { id: adminId },
    });
    const isPasswordValid = await bcrypt.compare(
      input.currentPassword,
      admin.passwordHash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Одоогийн нууц үг буруу байна');
    }

    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        passwordHash: await bcrypt.hash(
          input.newPassword,
          PASSWORD_SALT_ROUNDS,
        ),
      },
    });
  }
}
