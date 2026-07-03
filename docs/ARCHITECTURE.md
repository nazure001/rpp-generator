# 🏛️ AssessmentHub AI — Target Architecture Specification

Dokumen ini menjelaskan arsitektur target untuk transformasi **Smart RPP Generator Pro** menjadi platform ekosistem asesmen komprehensif **AssessmentHub AI**. Arsitektur ini dirancang secara modular, terdesentralisasi, dan mendukung alur kerja guru dari perencanaan pembelajaran hingga pengarsipan bukti akreditasi.

---

## 🧩 Diagram Arsitektur Sistem

```
+----------------------------------------------------------------------------------------------------+
|                                    ASSESSMENTHUB AI ECOSYSTEM                                      |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  +-----------------------+      +-----------------------+      +--------------------------------+  |
|  |  1. PLANNING ENGINE   | ---> |  2. CURRICULUM ENGINE | ---> |    3. ASSESSMENT GENERATOR     |  |
|  |  (RPP Generator)      |      |  (BSKAP 2026 & PMM)   |      |  (Kisi-Kisi, PG, Esai, Rubrik) |  |
|  +-----------------------+      +-----------------------+      +--------------------------------+  |
|              |                                                                 |                   |
|              v                                                                 v                   |
|  +-----------------------+                                     +--------------------------------+  |
|  |   7. DRIVE ORGANIZER  |                                     |       4. QUESTION PARSER       |  |
|  |   (Google Drive GAS)  |                                     |   (Unstructured Text -> JSON)  |  |
|  +-----------------------+                                     +--------------------------------+  |
|              |                                                                 |                   |
|              v                                                                 v                   |
|  +-----------------------+      +-----------------------+      +--------------------------------+  |
|  |  8. EVIDENCE MAPPER   | <--- | 6. GOOGLE FORM BUILDER| <--- |     5. QUESTION VALIDATOR      |  |
|  |  (Akreditasi & PMM)   |      | (GAS / Form API Auto) |      | (Taksonomi Bloom & Ambiguity)  |  |
|  +-----------------------+      +-----------------------+      +--------------------------------+  |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

---

## 🔧 Komponen Inti Arsitektur

### 1. Planning Engine (Dari RPP Generator Eksisting)
* **Fungsi**: Memfasilitasi guru dalam menyusun Rencana Pelaksanaan Pembelajaran (RPP) berbasis pendekatan *Deep Learning* (Mindful, Meaningful, Joyful).
* **Peran dalam Ekosistem**: Bertindak sebagai titik awal (*entry point*) yang menghasilkan konteks pembelajaran (Identitas Sekolah, Mata Pelajaran, Topik, Skenario Pembelajaran, dan Model Pedagogis).
* **Integrasi**: Menghasilkan muatan data ekspor JSON (`PlanningPayload`) yang dikonsumsi oleh Curriculum Engine dan Assessment Generator.

### 2. Curriculum Engine
* **Fungsi**: Pusat database kurikulum resmi yang memetakan **Capaian Pembelajaran (CP) BSKAP No. 046/H/KR/2026** (PAUD hingga Fase F) dan **8 Indikator Observasi PMM**.
* **Peran dalam Ekosistem**: Menyediakan layanan pencarian, dekomposisi CP menjadi Tujuan Pembelajaran (TP), dan pemetaan Alur Tujuan Pembelajaran (ATP).
* **Desain Modular**: Data dipisahkan dari logika presentasi agar mudah diperbarui setiap terjadi perubahan kebijakan kurikulum nasional tanpa mengubah antarmuka pengguna.

### 3. Assessment Generator
* **Fungsi**: Mesin perumus instrumen asesmen kognitif dan non-kognitif secara kontekstual berdasarkan input dari Planning dan Curriculum Engine.
* **Output yang Dihasilkan**:
  * **Kisi-Kisi Soal (Exam Blueprint)**: Matriks spesifikasi butir soal, TP, indikator soal, level Taksonomi Bloom (C1–C6), dan persentase bobot.
  * **Bank Soal Kognitif**: Soal Pilihan Ganda (dengan opsi A–D, kunci jawaban, dan pembahasan konseptual) serta Soal Uraian HOTS (dengan rambu jawaban dan pedoman penskoran).
  * **Rubrik Observasi**: Lembar penilaian formatif 4 skala (*Baru Memulai*, *Berkembang*, *Cakap*, *Mahir*) yang tersinkronisasi dengan fokus perilaku PMM.

### 4. Question Parser
* **Fungsi**: Modul pengolah teks cerdas yang mampu mengonversi draf soal mentah (dari teks clipboard, dokumen Word/PDF, atau catatan guru) menjadi struktur data JSON berstandar (`QuestionBankSchema`).
* **Fitur Utama**:
  * Pemisahan otomatis antara batang soal (*stem*), opsi jawaban, kunci, dan bobot.
  * Deteksi level kognitif berdasarkan Kata Kerja Operasional (KKO) yang ditemukan dalam teks soal.

### 5. Question Validator
* **Fungsi**: Mesin penjamin mutu (*quality assurance*) pedagogis dan psikometrik sebelum soal didistribusikan kepada siswa.
* **Kriteria Validasi**:
  * **Kesesuaian Bloom**: Memeriksa apakah bobot soal HOTS (C4–C6) memenuhi standar minimum kurikulum sekolah.
  * **Relevansi TP**: Memastikan setiap butir soal mengukur Indikator Soal dan TP yang telah ditetapkan di kisi-kisi.
  * **Distribusi Kunci & Opsi**: Mencegah pola kunci jawaban yang mudah ditebak (misal terlalu dominan opsi A atau B) dan mendeteksi opsi pengecoh (*distractor*) yang tidak homogen.
  * **Pemeriksaan Ambigu**: Mendeteksi kalimat ganda, kalimat negatif ganda, atau instruksi yang membingungkan siswa.

### 6. Google Form Builder via GAS / Form API
* **Fungsi**: Jembatan otomatisasi yang mengubah paket soal JSON yang telah divalidasi menjadi Google Form interaktif siap pakai hanya dengan satu klik.
* **Mekanisme Kerja**:
  * Menggunakan skrip pihak klien atau Google Apps Script (GAS) web app endpoint.
  * Secara otomatis mengatur kunci jawaban, poin nilai per soal, umpan balik konseptual saat siswa menjawab salah, dan opsi acak urutan soal/opsi.

### 7. Drive Organizer
* **Fungsi**: Sistem manajemen portofolio digital berbasis Google Apps Script yang merapikan penyimpanan berkas administrasi guru di Google Drive.
* **Struktur Folder Otomatis**:
  * `[Tahun Ajaran] -> [Mata Pelajaran] -> [Kelas/Semester] -> [Topik Materi]`
  * Sub-folder otomatis untuk: `01_RPP_ModulAjar`, `02_KisiKisi_Soal`, `03_Hasil_Nilai_Siswa`, dan `04_Bukti_Kinerja_PMM`.

### 8. Evidence / Accreditation Mapper
* **Fungsi**: Modul kompilasi akhir yang memetakan seluruh dokumen perencanaan, instrumen asesmen, dan rekap analisis nilai siswa ke dalam butir-butir standar akreditasi sekolah dan bukti dukung Pengelolaan Kinerja PMM.
* **Manfaat**: Guru tidak perlu menyusun berkas portofolio dari awal saat masa audit akreditasi atau observasi kepala sekolah; sistem menghasilkan laporan rekapitulasi komprehensif berformat PDF/Excel.

---

## 🚀 README & Installer Flow (Alur Pemasangan)

AssessmentHub AI didesain menggunakan prinsip **Zero-Build Architecture** (tanpa ketergantungan *build pipeline* Node.js rumit), sehingga proses instalasi sangat sederhana:

### 1. Pemasangan Lokal / Web Hosting (Offline-Capable SPA)
* Unduh atau *clone* repositori `nazure001/rpp-generator`.
* Buka file `index.html` langsung di browser web standar (Google Chrome, Microsoft Edge, atau Mozilla Firefox).
* Aplikasi siap digunakan secara langsung menggunakan penyimpanan lokal browser (`localStorage`).

### 2. Pemasangan Integrasi Cloud (Google Apps Script)
* Buka spreadsheet atau Google Drive sekolah.
* Salin skrip penghubung dari folder `gas/` (pada rilis V4/V5 mendatang) ke dalam Google Apps Script Editor.
* Lakukan otorisasi satu kali (*One-Time Authorization*) untuk memberi izin pembentukan folder Drive dan Google Form.
* Masukkan URL Web App GAS ke dalam menu **Konfigurasi Cloud** di AssessmentHub AI.
