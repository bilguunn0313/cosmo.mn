import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { changePasswordSchema, loginSchema } from '@cosmo/shared';
import type { ChangePasswordInput, LoginInput } from '@cosmo/shared';
import type { CookieOptions, Response } from 'express';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE_MS } from './auth.constants';
import { AuthService } from './auth.service';
import type { AuthAdmin } from './authenticated-request';
import { CurrentAdmin } from './current-admin.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

function accessTokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
  };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiZodBody(loginSchema)
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, admin } = await this.authService.login(body);

    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...accessTokenCookieOptions(),
      maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    });

    return admin;
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN_COOKIE, accessTokenCookieOptions());
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  me(@CurrentAdmin() admin: AuthAdmin) {
    return admin;
  }

  @Patch('password')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  @ApiZodBody(changePasswordSchema)
  async changePassword(
    @CurrentAdmin() admin: AuthAdmin,
    @Body(new ZodValidationPipe(changePasswordSchema))
    body: ChangePasswordInput,
  ) {
    await this.authService.changePassword(admin.id, body);
  }
}
