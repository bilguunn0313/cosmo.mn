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
