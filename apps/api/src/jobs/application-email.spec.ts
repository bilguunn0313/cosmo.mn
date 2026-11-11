import type { JobApplicationInput } from '@cosmo/shared';
import { buildApplicationEmail } from './application-email';

describe('buildApplicationEmail', () => {
  const photo = { buffer: Buffer.from('photo'), mimetype: 'image/jpeg' };
  const input: JobApplicationInput = {
    locale: 'mn',
    lastName: 'Батын',
    firstName: 'Болд',
    age: 26,
    gender: 'male',
    phone: '88093511',
    district: 'khanUul',
    address: '3-р хороо',
    education: {
      school: 'МУИС',
      degree: '',
      from: '2016',
      to: '',
      isStudying: true,
    },
    hasNoExperience: false,
    previousJobs: [
      {
        company: 'ABC ХХК',
        role: 'Борлуулагч',
        from: '2020',
        to: '',
        isCurrent: true,
        duties: '',
      },
    ],
    languages: ['english'],
    software: ['Excel'],
    otherSoftware: '',
    startOption: 'twoWeeks',
    startDate: '',
  };

  it('хүний нөөцийн имэйл рүү ажлын байр, нэртэй гарчигтай илгээнэ', () => {
    const email = buildApplicationEmail(
      input,
      'Борлуулалтын төлөөлөгч',
      photo,
      'hr@cosmo.mn',
    );

    expect(email.to).toBe('hr@cosmo.mn');
    expect(email.subject).toBe(
      '[cosmo.mn вэбсайт] Анкет: Борлуулалтын төлөөлөгч — Батын Болд',
    );
  });

  it('цээж зургийг хавсралтаар нэмнэ', () => {
    const email = buildApplicationEmail(input, 'Нярав', photo, 'hr@cosmo.mn');

    expect(email.attachments).toEqual([
      { filename: 'tseej-zurag-88093511.jpg', content: photo.buffer },
    ]);
  });

  it('утас, хүйс, дүүрэг, одоо ажиллаж буй ажлыг ойлгомжтой бичнэ', () => {
    const { text } = buildApplicationEmail(
      input,
      'Нярав',
      photo,
      'hr@cosmo.mn',
    );

    expect(text).toContain('Утас: 8809 3511');
    expect(text).toContain('Хүйс: Эрэгтэй');
    expect(text).toContain('Дүүрэг: Хан-Уул');
    expect(text).toContain('Хугацаа: 2016–одоо');
    expect(text).toContain('Хугацаа: 2020–одоо');
  });

  it('орон нутаг сонгосон бол хаягийг «Аймаг, сум» гэж бичнэ', () => {
    const { text } = buildApplicationEmail(
      { ...input, district: 'countryside', address: 'Дархан' },
      'Нярав',
      photo,
      'hr@cosmo.mn',
    );

    expect(text).toContain('Аймаг, сум: Дархан');
  });

  it('нэрэн дэх мөр шилжилтийг арилгаж гарчгийг нэг мөр болгоно', () => {
    const email = buildApplicationEmail(
      { ...input, firstName: 'Болд\r\nBcc: x@y.z' },
      'Нярав',
      photo,
      'hr@cosmo.mn',
    );

    expect(email.subject).not.toMatch(/[\r\n]/);
  });

  it('горилогчийн бичсэн HTML-ийг escape хийнэ', () => {
    const email = buildApplicationEmail(
      { ...input, lastName: '<script>alert(1)</script>' },
      'Нярав',
      photo,
      'hr@cosmo.mn',
    );

    expect(email.html).not.toContain('<script>');
    expect(email.html).toContain('&lt;script&gt;');
  });
});
