// ───────────────────────────────────────────────────────────────────────────
// Placeholder data used across the app while wiring up the real backend.
// Swap with real Supabase-backed data later.
// ───────────────────────────────────────────────────────────────────────────

export type PlaceholderBarber = {
  id: string;
  name: string;
  role: string;
  specialty: string;
  rating?: number;
};

export const PLACEHOLDER_BARBERS: PlaceholderBarber[] = [
  { id: 'b1', name: 'אבי כהן', role: 'Master Barber', specialty: 'תספורות קלאסיות', rating: 4.9 },
  { id: 'b2', name: 'רן לוי', role: 'Senior Stylist', specialty: 'פייד ועיצוב זקן', rating: 4.8 },
  { id: 'b3', name: 'דניאל אזולאי', role: 'Senior Stylist', specialty: 'גילוח חם ושיח', rating: 4.9 },
  { id: 'b4', name: 'יוסי ביטון', role: 'Junior Stylist', specialty: 'תספורות ילדים ונוער', rating: 4.7 },
];

export type PlaceholderService = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  popular?: boolean;
};

export const PLACEHOLDER_SERVICES: PlaceholderService[] = [
  { id: 's1', name: 'תספורת קלאסית', description: 'גברית, מדויקת, 45 דקות', duration: 45, price: 120, popular: true },
  { id: 's2', name: 'תספורת + זקן', description: 'תספורת ועיצוב זקן מלא', duration: 60, price: 160 },
  { id: 's3', name: 'גילוח חם', description: 'מגבת חמה, שמנים, 30 דק׳', duration: 30, price: 90 },
  { id: 's4', name: 'צביעה לגברים', description: 'כיסוי שיבה עדין', duration: 45, price: 140 },
];

// Business identity (used by brandmark / drawer / home).
export const BUSINESS = {
  name: 'המספרה',
  tagline: 'מספרת גברים · סטייל וגימור',
  phone: '03-000-0000',
  address: 'רחוב דיזנגוף 100, תל אביב',
  hoursLabel: 'פתוח עכשיו',
  hoursDetail: 'עד 22:00 הערב',
};

// Shown on Home hero when no real "next appointment" exists yet.
export const PLACEHOLDER_NEXT_APPOINTMENT = {
  dateLabel: 'יום שלישי',
  dateSub: '23 באפריל',
  time: '18:30',
  service: 'תספורת + זקן',
  barberName: 'אבי כהן',
  location: BUSINESS.address,
};

// Upcoming + past appointments for MyAppointmentsScreen demo state.
export const PLACEHOLDER_UPCOMING = [
  {
    id: 'a1',
    date: 'יום שלישי',
    dateSub: '23 באפריל',
    time: '18:30',
    service: 'תספורת + זקן',
    barber: 'אבי כהן',
    price: 160,
  },
  {
    id: 'a2',
    date: 'יום שני',
    dateSub: '6 במאי',
    time: '11:00',
    service: 'תספורת קלאסית',
    barber: 'רן לוי',
    price: 120,
  },
];

export const PLACEHOLDER_PAST = [
  {
    id: 'p1',
    date: 'יום שישי',
    dateSub: '11 באפריל',
    time: '10:00',
    service: 'תספורת + זקן',
    barber: 'אבי כהן',
    price: 160,
    status: 'completed' as const,
  },
  {
    id: 'p2',
    date: 'יום שלישי',
    dateSub: '18 במרץ',
    time: '17:30',
    service: 'גילוח חם',
    barber: 'דניאל אזולאי',
    price: 90,
    status: 'cancelled' as const,
  },
];
