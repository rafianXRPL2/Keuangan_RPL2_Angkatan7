export interface StudentMonthlyData {
  m1?: number;
  m2?: number;
  m3?: number;
  m4?: number;
}

export interface MonthData {
  [studentId: string]: StudentMonthlyData;
}

export interface MasterKasData {
  [monthName: string]: MonthData;
}

export interface PengeluaranItem {
  id?: string;
  tanggal: string;
  keperluan: string;
  kategori?: string;
  nominal: number;
  nota?: string;
}

export interface PemasukanLainItem {
  id?: string;
  tanggal: string;
  sumber: string;
  nominal: number;
  bukti?: string;
}

export interface AnggaranItem {
  id?: string;
  kegiatan: string;
  estimasi: number;
}

export interface TargetDanaItem {
  id?: string;
  nama: string;
  target: number;
  terkumpul: number;
}

export interface AgendaItem {
  id?: string;
  title: string;
  start: string;
  backgroundColor: string;
}

export interface ToastMessage {
  id: string;
  pesan: string;
  tipe: 'success' | 'error' | 'info';
}
