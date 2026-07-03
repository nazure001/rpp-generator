# 🔄 AssessmentHub AI — Data Flow & Lifecycle Specification

Dokumen ini memetakan alur data (*data flow*) dan siklus hidup (*lifecycle*) informasi pembelajaran dalam ekosistem **AssessmentHub AI**. Alur ini menghubungkan tahap perencanaan pedagogis dengan asesmen, evaluasi hasil belajar, hingga pengarsipan administrasi akreditasi.

---

## 🌊 Peta Alur Data Utama (End-to-End Data Pipeline)

```
 [1. RPP Planning] (index.html)
        │
        ▼ (PlanningPayload JSON)
 [2. CP / TP / ATP Mapping] (Curriculum Engine)
        │
        ▼ (CurriculumProfile JSON)
 [3. Assessment Blueprint] (Kisi-Kisi Soal)
        │
        ▼ (AssessmentBlueprint JSON)
 [4. Question Generation & Parsing] (Bank Soal PG & Esai)
        │
        ▼ (QuestionBankSchema JSON)
 [5. Answer Key & Rubric Synchronization] (Kunci & Rubrik PMM)
        │
        ▼ (Validated Package)
 [6. Google Form Builder] (via Google Apps Script / Form API)
        │
        ▼ (Live Online Quiz / Exam)
 [7. Student Results Ingestion] (Skor Siswa & Respon)
        │
        ▼ (StudentAssessmentRecord JSON)
 [8. AI Analytics & Diagnostic] (Analisis Ketercapaian / Miskonsepsi)
        │
        ├────────────────────────────────────────┐
        ▼ (Jika < KKTP)                          ▼ (Jika >= KKTP)
 [9a. Remedial Recommendation]           [9b. Enrichment Recommendation]
        │                                        │
        └───────────────────┬────────────────────┘
                            ▼
 [10. Administration & Evidence Folders] (Google Drive Organizer & Accreditation Mapper)
```

---

## 📋 Rincian Tahapan & Transformasi Data

### 1. RPP Planning (`index.html`)
* **Input**: Data identitas sekolah, nama guru, mata pelajaran, fase/kelas, topik materi, dan karakteristik siswa.
* **Proses**: Smart Engine merumuskan skenario pembelajaran berbasis *Deep Learning* (Mindful, Meaningful, Joyful) dan menyisipkan perilaku observasi PMM.
* **Output**: Objek JSON `PlanningPayload` yang berisi parameter kontekstual sesi pembelajaran.

### 2. CP / TP / ATP Mapping (Curriculum Engine)
* **Input**: `PlanningPayload.fase` dan `PlanningPayload.mapel`.
* **Proses**: Sistem melakukan *lookup* ke database resmi **BSKAP No. 046/H/KR/2026** untuk mengambil teks Capaian Pembelajaran (CP) terkait, lalu mendekompilasi CP menjadi serangkaian Tujuan Pembelajaran (TP) dan Alur Tujuan Pembelajaran (ATP).
* **Output**: Objek `CurriculumProfile` yang mengikat konteks RPP dengan standar kurikulum nasional.

### 3. Assessment Blueprint (Kisi-Kisi Soal)
* **Input**: `CurriculumProfile` dan preferensi level kognitif guru (misal: proporsi HOTS C4–C6).
* **Proses**: Generator merumuskan matriks kisi-kisi soal, menetapkan indikator soal, bentuk soal (Pilihan Ganda, Uraian, Observasi), serta bobot penilaian per butir soal.
* **Output**: Objek `AssessmentBlueprint` yang tersimpan di `localStorage` (`AH_BLUEPRINT_DATA`).

### 4. Question Generation & Parsing (Bank Soal)
* **Input**: Butir indikator dari `AssessmentBlueprint` atau teks draf soal mentah dari guru.
* **Proses**:
  * **AI Generation**: Merumuskan batang soal (*stem*), 4 opsi jawaban, dan studi kasus analitis yang sesuai dengan level Bloom.
  * **Question Parser**: Jika guru menyalin draf soal dari Word/PDF, modul parser memisahkan soal, opsi, dan kunci secara otomatis.
* **Output**: Objek `QuestionBankSchema`.

### 5. Answer Key & Rubric Synchronization
* **Input**: `QuestionBankSchema` dan `CurriculumProfile.fokusPMM`.
* **Proses**: Sistem menyusun tabel kunci jawaban resmi lengkap dengan pembahasan konseptual, sekaligus merumuskan deskriptor rubrik observasi sikap 4 skala (*Baru Memulai*, *Berkembang*, *Cakap*, *Mahir*) yang sinkron dengan indikator PMM.
* **Output**: Paket asesmen tervalidasi siap cetak (A4 PDF) atau siap ekspor cloud.

### 6. Google Form Builder (via GAS / Form API)
* **Input**: Paket asesmen tervalidasi (`QuestionBankSchema`).
* **Proses**: Skrip penghubung Google Apps Script (GAS) mengirimkan perintah pembentukan Google Form secara *headless*. Sistem mengatur mode kuis, poin soal, kunci jawaban otomatis, dan umpan balik pembahasan langsung di Google Forms.
* **Output**: Tautan URL Google Form live yang siap dibagikan kepada peserta didik.

### 7. Student Results Ingestion
* **Input**: Respon jawaban siswa dari Google Forms atau input nilai manual guru.
* **Proses**: Sistem mengumpulkan data mentah jawaban siswa dan memetakan skor per butir soal ke dalam struktur skema analitik standar.
* **Output**: Array objek `StudentAssessmentRecord`.

### 8. AI Analytics & Diagnostic
* **Input**: `StudentAssessmentRecord` dan standar Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).
* **Proses**: Mesin analitik menghitung nilai rata-rata kelas, persentase ketuntasan, dan melakukan **Diagnostic Miskonsepsi** dengan mendeteksi level Taksonomi Bloom mana yang paling banyak dijawab salah oleh siswa (misal: lemah pada soal C4-Analisis).
* **Output**: Laporan diagnosis kinerja kelas (`ClassAnalyticsReport`).

### 9. Remedial & Enrichment Recommendations
* **Input**: Tagging miskonsepsi dari hasil analitik AI.
* **Proses**:
  * **Remedial (`9a`)**: Untuk siswa di bawah KKTP, sistem menghasilkan rekomendasi aktivitas perbaikan konseptual spesifik (misal: latihan scaffolding atau pengulangan materi visual).
  * **Enrichment (`9b`)**: Untuk siswa yang telah tuntas, sistem menghasilkan penugasan pengayaan berbasis proyek kreasi (C6) atau investigasi mandiri.
* **Output**: Lembar kerja remidial dan pengayaan terpersonalisasi.

### 10. Administration & Evidence Folders (Drive Organizer & Accreditation Mapper)
* **Input**: Seluruh berkas yang dihasilkan dari tahap 1 hingga 9 (RPP PDF, Kisi-Kisi JSON/PDF, Google Form Quiz, dan Rekap Nilai Siswa).
* **Proses**:
  * **Drive Organizer**: Google Apps Script secara otomatis membuat struktur folder yang rapi di Google Drive guru (`[Tahun Ajaran] -> [Mapel] -> [Kelas] -> [Topik]`) dan mengarsipkan seluruh dokumen di sana.
  * **Accreditation Mapper**: Sistem memetakan arsip bukti tersebut ke dalam standar akreditasi sekolah (BAN-PDM) dan laporan bukti dukung Pengelolaan Kinerja PMM.
* **Output**: Portofolio administrasi guru yang lengkap, rapi, terpusat di cloud, dan siap diaudit sewaktu-waktu.

---

## 🔒 Aturan Integritas & Keamanan Alur Data

1. **Local-First Processing**: Selama tahap 1 hingga 5, seluruh transformasi data terjadi di memori peramban (*client-side*) atau `localStorage` tanpa mengirimkan data identitas siswa ke server pihak ketiga.
2. **Standardized JSON Exchange**: Setiap antar-modul berkomunikasi melalui muatan berkas JSON berstandar yang dapat diunduh oleh guru sebagai cadangan lokal (*offline backup*).
3. **Explicit Cloud Authorization**: Alur data menuju tahap 6 dan 10 (Google Form & Drive Organizer) membutuhkan otorisasi eksplisit Google OAuth dari guru pemilik akun.
