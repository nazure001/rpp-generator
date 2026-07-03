# 🗺️ AssessmentHub AI — Phased Development Roadmap

Dokumen ini memuat peta jalan (*roadmap*) pengembangan bertahap untuk mentransformasikan repositori `nazure001/rpp-generator` dari generator RPP sederhana menjadi ekosistem asesmen cerdas terintegrasi **AssessmentHub AI**.

Setiap tahap dirancang dengan prinsip **Zero-Breakage Guarantee**, di mana fitur eksisting tidak akan rusak atau terganggu oleh pengembangan fitur baru.

---

## 🏁 Fase MVP (Minimum Viable Product): Foundation & Modularization

### MVP 0: Safety & Repository Audit
* **Tujuan**: Mengamankan repositori, memastikan strategi pencadangan aktif, dan mengaudit ketergantungan kode.
* **Status**: **COMPLETED (Selesai)**
* **Deliverables**:
  * Pembuatan branch baru `feature/assessmenthub-foundation` (isolasi dari `main`).
  * Inspeksi struktur file eksisting (`index.html`, `README.md`, `asesmen.html`).
  * Identifikasi arsitektur sebagai Single-File Browser-Based React SPA.
  * Penetapan aturan keselamatan agen (tanpa perintah destruktif, tanpa hardcode rahasia).

### MVP 1: Documentation Foundation
* **Tujuan**: Menyusun fondasi dokumentasi arsitektur, peta jalan, alur data, dan aturan pengembangan sistem.
* **Status**: **IN PROGRESS (Sedang Berjalan)**
* **Deliverables**:
  * `docs/ARCHITECTURE.md`: Spesifikasi arsitektur 8 komponen inti ekosistem.
  * `docs/ROADMAP.md`: Peta jalan pengembangan bertahap ini.
  * `docs/DATA_FLOW.md`: Spesifikasi alur data dan transformasi entitas.
  * `docs/AGENT_RULES.md`: Aturan penulisan kode aman dan pedoman kontribusi.
  * `SCHEMA_ASSESSMENTHUB.md`: Draf antarmuka skema TypeScript untuk 5 entitas utama.

### MVP 2: Modularize Existing Engine (Zero-Build Refactoring)
* **Tujuan**: Memisahkan logika monolitik pada file HTML menjadi berkas skrip modular tanpa memerlukan NodeJS/Webpack.
* **Target Rilis**: *Fase Berikutnya*
* **Deliverables**:
  * Ekstraksi database kurikulum ke `data/curriculum_bskap.js` (BSKAP 2026 & PMM).
  * Ekstraksi utilitas dan smart engine RPP ke `js/rpp_engine.js`.
  * Pembaruan tag `<script>` pada `index.html` dengan jaminan fungsi lama berjalan 100% normal.

### MVP 3: JSON Schemas & State Standardization
* **Tujuan**: Mengimplementasikan antarmuka skema data di sisi klien untuk memastikan interoperabilitas antar modul.
* **Deliverables**:
  * Implementasi konstruktor skema JS di `js/schema_models.js` (`CurriculumProfile`, `AssessmentBlueprint`, `QuestionBankSchema`, `ObservationRubricSchema`, `StudentAnalyticsSchema`).
  * Standarisasi format penyimpanan sesi di `localStorage` dan mekanisme validasi skema JSON.

### MVP 4: Export RPP Planning Data
* **Tujuan**: Membangun jembatan data dari aplikasi RPP Generator (`index.html`) menuju modul asesmen.
* **Deliverables**:
  * Tombol dan fungsi **"Ekspor ke AssessmentHub"** pada Tahap 4 & 5 RPP Generator.
  * Pembentukan muatan data sesi (`PlanningPayload`) yang dikirimkan melalui `localStorage` atau URL parameter yang aman.

### MVP 5: Assessment Blueprint Generator
* **Tujuan**: Menghidupkan generator kisi-kisi soal dan instrumen asesmen interaktif berbasis peramban.
* **Deliverables**:
  * Integrasi penuh antarmuka `asesmen.html` dengan skema `AssessmentBlueprint` dan `QuestionBankSchema`.
  * Fitur penyuntingan kisi-kisi secara *real-time* dan penghitungan otomatis bobot Taksonomi Bloom (C1–C6).
  * Cetak matriks kisi-kisi dan soal berformat standar sekolah (A4 Print-Ready).

### MVP 6: README & GAS Integration Plan
* **Tujuan**: Menyempurnakan panduan pengguna dan mempersiapkan rancangan integrasi Google Apps Script (GAS).
* **Deliverables**:
  * Pembaruan `README.md` utama dengan dokumentasi arsitektur modular baru.
  * Pembuatan cetak biru (*blueprint*) dan dokumentasi API endpoint untuk penghubung Google Apps Script (`docs/GAS_INTEGRATION_PLAN.md`).

---

## 🚀 Fase Advanced (V2 – V6): AI Intelligence & Cloud Automation

### V2: Question Parser
* **Tujuan**: Mengembangkan modul pembaca teks cerdas untuk mengonversi draf soal mentah menjadi JSON terstruktur.
* **Fitur**:
  * *Paste & Parse*: Guru dapat menyalin teks soal dari Word/PDF dan sistem otomatis memisahkan soal, opsi A–D, kunci, dan pembahasan.
  * Klasifikasi otomatis level Bloom berdasarkan analisis Kata Kerja Operasional (KKO).

### V3: Question Validator
* **Tujuan**: Menyediakan sistem penjamin mutu soal sebelum didistribusikan kepada peserta didik.
* **Fitur**:
  * Pemeriksaan proporsi soal HOTS (C4–C6) terhadap LOTS/MOTS.
  * Audit pemetaan soal terhadap Tujuan Pembelajaran (TP) pada kisi-kisi.
  * Deteksi kalimat ambigu, pengecoh tidak homogen, dan bias pola kunci jawaban.

### V4: Google Form Builder via GAS
* **Tujuan**: Otomatisasi pembuatan instrumen ujian online di Google Forms langsung dari browser.
* **Fitur**:
  * Konversi 1-Klik dari `QuestionBankSchema` menjadi Google Form kuis bernilai.
  * Penyisipan kunci jawaban, bobot nilai, dan pembahasan otomatis pada Form yang dihasilkan.

### V5: Drive Organizer
* **Tujuan**: Pengelolaan portofolio administrasi guru di Google Drive secara otomatis dan rapi.
* **Fitur**:
  * Pembuatan pohon direktori otomatis berdasarkan Tahun Ajaran, Kelas, Mapel, dan Topik.
  * Penyimpanan arsip RPP (PDF), Kisi-Kisi (JSON/PDF), dan Spreadsheet nilai pada folder yang bersesuaian.

### V6: Evidence / Accreditation Mapper
* **Tujuan**: Pemetaan otomatis dokumen asesmen untuk pemenuhan bukti dukung PMM dan akreditasi sekolah.
* **Fitur**:
  * Dasbor rekapitulasi bukti kinerja guru (sinkron dengan 8 Indikator Observasi PMM).
  * Ekspor berkas portofolio komprehensif yang telah dipetakan ke instrumen akreditasi sekolah (BAN-PDM).

---

## 📊 Matriks Pelacakan Status Pengembangan

| Fase | Nama Fitur / Modul | Target Rilis | Status Saat Ini |
| :--- | :--- | :--- | :--- |
| **MVP 0** | Safety & Repository Audit | Q3 2026 | **COMPLETED** |
| **MVP 1** | Documentation Foundation | Q3 2026 | **IN PROGRESS** |
| **MVP 2** | Zero-Build Modularization | Q3 2026 | *Planned* |
| **MVP 3** | JSON Schemas Implementation | Q3 2026 | *Planned* |
| **MVP 4** | RPP Planning Data Export | Q3 2026 | *Planned* |
| **MVP 5** | Blueprint & Question Generator | Q3 2026 | *Planned* |
| **MVP 6** | README & GAS Blueprint | Q3 2026 | *Planned* |
| **V2** | Question Parser Module | Q4 2026 | *Future Roadmap* |
| **V3** | Question Validator Engine | Q4 2026 | *Future Roadmap* |
| **V4** | 1-Click Google Form Builder | Q1 2027 | *Future Roadmap* |
| **V5** | Automated Drive Organizer | Q1 2027 | *Future Roadmap* |
| **V6** | Accreditation Evidence Mapper | Q2 2027 | *Future Roadmap* |
