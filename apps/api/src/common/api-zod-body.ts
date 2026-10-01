import { ApiBody } from '@nestjs/swagger';
import { z, ZodType } from 'zod';

export function ApiZodBody(schema: ZodType) {
  return ApiBody({ schema: z.toJSONSchema(schema, { io: 'input' }) as object });
}
