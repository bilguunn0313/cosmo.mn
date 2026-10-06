import { z } from "zod";

type Issue = Parameters<z.core.$ZodErrorMap>[0];

const SIZE_UNITS: Record<string, string> = {
  string: "тэмдэгт",
  array: "зүйл",
  file: "байт",
};

const FORMAT_MESSAGES: Record<string, string> = {
  email: "Имэйл хаяг буруу байна",
  url: "Холбоос буруу байна",
  datetime: "Огноо буруу байна",
  date: "Огноо буруу байна",
  regex: "Буруу хэлбэртэй байна",
};

function sizeMessage(issue: Issue, limit: unknown, comparison: string) {
  const unit = SIZE_UNITS[String(issue.origin)];

  if (issue.origin === "string" && limit === 1 && comparison === "багадаа") {
    return "Заавал бөглөнө";
  }

  if (unit) {
    return `Хамгийн ${comparison} ${String(limit)} ${unit}`;
  }

  return comparison === "багадаа"
    ? `${String(limit)}-ээс багагүй байна`
    : `${String(limit)}-ээс ихгүй байна`;
}

export function mongolianErrorMap(issue: Issue): string | undefined {
  switch (issue.code) {
    case "invalid_type":
      return issue.input === undefined || issue.input === null
        ? "Заавал бөглөнө"
        : "Утга буруу байна";
    case "too_small":
      return sizeMessage(issue, issue.minimum, "багадаа");
    case "too_big":
      return sizeMessage(issue, issue.maximum, "ихдээ");
    case "invalid_format":
      return FORMAT_MESSAGES[String(issue.format)] ?? "Буруу хэлбэртэй байна";
    case "invalid_value":
      return "Сонголт буруу байна";
    default:
      return undefined;
  }
}

export function enableMongolianZodErrors() {
  z.config({ localeError: mongolianErrorMap });
}
