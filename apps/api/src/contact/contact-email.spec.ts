import { buildContactEmail } from './contact-email';

describe('buildContactEmail', () => {
  const department = { name: 'Хамтран ажиллах', email: 'sales@cosmo.mn' };
  const input = {
    name: 'Бат',
    email: 'bat@mail.com',
    phone: '99112233',
    message: 'Сайн байна уу',
    locale: 'en' as const,
  };

  it('албаны имэйл рүү илгээж, хариуг зочин руу чиглүүлнэ', () => {
    const email = buildContactEmail(input, department);

    expect(email.to).toBe('sales@cosmo.mn');
    expect(email.replyTo).toBe('bat@mail.com');
  });

  it('гарчигт вэбсайтын нэр, алба, илгээгчийн нэр орно', () => {
    expect(buildContactEmail(input, department).subject).toBe(
      '[cosmo.mn вэбсайт] Хамтран ажиллах: Бат',
    );
  });

  it('нэрэн дэх мөр шилжилтийг арилгаж гарчгийг нэг мөр болгоно', () => {
    const email = buildContactEmail(
      { ...input, name: 'Бат\r\nBcc: x@y.z' },
      department,
    );

    expect(email.subject).not.toMatch(/[\r\n]/);
  });

  it('зочны бичсэн HTML-ийг escape хийнэ', () => {
    const email = buildContactEmail(
      { ...input, message: '<script>alert(1)</script>' },
      department,
    );

    expect(email.html).not.toContain('<script>');
    expect(email.html).toContain('&lt;script&gt;');
  });

  it('текст хувилбарт утас, сайтын хэл орно', () => {
    const { text } = buildContactEmail(input, department);

    expect(text).toContain('Утас: 99112233');
    expect(text).toContain('Сайтын хэл: EN');
  });
});
