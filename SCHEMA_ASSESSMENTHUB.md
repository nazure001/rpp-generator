# 🏛️ AssessmentHub AI Foundation — Data Schema & Architecture Specification

**Branch**: `feature/assessmenthub-foundation`  
**Status**: Draf Spesifikasi Matang (Foundation Stage)  
**Tujuan**: Merancang fondasi skema data, batas modul (*modular boundary*), dan spesifikasi AI untuk **AssessmentHub** sebelum menulis logika eksekusi baru atau mengimplementasikan autentikasi (Google OAuth), guna menjamin stabilitas aplikasi **Smart RPP Generator Pro** eksisting.

---

## 1. Visi Arsitektur & Prinsip Dasar

Sesuai dengan aturan pengembangan repositori `nazure001/rpp-generator`:
1. **Zero-Breakage Guarantee**: Fitur eksisting di `index.html` (RPP Generator) tidak boleh terganggu. AssessmentHub dibangun sebagai lapisan modular pendamping yang kompatibel 100%.
2. **Offline-First & Zero-Build**: Tetap mempertahankan kemudahan deploy tanpa proses build (*no Node.js/Webpack build step*). Penyimpanan data sementara menggunakan `localStorage` browser dengan kapabilitas ekspor/impor berkas JSON standar sekolah.
3. **Security First**: Tidak ada penyisipan kredensial (API Key AI atau Secret OAuth) secara *hardcode* di dalam kode pihak klien (*client-side*).
4. **Schema Maturity Before Auth**: Google OAuth dan sinkronisasi cloud baru akan diintegrasikan setelah skema entitas di bawah ini teruji stabil pada lingkungan lokal.

---

## 2. Definisi Skema Data Inti (Entity Schemas)

Untuk menjaga konsistensi data antara modul RPP, Kisi-Kisi, Bank Soal, dan Penilaian Siswa, berikut adalah definisi skema standar dalam format TypeScript/JSDoc Interfaces:

### A. Skema Konfigurasi & Kurikulum (`CurriculumProfile`)
Menyimpan konteks pembelajaran yang sinkron dengan standar **BSKAP No. 046/H/KR/2026** dan **8 Indikator Observasi PMM**.

```typescript
interface CurriculumProfile {
  id: string;                     // UUID unik sesi, misal: "curr-2026-07-04-001"
  sekolah: string;                // Nama sekolah
  guru: string;                   // Nama guru pengampu
  nipGuru: string;                // NIP Guru
  kepalaSekolah: string;          // Nama Kepala Sekolah
  nipKepalaSekolah: string;       // NIP Kepala Sekolah
  fase: string;                   // Contoh: "Fase D (SMP/MTs Grade 7-9)"
  mapel: string;                  // Contoh: "Ilmu Pengetahuan Alam (IPA)"
  kelasSemester: string;          // Contoh: "VII / Ganjil"
  topik: string;                  // Contoh: "Hukum Newton dan Dinamika Gerak"
  cpResmi: string;                // Teks Capaian Pembelajaran dari database BSKAP
  fokusPMM: string;               // Contoh: "Disiplin Positif" | "Aktivitas Interaktif"
  dominantBloom: string;          // Contoh: "C4 - Menganalisis / HOTS (Analyzing)"
  createdAt: string;              // ISO 8601 Timestamp
}
```

### B. Skema Kisi-Kisi Soal (`AssessmentBlueprint`)
Merepresentasi matriks kisi-kisi atau *Exam Blueprint* yang menghubungkan Tujuan Pembelajaran (TP) dengan butir soal nyata.

```typescript
interface BlueprintItem {
  no: number;                     // Nomor urut soal
  tp: string;                     // Tujuan Pembelajaran spesifik
  indikatorSoal: string;          // Indikator pencapaian kompetensi / butir penilaian
  levelBloom: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';  // Taksonomi Bloom
  bentukSoal: 'Pilihan Ganda' | 'Uraian' | 'Proyek' | 'Observasi';
  bobotPoin: number;              // Bobot persentase atau nilai (misal: 20)
}

interface AssessmentBlueprint {
  profileId: string;              // Relasi ke CurriculumProfile.id
  items: BlueprintItem[];
  totalBobot: number;             // Harus bernilai 100%
}
```

### C. Skema Bank Soal (`QuestionBankSchema`)
Menampung butir instrumen evaluasi kognitif (Pilihan Ganda & Uraian HOTS) beserta pedoman penskoran resmi.

```typescript
interface MultipleChoiceItem {
  id: string;                     // UUID soal
  no: number;
  soal: string;                   // Teks pertanyaan / studi kasus
  opsi: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  kunci: 'A' | 'B' | 'C' | 'D';   // Kunci jawaban benar
  pembahasan: string;             // Penjelasan logis konseptual mengapa kunci benar
  bobot: number;                  // Poin soal
  levelBloom: string;
}

interface EssayItem {
  id: string;
  no: number;
  levelBloom: string;             // Contoh: "C5 (Mengevaluasi - HOTS)"
  soal: string;                   // Pertanyaan analitis / pemecahan masalah
  rambuJawaban: string;           // Rambu-rambu jawaban & kriteria penilaian
  skorMaksimal: number;           // Skor maksimal (misal: 30)
}

interface QuestionBankSchema {
  profileId: string;              // Relasi ke CurriculumProfile.id
  pilihanGanda: MultipleChoiceItem[];
  uraian: EssayItem[];
}
```

### D. Skema Rubrik Observasi Kinerja & Sikap (`ObservationRubricSchema`)
Instrumen penilaian formatif dan observasi sikap siswa yang terikat langsung dengan indikator Pengelolaan Kinerja PMM.

```typescript
interface RubricCriterion {
  aspek: string;                  // Aspek perilaku yang dinilai
  skala1_BaruMemulai: string;     // Deskriptor level 1 (Intervensi konstan)
  skala2_Berkembang: string;      // Deskriptor level 2 (Mulai konsisten)
  skala3_Cakap: string;           // Deskriptor level 3 (Mandiri & ajeg)
  skala4_Mahir: string;           // Deskriptor level 4 (Proaktif & teladan)
}

interface ObservationRubricSchema {
  profileId: string;
  indikatorPMM: string;           // Indikator PMM terpilih
  kriteria: RubricCriterion[];
  catatanPenilaian: string;       // Instruksi khusus pengisian rubrik
}
```

### E. Skema Tracking Nilai Siswa & Rekomendasi AI (`StudentAnalyticsSchema`)
*Fondasi masa depan untuk analisis hasil asesmen siswa, penentuan KKTP (Kriteria Ketercapaian Tujuan Pembelajaran), dan pemicu remidial otomatis.*

```typescript
interface StudentAssessmentRecord {
  studentId: string;              // NISN atau ID Siswa
  namaSiswa: string;
  skorDiagnostik: number;         // Skala 0 - 100
  skorPG: number;                 // Total skor pilihan ganda
  skorUraian: number;             // Total skor uraian
  skorRubrikSikap: number;        // Rata-rata skala 1 - 4
  skorAkhirSumatif: number;       // Nilai akhir gabungan
  statusKKTP: 'Tuntas' | 'Perlu Remidial' | 'Pengayaan';
  
  // AI Remediation & Enrichment Tagging
  failedBloomLevels: string[];    // Contoh: ["C4", "C5"] (Miskonsepsi pada analisis)
  aiRecommendation: string;       // Saran tindak lanjut otomatis dari Smart Engine
}

interface ClassAnalyticsReport {
  profileId: string;
  kelas: string;
  records: StudentAssessmentRecord[];
  classAverage: number;
  tuntasanPercentage: number;     // Persentase siswa tuntas KKTP
}
```

---

## 3. Strategi Modularisasi (Refactoring Strategy)

Untuk mencegah pembengkakan file monolitik (`index.html` yang saat ini mencapai ~87 KB) dan menjaga keterbacaan kode saat fitur AssessmentHub dimatangkan, kita akan menerapkan **Strategi Pemisahan Lapisan Tanpa Build (Zero-Build Modular Architecture)**:

```
[d:\repo\rpp-generator\]
 ├── index.html                 <-- Aplikasi RPP Generator (Tetap utuh/aman)
 ├── asesmen.html               <-- Aplikasi Smart Assessment Generator Pro
 ├── SCHEMA_ASSESSMENTHUB.md    <-- Spesifikasi Skema ini (Foundation)
 ├── data/                      <-- [REKOMENDASI EKSTRAKSI]
 │    ├── curriculum_bskap.js   <-- Database CP BSKAP 2026
 │    └── pmm_indicators.js     <-- 8 Indikator Observasi PMM
 └── js/                        <-- [REKOMENDASI EKSTRAKSI]
      ├── schema_models.js      <-- Implementasi Interface / Class Konstruktor Skema
      └── assessment_engine.js  <-- Logika Generator & Analisis AI Tanpa API Key
```

**Cara Kerja Modularisasi**:
* Pada file HTML (`index.html` / `asesmen.html`), kita cukup memuat skrip modular di bagian `<head>`:
  ```html
  <script src="data/curriculum_bskap.js"></script>
  <script src="data/pmm_indicators.js"></script>
  <script src="js/schema_models.js"></script>
  <script src="js/assessment_engine.js"></script>
  ```
* Hal ini memangkas ukuran file HTML hingga 50%, mempercepat proses *parsing* Babel di browser, dan memungkinkan kedua aplikasi berbagi database kurikulum yang sama secara efisien.

---

## 4. Peta Jalan Kesiapan Google OAuth & Cloud Sync (Post-Foundation)

Sesuai aturan *"Jangan langsung implement Google OAuth — Nanti belakangan, setelah schema matang"*, berikut adalah alur transisi keamanan dan sinkronisasi cloud untuk fase berikutnya:

1. **Fase 1: Local Storage & JSON Export (Saat Ini)**
   * Semua skema (`CurriculumProfile`, `QuestionBankSchema`, dll.) disimpan di `window.localStorage` dengan key `AH_SESSION_DATA`.
   * Guru dapat mengunduh seluruh skema sesi dalam bentuk file `.json` (*Backup Hidup*) dan memuatnya kembali di perangkat lain.
2. **Fase 2: Adapter Sinkronisasi (Cloud Ready Interface)**
   * Membangun lapisan *Service Adapter* yang memisahkan logika UI dari media penyimpanan (`StorageAdapter.save(data)`).
   * Secara default, adapter mengarah ke `LocalStorageAdapter`.
3. **Fase 3: Google OAuth & Cloud Database Integration (Masa Depan)**
   * Setelah skema di atas terbukti stabil dan tidak ada perubahan struktur atribut, kita akan menambahkan `FirebaseAdapter` atau `SupabaseAdapter`.
   * Google OAuth hanya bertugas memberikan otorisasi token pengguna (`user.uid`), yang kemudian digunakan sebagai *partition key* untuk menyimpan skema matang ini ke cloud database secara aman tanpa merusak struktur data lokal.

---

## 5. Ringkasan Kepatuhan Aturan Repositori

| Aturan Repositori | Status Kepatuhan dalam Spesifikasi Ini |
| :--- | :--- |
| **Selalu kerja di branch baru** | ✔️ Dilakukan di branch `feature/assessmenthub-foundation`. |
| **Jangan hapus file lama** | ✔️ File `index.html` dan `README.md` tidak disentuh atau dihapus. |
| **Jangan ubah fitur RPP sampai rusak** | ✔️ Modularisasi dirancang terisolasi; RPP Generator tetap berjalan normal 100%. |
| **Jangan tambah API key di kode** | ✔️ Engine AI diatur menggunakan logika algoritmik konseptual lokal tanpa *hardcode credential*. |
| **Jangan langsung implement Google OAuth** | ✔️ Autentikasi ditunda; fokus penuh pada pemantapan 5 skema data di atas. |
| **Jangan pakai command delete besar** | ✔️ Tidak ada perintah penghapusan berkas atau direktori yang dijalankan. |
