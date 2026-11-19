import type {
  ApplicationDistrict,
  ApplicationLanguage,
  Gender,
  JobApplicationInput,
  StartOption,
} from '@cosmo/shared';
import { escapeHtml } from '../common/escape-html';
import type { MailMessage } from '../mail/mail.service';

const SITE_NAME = 'cosmo.mn вэбсайт';
const EMPTY = '-';

const GENDER_LABELS: Record<Gender, string> = {
  male: 'Эрэгтэй',
  female: 'Эмэгтэй',
};

const DISTRICT_LABELS: Record<ApplicationDistrict, string> = {
  bayangol: 'Баянгол',
  bayanzurkh: 'Баянзүрх',
  songinokhairkhan: 'Сонгинохайрхан',
  sukhbaatar: 'Сүхбаатар',
  khanUul: 'Хан-Уул',
  chingeltei: 'Чингэлтэй',
  nalaikh: 'Налайх',
  baganuur: 'Багануур',
  bagakhangai: 'Багахангай',
  countryside: 'Орон нутаг',
};

const LANGUAGE_LABELS: Record<ApplicationLanguage, string> = {
  english: 'Англи',
  russian: 'Орос',
  chinese: 'Хятад',
  korean: 'Солонгос',
  japanese: 'Япон',
  german: 'Герман',
};

const START_LABELS: Record<StartOption, string> = {
  now: 'Шууд',
  twoWeeks: '2 долоо хоногийн дараа',
  oneMonth: '1 сарын дараа',
  custom: 'Тодорхой огноо',
};

interface Section {
  title: string;
  rows: [string, string][];
}

export interface ApplicationPhoto {
  buffer: Buffer;
  mimetype: string;
}

function toSingleLine(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function orEmpty(value: string) {
  return value.trim() === '' ? EMPTY : value.trim();
}

function yearRange(from: string, to: string) {
  if (!from && !to) {
    return EMPTY;
  }

  return `${from || '?'}–${to || '?'}`;
}

function formatPhone(phone: string) {
  return `${phone.slice(0, 4)} ${phone.slice(4)}`;
}

function startLabel(input: JobApplicationInput) {
  if (!input.startOption) {
    return EMPTY;
  }

  if (input.startOption === 'custom' && input.startDate) {
    return input.startDate;
  }

  return START_LABELS[input.startOption];
}

function buildSections(input: JobApplicationInput): Section[] {
  const isCountryside = input.district === 'countryside';
  const education = input.education;

  const experienceRows: [string, string][] = input.hasNoExperience
    ? [['Ажлын туршлага', 'Туршлагагүй']]
    : input.previousJobs.flatMap((job, index): [string, string][] => [
        [
          `Ажлын газар ${index + 1}`,
          `${orEmpty(job.company)}, ${orEmpty(job.role)}`,
        ],
        ['Хугацаа', yearRange(job.from, job.isCurrent ? 'одоо' : job.to)],
        ['Үндсэн үүрэг', orEmpty(job.duties)],
      ]);

  return [
    {
      title: 'Хувийн мэдээлэл',
      rows: [
        ['Овог', input.lastName],
        ['Нэр', input.firstName],
        ['Нас', String(input.age)],
        ['Хүйс', GENDER_LABELS[input.gender]],
        ['Утас', formatPhone(input.phone)],
        ['Дүүрэг', input.district ? DISTRICT_LABELS[input.district] : EMPTY],
        [isCountryside ? 'Аймаг, сум' : 'Хороо', orEmpty(input.address)],
      ],
    },
    {
      title: 'Боловсрол',
      rows: [
        ['Сургууль', orEmpty(education.school)],
        ['Мэргэжил, зэрэг', orEmpty(education.degree)],
        [
          'Хугацаа',
          yearRange(
            education.from,
            education.isStudying ? 'одоо' : education.to,
          ),
        ],
      ],
    },
    {
      title: 'Ажлын туршлага',
      rows:
        experienceRows.length > 0
          ? experienceRows
          : [['Ажлын туршлага', EMPTY]],
    },
    {
      title: 'Ур чадвар',
      rows: [
        [
          'Гадаад хэл',
          input.languages.map((key) => LANGUAGE_LABELS[key]).join(', ') ||
            EMPTY,
        ],
        [
          'Программ',
          [...input.software, input.otherSoftware.trim()]
            .filter(Boolean)
            .join(', ') || EMPTY,
        ],
        ['Ажилд орох', startLabel(input)],
      ],
    },
  ];
}

function sectionText(section: Section) {
  return [
    section.title.toUpperCase(),
    ...section.rows.map(([label, value]) => `${label}: ${value}`),
  ].join('\n');
}

function sectionHtml(section: Section) {
  const rows = section.rows
    .map(
      ([label, value]) =>
        `<tr><td style="width: 180px; color: #555; vertical-align: top;">${escapeHtml(label)}</td><td style="white-space: pre-wrap;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  return `<h3 style="margin: 20px 0 6px; font-size: 13px; letter-spacing: 0.08em; color: #1b4d7f;">${escapeHtml(section.title.toUpperCase())}</h3><table cellpadding="6" style="border-collapse: collapse; font-size: 14px;">${rows}</table>`;
}

function photoFilename(input: JobApplicationInput, photo: ApplicationPhoto) {
  const extension = photo.mimetype === 'image/png' ? 'png' : 'jpg';
  return `tseej-zurag-${input.phone}.${extension}`;
}

export function buildApplicationEmail(
  input: JobApplicationInput,
  jobTitle: string,
  photo: ApplicationPhoto,
  recipient: string,
): MailMessage {
  const fullName = `${input.lastName} ${input.firstName}`;
  const sections = buildSections(input);
  const language = input.locale.toUpperCase();

  const text = [
    `Энэ анкет ${SITE_NAME}-аар «${jobTitle}» ажлын байранд илгээгдсэн.`,
    `Цээж зураг хавсралтад байна. Сайтын хэл: ${language}`,
    '',
    ...sections.map(sectionText).join('\n\n').split('\n'),
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #222;">
      <p style="color: #666;">Энэ анкет <b>${SITE_NAME}</b>-аар илгээгдсэн. Цээж зураг хавсралтад байна.</p>
      <h2 style="margin: 0 0 4px; font-size: 20px;">${escapeHtml(fullName)}</h2>
      <p style="margin: 0; color: #1b4d7f;"><b>${escapeHtml(jobTitle)}</b> · ${escapeHtml(formatPhone(input.phone))} · ${language}</p>
      ${sections.map(sectionHtml).join('')}
    </div>
  `;

  return {
    to: recipient,
    subject: toSingleLine(`[${SITE_NAME}] Анкет: ${jobTitle} — ${fullName}`),
    html,
    text,
    attachments: [
      { filename: photoFilename(input, photo), content: photo.buffer },
    ],
  };
}
