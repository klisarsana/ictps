export interface EmployeeSummary {
  user_id: string;
  name: string;
  email: string;
  role: string;
  status_pemetaan: 'Lengkap' | 'Belum Selesai';
  avg_kekuatan: number;
  avg_tantangan: number;
  avg_mental: number;
  total_coaching_sessions: number;
}
