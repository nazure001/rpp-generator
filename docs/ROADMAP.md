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
* **Status**: **COMPLETED (Selesai)**
* **Deliverables**:
  * `docs/ARCHITECTURE.md`: Spesifikasi arsitektur target ekosistem.
  * `docs/ROADMAP.md`: Peta jalan pengembangan bertahap ini.
  * `docs/DATA_FLOW.md`: Spesifikasi alur data dan transformasi entitas.
  * `docs/AGENT_RULES.md`: Aturan penulisan kode aman dan pedoman kontribusi.

### MVP 2: Zero-Build Modularization (Refactoring Preparation)
* **Tujuan**: Memisahkan logika data dan mesin dari file HTML menjadi berkas skrip modular terisolasi.
* **Status**: **COMPLETED (Selesai - Ekstraksi Referensi)**
* **Deliverables**:
  * Ekstraksi database kurikulum ke `src/engines/curriculumEngine.js`.
  * Ekstraksi indikator PMM ke `src/engines/pmmEngine.js`.
  * Ekstraksi model pembelajaran ke `src/engines/learningModelEngine.js`.
  * Ekstraksi logika kalkulasi ke `src/engines/planningEngine.js`.
  * Pembuatan `src/legacy/README.md` sebagai penjelasan transisi tanpa merubah perilaku produksi `index.html`.

### MVP 3: JSON Schemas Standardization
* **Tujuan**: Mengimplementasikan antarmuka skema data standar untuk interoperabilitas antar modul.
* **Status**: **COMPLETED (Selesai)**
* **Deliverables**:
  * `src/schemas/lessonPlan.schema.json`: Standar data RPP.
  * `src/schemas/assessment.schema.json`: Standar data paket asesmen.
  * `src/schemas/question.schema.json`: Standar data butir soal.
  * `src/schemas/export.schema.json`: Standar data output ke sistem eksternal.

### MVP 4: Export RPP Planning Data
* **Tujuan**: Membangun jembatan data dari aplikasi RPP Generator (`index.html`) menuju format JSON standar.
* **Status**: **COMPLETED (Selesai)**
* **Deliverables**:
  * Fitur **"Export JSON RPP"** non-destruktif pada antarmuka Langkah 5 dan pratinjau cetak di `index.html`.
  * Fitur **"Export Draft Asesmen"** untuk mengunduh draf awal paket asesmen.

### MVP 5: Assessment Blueprint Generator
* **Tujuan**: Menghidupkan generator kisi-kisi soal dan instrumen asesmen interaktif berbasis peramban.
* **Status**: **ROADMAP (Dalam Perencanaan) — Prototipe Eksperimental**
* **Deliverables**:
  * Berkas `asesmen.html` saat ini berstatus **Experimental Prototype** (belum dihubungkan ke alur ekspor JSON RPP maupun Google Form Builder).
  * Fitur penyusunan kisi-kisi dan penghitungan bobot ranah kognitif akan diintegrasikan pada tahap berikutnya.

---

## 🚀 Fase Advanced (V2 – V6): AI Intelligence & Cloud Automation

### V2: Question Parser Module
* **Tujuan**: Mengembangkan modul pembaca teks cerdas untuk mengonversi draf soal mentah menjadi JSON terstruktur.
* **Status**: **COMPLETED (Selesai — Standalone Prototype)**
* **Deliverables**:
  * Modul mandiri `src/engines/questionParserEngine.js` dengan fungsi `parseQuestionsFromText` *(belum dihubungkan ke UI)*.
  * Berkas sampel uji `src/engines/questionParserEngine.test-samples.md`.

### V3: Question Validator Engine
* **Tujuan**: Menyediakan sistem penjamin mutu soal sebelum didistribusikan kepada peserta didik.
* **Status**: **COMPLETED (Selesai — Standalone Prototype)**
* **Deliverables**:
  * Modul mandiri `src/engines/questionValidatorEngine.js` dengan fungsi `validateQuestion` dan `validateQuestionSet` *(belum dihubungkan ke UI)*.

### V4: Google Form Builder via GAS
* **Tujuan**: Otomatisasi pembuatan instrumen ujian online di Google Forms langsung dari browser via Google Apps Script (GAS).
* **Status**: **ROADMAP (Dalam Perencanaan)**
* **Deliverables**:
  * Konversi paket soal JSON menjadi Google Form kuis bernilai beserta kunci jawaban dan pembahasan otomatis.

### V5: Drive Organizer via GAS
* **Tujuan**: Pengelolaan portofolio administrasi guru di Google Drive secara otomatis dan rapi.
* **Status**: **ROADMAP (Dalam Perencanaan)**
* **Deliverables**:
  * Pembuatan pohon direktori otomatis dan pengarsipan berkas RPP, kisi-kisi, dan paket soal di Google Drive.

### V6: Evidence / Accreditation Mapper
* **Tujuan**: Pemetaan otomatis dokumen asesmen untuk pemenuhan bukti dukung PMM dan akreditasi sekolah.
* **Status**: **ROADMAP (Dalam Perencanaan)**
* **Deliverables**:
  * Pemetaan otomatis hasil asesmen dan dokumen pembelajaran ke dalam borang bukti akreditasi dan laporan PMM.

---

## 📊 Matriks Pelacakan Status Pengembangan

| Fase | Nama Fitur / Modul | Target Rilis | Status Saat Ini |
| :--- | :--- | :--- | :--- |
| **MVP 0** | Safety & Repository Audit | Q3 2026 | **COMPLETED** |
| **MVP 1** | Documentation Foundation | Q3 2026 | **COMPLETED** |
| **MVP 2** | Zero-Build Modularization | Q3 2026 | **COMPLETED (Reference Modules)** |
| **MVP 3** | JSON Schemas Implementation | Q3 2026 | **COMPLETED** |
| **MVP 4** | RPP Planning Data Export | Q3 2026 | **COMPLETED** |
| **MVP 5** | Blueprint & Question Generator | Q4 2026 | **ROADMAP (Experimental Prototype)** |
| **V2** | Question Parser Module | Q4 2026 | **COMPLETED (Standalone Prototype)** |
| **V3** | Question Validator Engine | Q4 2026 | **COMPLETED (Standalone Prototype)** |
| **V4** | Google Form Builder via GAS | Q1 2027 | **ROADMAP** |
| **V5** | Automated Drive Organizer | Q1 2027 | **ROADMAP** |
| **V6** | Accreditation Evidence Mapper | Q2 2027 | **ROADMAP** |
