const BYTE_UNITS = ["B", "KB", "MB", "GB"];

export function formatBytes(bytes: number) {
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const digits = value < 10 && unitIndex > 0 ? 1 : 0;
  return `${value.toFixed(digits)} ${BYTE_UNITS[unitIndex]}`;
}

const dateFormatter = new Intl.DateTimeFormat("mn-MN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(isoDate));
}

const MINUTE_MS = 60_000;

export function toDateTimeInput(isoDate: string | null) {
  if (!isoDate) {
    return "";
  }

  const date = new Date(isoDate);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * MINUTE_MS);
  return local.toISOString().slice(0, 16);
}

export function fromDateTimeInput(value: string) {
  return new Date(value).toISOString();
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
