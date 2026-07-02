export type UserRole = 'admin' | 'coach' | 'karyawan';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export type BookingStatus = 'Menunggu' | 'Disetujui' | 'Reschedule' | 'Selesai';

export interface BookingCoaching {
  id: string;
  karyawan_id: string;
  coach_id: string;
  tanggal_usulan: string; // ISO Date String
  status: BookingStatus;
  teams_link: string | null;
  tanggal_reschedule: string | null; // ISO Date String
  catatan_reschedule: string | null;
  created_at?: string;
  updated_at?: string;
}
