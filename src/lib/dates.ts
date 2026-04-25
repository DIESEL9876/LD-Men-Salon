import { t } from '../i18n/he';

export function formatDateHe(date: Date): string {
  const day = date.getDate();
  const month = t.months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatWeekdayHe(date: Date): string {
  return t.days[date.getDay()];
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

// Day-without-year, e.g. "12 ביוני" — nicer for upcoming-week labels
// where the year is implicit.
export function formatDayMonthHe(date: Date): string {
  const day = date.getDate();
  const month = t.months[date.getMonth()];
  return `${day} ב${month}`;
}

// Returns "היום" / "מחר" / "אתמול" / weekday name for dates within
// the current week, or a full "12 ביוני" date otherwise.
export function formatRelativeDayHe(date: Date, now: Date = new Date()): string {
  const a = startOfDay(date).getTime();
  const b = startOfDay(now).getTime();
  const diffDays = Math.round((a - b) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return 'היום';
  if (diffDays === 1) return 'מחר';
  if (diffDays === -1) return 'אתמול';
  if (diffDays > 1 && diffDays <= 6) return `יום ${formatWeekdayHe(date)}`;
  return formatDayMonthHe(date);
}

// "ערב טוב" / "בוקר טוב" / etc — depends on the current hour.
export function greetingHe(now: Date = new Date()): string {
  const h = now.getHours();
  if (h < 5) return 'לילה טוב';
  if (h < 12) return 'בוקר טוב';
  if (h < 17) return 'צהריים טובים';
  if (h < 21) return 'ערב טוב';
  return 'לילה טוב';
}

// Header line for the home screen: "יום ראשון · 12 ביוני".
export function formatTodayHeader(now: Date = new Date()): string {
  return `יום ${formatWeekdayHe(now)} · ${formatDayMonthHe(now)}`;
}

export function combineDateTime(date: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const out = new Date(date);
  out.setHours(h, m, 0, 0);
  return out;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}
