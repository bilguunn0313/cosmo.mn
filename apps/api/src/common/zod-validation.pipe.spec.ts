import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const pipe = new ZodValidationPipe(
    z.object({
      name: z.string().min(2),
      count: z.number().default(1),
    }),
  );

  it('зөв өгөгдлийг default утгатай нь буцаана', () => {
    expect(pipe.transform({ name: 'Бат' })).toEqual({ name: 'Бат', count: 1 });
  });

  it('буруу өгөгдөлд 400 алдаа талбарын мэдээлэлтэй шиднэ', () => {
    try {
      pipe.transform({ name: 'Б' });
      throw new Error('алдаа шидэх ёстой байсан');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const response = (error as BadRequestException).getResponse() as {
        errors: Record<string, string[]>;
      };
      expect(response.errors.name).toBeDefined();
    }
  });
});
