import type { ContactInput } from '@cosmo/shared';
import { escapeHtml } from '../common/escape-html';
import type { MailMessage } from '../mail/mail.service';

const SITE_NAME = 'cosmo.mn вэбсайт';

function toSingleLine(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function buildContactEmail(
  input: ContactInput,
  department: { name: string; email: string },
): MailMessage {
  const name = toSingleLine(input.name);
  const phone = input.phone ? toSingleLine(input.phone) : '-';
  const language = input.locale.toUpperCase();

  const text = [
    `Энэ мессеж ${SITE_NAME}-ын холбоо барих формоор илгээгдсэн.`,
    '',
    `Алба: ${department.name}`,
    `Нэр: ${name}`,
    `Имэйл: ${input.email}`,
    `Утас: ${phone}`,
    `Сайтын хэл: ${language}`,
    '',
    input.message,
    '',
    '— Хариу бичихэд "Reply" дарахад илгээгч рүү шууд очно.',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #222;">
      <p style="color: #666;">Энэ мессеж <b>${SITE_NAME}</b>-ын холбоо барих формоор илгээгдсэн.</p>
      <table cellpadding="6" style="border-collapse: collapse;">
        <tr><td><b>Алба</b></td><td>${escapeHtml(department.name)}</td></tr>
        <tr><td><b>Нэр</b></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><b>Имэйл</b></td><td>${escapeHtml(input.email)}</td></tr>
        <tr><td><b>Утас</b></td><td>${escapeHtml(phone)}</td></tr>
        <tr><td><b>Сайтын хэл</b></td><td>${language}</td></tr>
      </table>
      <p style="white-space: pre-wrap; border-left: 3px solid #ddd; padding-left: 12px;">${escapeHtml(input.message)}</p>
      <p style="color: #888; font-size: 12px;">Хариу бичихэд "Reply" дарахад илгээгч рүү шууд очно.</p>
    </div>
  `;

  return {
    to: department.email,
    replyTo: input.email,
    subject: `[${SITE_NAME}] ${department.name}: ${name}`,
    html,
    text,
  };
}
