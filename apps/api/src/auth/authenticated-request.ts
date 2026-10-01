import type { Request } from 'express';

export interface AuthAdmin {
  id: number;
  email: string;
  name: string;
}

export interface JwtPayload {
  sub: number;
}

export interface AuthenticatedRequest extends Request {
  admin: AuthAdmin;
}
