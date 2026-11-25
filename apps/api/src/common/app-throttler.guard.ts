import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return Promise.resolve(request.method === 'GET');
  }

  protected getTracker(request: Request): Promise<string> {
    const clientIpHeader = process.env.CLIENT_IP_HEADER;
    const clientIp = clientIpHeader ? request.get(clientIpHeader) : undefined;

    return clientIp ? Promise.resolve(clientIp) : super.getTracker(request);
  }
}
