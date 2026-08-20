export type UserRole = 'KETUA_RW' | 'KETUA_RT' | 'BENDAHARA' | 'PETUGAS' | 'WARGA';

export interface RWUnit {
  id: string;
  name: string;
  number: string;
  village: string; // Kelurahan
  subDistrict: string; // Kecamatan
  city: string;
  province: string;
  postalCode: string;
  address: string;
  headName: string;
  headPhone: string;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    qrisImageUrl?: string;
  };
}

export interface RTUnit {
  id: string;
  rwId: string;
  rtNumber: string; // e.g., "001", "002"
  headName: string;
  headPhone: string;
  totalFamilies: number;
  totalResidents: number;
}

export type ResidentStatus = 'TETAP' | 'KONTRAK' | 'KOS' | 'PINDAH';
export type FamilyRole = 'KEPALA_KELUARGA' | 'ISTRI' | 'ANAK' | 'ORANG_TUA' | 'FAMILI_LAIN';
export type Gender = 'L' | 'P';

export interface Resident {
  id: string;
  familyId: string;
  rtId: string;
  nik: string; // Nomor Induk Kependudukan (16 digit)
  fullName: string;
  gender: Gender;
  birthPlace: string;
  birthDate: string;
  religion: string;
  occupation: string;
  maritalStatus: 'BELUM_KAWIN' | 'KAWIN' | 'CERAI_HIDUP' | 'CERAI_MATI';
  familyRole: FamilyRole;
  phone?: string;
  status: ResidentStatus;
  bloodType?: string;
  createdAt: string;
}

export interface Family {
  id: string;
  rtId: string;
  familyCardNumber: string; // No KK (16 digit)
  headOfFamilyName: string;
  address: string;
  houseNumber: string; // Blok / No Rumah
  phone: string;
  residentCount: number;
  status: ResidentStatus;
  createdAt: string;
}

export type LetterStatus = 'MENUNGGU_RT' | 'MENUNGGU_RW' | 'DISETUJUI' | 'DITOLAK';
export type LetterType = 
  | 'DOMISILI'
  | 'PENGANTAR_SKCK'
  | 'KETERANGAN_USAHA'
  | 'KETERANGAN_TIDAK_MAMPU'
  | 'KETERANGAN_KEMATIAN'
  | 'KETERANGAN_BELUM_MENIKAH'
  | 'PENGANTAR_NIKAH'
  | 'IZIN_KERAMAIAN'
  | 'SURAT_PENGANTAR_SKCK'
  | 'SURAT_KETERANGAN_USAHA'
  | 'SURAT_KETERANGAN_DOMISILI';

export interface LetterRequest {
  id: string;
  trackingCode: string; // e.g. "SRT-202608-001"
  letterType: LetterType;
  letterTitle: string;
  residentName: string;
  nik: string;
  familyCardNumber: string;
  rtNumber: string;
  address: string;
  phone: string;
  purpose: string; // Keperluan surat
  additionalInfo?: Record<string, string>;
  status: LetterStatus;
  submittedAt: string;
  
  // Persetujuan RT
  rtApprovedAt?: string;
  rtApprovedBy?: string;
  rtNotes?: string;
  
  // Persetujuan RW
  rwApprovedAt?: string;
  rwApprovedBy?: string;
  letterOfficialNumber?: string; // e.g. "470/012/RW.14/VIII/2026"
  verificationToken: string; // Hash token untuk QR code
  
  rejectionReason?: string;
  pdfGeneratedUrl?: string;
}

export type InvoiceStatus = 'BELUM_BAYAR' | 'MENUNGGU_VERIFIKASI' | 'LUNAS' | 'KADALUWARSA';
export type PaymentMethod = 'QRIS' | 'TRANSFER_BANK' | 'TUNAI';

export interface InvoiceItem {
  name: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-202608-RT01-001"
  familyId: string;
  familyCardNumber: string;
  headOfFamilyName: string;
  rtNumber: string;
  houseNumber: string;
  billingPeriod: string; // e.g. "Agustus 2026"
  month?: number;
  year?: number;
  items?: InvoiceItem[];
  breakdown?: {
    securityFee: number; // Iuran Keamanan
    cleanlinessFee: number; // Iuran Sampah / Kebersihan
    communityFee: number; // Iuran Kas RW / Sosial
  };
  totalAmount: number;
  status: InvoiceStatus;
  dueDate?: string;
  
  // Payment detail
  paymentMethod?: PaymentMethod;
  paymentProofUrl?: string;
  paidAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type TransactionType = 'MASUK' | 'KELUAR';
export type CashCategory = 
  | 'IURAN_WARGA' 
  | 'KAS_PEMBANGUNAN' 
  | 'DANA_SOSIAL' 
  | 'KEBERSIHAN_SAMPAH' 
  | 'KEAMANAN_RONDA' 
  | 'OPERASIONAL_RW' 
  | 'KEGIATAN_WARGA' 
  | 'LAINNYA';

export interface CashTransaction {
  id: string;
  transactionNumber: string;
  date: string;
  type: TransactionType;
  category: CashCategory;
  title: string;
  description: string;
  amount: number;
  balanceAfter: number;
  recordedBy: string;
  receiptUrl?: string;
}

export type ComplaintCategory = 'KEBERSIHAN' | 'KEAMANAN' | 'INFRASTRUKTUR' | 'KETERTIBAN' | 'LAINNYA';
export type ComplaintStatus = 'TERKIRIM' | 'DIPROSES' | 'SELESAI' | 'DITOLAK';

export interface Complaint {
  id: string;
  ticketNumber: string;
  reporterName: string;
  phone: string;
  rtNumber: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string;
  photoUrl?: string;
  isAnonymous: boolean;
  status: ComplaintStatus;
  submittedAt: string;
  updatedAt?: string;
  assignedTo?: string; // Seksi Keamanan / Seksi Kebersihan
  resolvedAt?: string;
  resolutionNotes?: string;
  resolutionPhotoUrl?: string;
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  capacity?: string;
  description: string;
  location: string;
  rentalFee: number; // 0 jika gratis untuk warga
  imageUrl: string;
  rules?: string[];
  facilitiesIncluded?: string[];
  isAvailable?: boolean;
}

export interface FacilityBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  applicantName: string;
  phone: string;
  rtNumber: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: 'PENDING' | 'DISETUJUI' | 'DITOLAK';
  notes?: string;
  createdAt: string;
}

export interface UMKMItem {
  id: string;
  ownerName: string;
  rtNumber: string;
  businessName: string;
  category: 'KULINER' | 'FASHION' | 'JASA' | 'SEMBAKO' | 'KERAJINAN' | string;
  description: string;
  priceRange: string;
  whatsappNumber: string;
  address: string;
  imageUrl: string;
  rating?: number;
  isOpen?: boolean;
  isVerified?: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'BERITA' | 'PENGUMUMAN' | 'KEGIATAN' | 'KESEHATAN';
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  coverImageUrl: string;
  tags: string[];
  isImportant?: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  icon: string;
  available: string;
}
