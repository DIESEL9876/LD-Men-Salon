import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase credentials are missing. Create a .env file with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  role: 'customer' | 'admin';
  push_token: string | null;
  created_at: string;
};

export type Barber = {
  id: string;
  name: string;
  bio: string | null;
  photo_url: string | null;
  active: boolean;
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  active: boolean;
  created_at: string;
};

export type WorkingHours = {
  id: string;
  barber_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

export type Appointment = {
  id: string;
  user_id: string;
  barber_id: string;
  service_id: string;
  starts_at: string;
  ends_at: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  payment_method: 'in_store' | 'in_app';
  payment_status: 'pending' | 'paid' | 'refunded';
  price: number | null;
  notes: string | null;
  created_at: string;
};

export type AppointmentWithJoins = Appointment & {
  barber: Pick<Barber, 'id' | 'name'> | null;
  service: Pick<Service, 'id' | 'name' | 'price' | 'duration_minutes'> | null;
  profile?: Pick<Profile, 'id' | 'full_name' | 'phone'> | null;
};
