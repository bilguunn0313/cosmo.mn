import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthAdmin, AuthenticatedRequest } from './authenticated-request';

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthAdmin => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.admin;
  },
);
