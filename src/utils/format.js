import dayjs from 'dayjs';

export function formatDate(iso) {
  return dayjs(iso).format('DD MMM YYYY • HH:mm');
}

export function excerpt(text, max = 140) {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max)}…`;
}

export function unique(list) {
  return Array.from(new Set(list));
}
