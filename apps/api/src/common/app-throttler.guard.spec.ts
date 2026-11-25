import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ThrottlerStorage } from '@nestjs/throttler';
import type { Request } from 'express';
import { AppThrottlerGuard } from './app-throttler.guard';

class TestGuard extends AppThrottlerGuard {
  tracker(request: Request) {
    return this.getTracker(request);
  }

  skip(context: ExecutionContext) {
    return this.shouldSkip(context);
  }
}

function fakeRequest(method: string, headers: Record<string, string> = {}) {
  return {
    method,
    ip: '10.0.0.1',
    ips: [],
    get: (name: string) => headers[name.toLowerCase()],
  } as unknown as Request;
}

function contextFor(request: Request) {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('AppThrottlerGuard', () => {
  const guard = new TestGuard([], {} as ThrottlerStorage, new Reflector());

  afterEach(() => {
    delete process.env.CLIENT_IP_HEADER;
  });

  it('GET хүсэлтийг тоолохгүй, бусдыг тоолно', async () => {
    await expect(guard.skip(contextFor(fakeRequest('GET')))).resolves.toBe(true);
    await expect(guard.skip(contextFor(fakeRequest('POST')))).resolves.toBe(
      false,
    );
  });

  it('CLIENT_IP_HEADER-ийн хамгийн сүүлийн IP-г авна', async () => {
    process.env.CLIENT_IP_HEADER = 'x-forwarded-for';
    const request = fakeRequest('POST', {
      'x-forwarded-for': '6.6.6.6, 203.0.113.5',
    });

    await expect(guard.tracker(request)).resolves.toBe('203.0.113.5');
  });

  it('header байхгүй бол request.ip-г авна', async () => {
    process.env.CLIENT_IP_HEADER = 'x-forwarded-for';

    await expect(guard.tracker(fakeRequest('POST'))).resolves.toBe('10.0.0.1');
  });
});
