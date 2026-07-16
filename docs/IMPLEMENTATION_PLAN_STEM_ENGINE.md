# Implementation Plan: STEM Engine + LKPD & Penilaian Otomatis
### Studi Kasus: `nazure001/rpp-generator` (Smart RPP Generator Pro / AssessmentHub AI)

**Disusun untuk:** Purwa Umbara
**Repo dianalisis:** https://github.com/nazure001/rpp-generator
**Tanggal audit:** 13 Juli 2026

---

## 1. Ringkasan Audit Repositori

| Aspek | Temuan |
|---|---|
| **Jenis aplikasi** | SPA *zero-build* (React via Babel-standalone di browser), 1 file utama `index.html` (~96 KB) + `asesmen.html` (~276 KB) |
| **Arsitektur target** | Sedang bertransisi ke ekosistem 8-modul **AssessmentHub AI** (lihat `docs/ARCHITECTURE.md`) |
| **Modul aktif** | `1. Planning Engine` — satu-satunya modul berstatus 🟢 Produksi |
| **Modul prototipe (belum terhubung ke UI)** | `2. Question Parser`, `3. Question Validator` — sudah ada di `src/engines/`, tapi index.html masih pakai logic inline duplikat (`MODEL_PEMBELAJARAN` di-hardcode ulang di `index.html` baris 251, bukan di-*import* dari `src/engines/learningModelEngine.js`) |
| **Modul roadmap** | Assessment Generator, Google Form Builder, Drive Organizer, Evidence Mapper — belum ada kode |
| **Model pembelajaran tersedia saat ini** | 18 model: PBL, PjBL, Discovery, Inquiry, Jigsaw, STAD, TGT, TPS, NHT, CTL, RME, Flipped, Blended, GBL, Self-Directed, Direct Instruction, Mastery Learning, TGfU |
| **Gap kritis** | ❌ Tidak ada model **STEM terintegrasi (Science–Technology–Engineering–Mathematics)** sebagai satu kesatuan sintaks. Yang ada baru pendekatan tunggal (PjBL/Inquiry/RME) yang **bersinggungan** dengan STEM tapi tidak eksplisit menyusun 4 domain sekaligus. |
| **Gap kritis** | ❌ Tidak ada generator **LKPD (Lembar Kerja Peserta Didik)** sebagai dokumen turunan. Sistem baru menghasilkan RPP + draft asesmen JSON, belum ada dokumen kerja siswa. |
| **Gap kritis** | ❌ `generateInstrumenAsesmen()` di `planningEngine.js` menghasilkan rubrik generik per-model, belum ada rubrik penilaian berbasis **Engineering Design Process (EDP)** yang lazim dipakai STEM (identifikasi masalah → desain → uji coba → optimasi). |
| **Kekuatan yang bisa dimanfaatkan** | Pola *engine* sudah modular (`getModelData(metode)` → objek `{memahami, mengaplikasi, merefleksi, sumatif}`), sehingga menambah 1 entri baru **konsisten dengan arsitektur eksisting** tanpa breaking change — sesuai *Safety Notes* README (`No Breaking Changes`, `Non-Destructive`). |
| **Skema data** | `src/schemas/` sudah punya `lessonPlan.schema.json`, `assessment.schema.json`, `question.schema.json`, `export.schema.json` — perlu **schema baru** `lkpd.schema.json` + ekstensi `assessment.schema.json` untuk rubrik STEM/EDP. |

**Kesimpulan audit:** Penambahan engine STEM+LKPD+Penilaian **tidak memerlukan refactor besar**. Ini adalah pekerjaan *additive* mengikuti pola yang sudah ada di `src/engines/`, lalu menyambungkannya ke UI `index.html` — sekaligus jadi momentum baik untuk **menuntaskan** modularisasi yang selama ini masih setengah jalan (engine sudah dipisah tapi UI masih pakai kode duplikat).

---

## 2. Prinsip Desain (mengikuti aturan proyek di `docs/AGENT_RULES.md` & README)

1. **Non-destructive** — model pembelajaran STEM ditambahkan sebagai **entri baru** di `MODEL_PEMBELAJARAN`, bukan mengganti model lain.
2. **Zero-build tetap dipertahankan** — tidak menambah dependency Node/build step; tetap ES module + Babel-standalone.
3. **Data-driven, bukan hardcode UI** — logic STEM tetap berbentuk fungsi generator (seperti `SmartEngine`), dikonsumsi oleh UI, bukan ditulis ulang di JSX.
4. **No hallucination** — LKPD dan rubrik dibangun dari template terstruktur + input topik guru, bukan generate teks bebas tanpa struktur.
5. **Kompatibel skema ekspor** — LKPD & rubrik STEM harus tetap bisa diekspor ke `lesson-plan-*.json` / `assessment-draft-*.json` agar sinkron dengan `export.schema.json`.

---

## 3. Arsitektur Tambahan

```
+----------------------------------------------------------------+
|                    STEM ENGINE (BARU)                          |
|  src/engines/stemEngine.js                                     |
|                                                                  |
|  Input : topik, mapel, jenjang, alokasiWaktu                   |
|  Proses: sintaks 5 tahap EDP (Engineering Design Process)       |
|          -> map ke 4 domain S-T-E-M                             |
|  Output: { sintaks, integrasi4Domain, lkpd, rubrikPenilaian }   |
+----------------------------------------------------------------+
            |                              |
            v                              v
+-----------------------------+   +-------------------------------+
|  LKPD GENERATOR (BARU)      |   |  STEM ASSESSMENT (EXTENSION)  |
|  src/engines/lkpdEngine.js  |   |  extends generateInstrumen    |
|                             |   |  Asesmen() di planningEngine  |
|  Output dokumen kerja siswa |   |  Output: rubrik EDP 4 kriteria|
|  siap cetak (5 bagian baku) |   |  + asesmen tiap domain S-T-E-M|
+-----------------------------+   +-------------------------------+
            |                              |
            +--------------+---------------+
                           v
              index.html (UI: pilihan model
              "STEM-EDP" muncul di dropdown
              metode + tombol "Generate LKPD")
```

Engine ini **disisipkan sejajar** dengan `learningModelEngine.js`, dipanggil dari `planningEngine.js` melalui pola `getModelData()` yang sudah ada — sehingga sisa RPP (identitas, tujuan, PMM, dsb) **tidak perlu diubah sama sekali**.

---

## 4. Detail Rancangan Fungsional

### 4.1 Sintaks Pembelajaran STEM (masuk ke `MODEL_PEMBELAJARAN`)

Ditambahkan sebagai entri baru bernama **`"STEM (Engineering Design Process)"`**, mengikuti struktur `{memahami, mengaplikasi, merefleksi, sumatif}` yang sudah dipakai 18 model lain:

| Tahap RPP | Tahap EDP | Domain STEM yang ditekankan |
|---|---|---|
| `memahami` | **Ask** – Identifikasi masalah nyata & batasan (constraints) | Science (fenomena) + Mathematics (data awal) |
| `mengaplikasi` | **Imagine → Plan → Create** – Curah gagasan, desain sketsa/blueprint, membangun prototipe | Technology (alat/perangkat) + Engineering (proses rancang) |
| `merefleksi` | **Test → Improve** – Uji coba, ukur performa dengan data kuantitatif, iterasi perbaikan | Mathematics (pengukuran & analisis) + Engineering (optimasi) |
| `sumatif` | Penilaian produk + proses rancang (bukan hanya hasil akhir) | Integrasi 4 domain |

### 4.2 LKPD Generator — 5 Bagian Baku

Mengacu kaidah LKPD Kurikulum Merdeka + praktik STEM Indonesia:

| No | Bagian LKPD | Sumber data (reuse dari engine existing) |
|---|---|---|
| 1 | **Identitas & Petunjuk Belajar** | `topik`, `mapel`, `kelas`, alokasi waktu (dari form Planning Engine) |
| 2 | **Tujuan Pembelajaran (TP) & Orientasi Masalah** | `SmartEngine.getKesiapan()` + CP dari `curriculumEngine.js` |
| 3 | **Kegiatan Inti EDP** — dibagi 4 kolom kerja siswa: *Ask, Imagine/Plan, Create, Test/Improve* | Diturunkan otomatis dari `mod.memahami / mengaplikasi / merefleksi` STEM di atas, direformat jadi instruksi orang-kedua ("Tuliskan...", "Gambarkan sketsamu...") |
| 4 | **Lembar Kerja Data & Perhitungan** (tabel isian) | Domain Mathematics — tabel pengukuran, satuan, grafik sederhana |
| 5 | **Refleksi & Rekomendasi Perbaikan Desain** | Domain Engineering — pertanyaan reflektif terbuka |

Output LKPD dirender dalam 2 bentuk:
- **HTML print-ready** (konsisten dengan gaya cetak A4 yang sudah ada di `index.html`)
- **JSON terstruktur** (`lkpd.schema.json`) agar bisa diekspor terpisah, sejalan pola `export.schema.json`

### 4.3 Penilaian STEM (Rubrik EDP 4 Kriteria)

Menjadi opsi baru di `generateInstrumenAsesmen()` (extend, bukan replace), aktif ketika `metode === "STEM (Engineering Design Process)"`:

| Kriteria | Bobot | Skala (4 level, konsisten dgn `formLegend` existing) |
|---|---|---|
| 1. Identifikasi Masalah & Batasan (Ask) | 20% | Baru Memulai → Mahir |
| 2. Kreativitas Desain/Blueprint (Imagine–Plan) | 25% | Baru Memulai → Mahir |
| 3. Fungsionalitas Purwarupa & Ketepatan Data (Create–Test) | 35% | Baru Memulai → Mahir |
| 4. Kualitas Iterasi & Justifikasi Perbaikan (Improve) | 20% | Baru Memulai → Mahir |

Ditambah **Asesmen Diagnostik per-domain** (4 pertanyaan pendek: 1 Science, 1 Technology, 1 Engineering, 1 Mathematics) agar guru bisa memetakan kesiapan siswa di 4 domain sekaligus — bukan cuma satu pertanyaan generik seperti model lain.

---

## 5. Rencana Perubahan File (Detail Teknis)

| File | Aksi | Detail |
|---|---|---|
| `src/engines/stemEngine.js` | **BUAT BARU** | Ekspor `STEM_SINTAKS` (entri EDP) + fungsi `generateStemActivities(topik, mapel, jenjang)` |
| `src/engines/learningModelEngine.js` | **EDIT (tambah 1 baris)** | Tambahkan entri `"STEM (Engineering Design Process)"` ke object `MODEL_PEMBELAJARAN` — pola sama persis dengan 18 entri lain, **tidak menghapus/mengubah entri lama** |
| `src/engines/lkpdEngine.js` | **BUAT BARU** | Fungsi `generateLKPD(payload)` menghasilkan struktur 5-bagian di atas → return objek JS + fungsi `renderLKPDToHTML()` untuk print |
| `src/engines/planningEngine.js` | **EDIT (extend function)** | Tambah cabang kondisi di `generateInstrumenAsesmen()` untuk kasus metode STEM → panggil rubrik EDP 4-kriteria |
| `src/schemas/lkpd.schema.json` | **BUAT BARU** | JSON Schema draft 2020-12, konsisten format dengan `assessment.schema.json` yang sudah ada |
| `src/schemas/assessment.schema.json` | **EDIT (tambah properti opsional)** | Tambah properti `edpRubric` (opsional, tidak wajib) agar RPP non-STEM tetap valid tanpa properti ini |
| `index.html` | **EDIT (UI wiring)** | 1) Ganti `MODEL_PEMBELAJARAN` inline agar **import** dari `src/engines/learningModelEngine.js` via `<script type="module">` — sekaligus menuntaskan utang teknis duplikasi kode. 2) Tambah tombol **"📄 Generate LKPD"** di panel hasil, muncul kondisional saat metode = STEM. 3) Tambah blok cetak (print CSS) untuk LKPD, reuse class `.print-a4` yang sudah ada. |
| `docs/ARCHITECTURE.md` | **EDIT (dokumentasi)** | Tambahkan node baru di diagram: `1b. STEM & LKPD Engine` bercabang dari Planning Engine |
| `docs/ROADMAP.md` | **EDIT** | Catat fase baru "MVP 3.5 — STEM & LKPD Engine" |
| `test-valid-lesson-plan.json` | **TAMBAH file test baru** | `test-valid-stem-lesson-plan.json` sebagai contoh payload STEM untuk regresi manual |

> Catatan: **tidak ada file lama yang dihapus**, sesuai *Safety Notes* README poin 1 & 2.

---

## 6. Fase Implementasi (mengikuti gaya penomoran roadmap proyek: MVP)

| Fase | Nama | Isi Pekerjaan | Estimasi |
|---|---|---|---|
| **MVP 3.5-A** | Sintaks STEM-EDP | Tambah entri `MODEL_PEMBELAJARAN`, unit-test manual via `test-valid.json` | 0.5 hari |
| **MVP 3.5-B** | LKPD Engine (Core) | Buat `lkpdEngine.js` + `lkpd.schema.json`, fungsi generate JSON (belum UI) | 1–1.5 hari |
| **MVP 3.5-C** | LKPD Render & Print | Render HTML print-ready di `index.html`, styling A4 konsisten RPP | 1 hari |
| **MVP 3.5-D** | Penilaian EDP | Extend `generateInstrumenAsesmen()`, rubrik 4 kriteria + diagnostik 4-domain | 1 hari |
| **MVP 3.5-E** | Integrasi UI & Dropdown | Tombol "Generate LKPD", opsi metode di form, kondisional tampil hanya utk STEM | 0.5–1 hari |
| **MVP 3.5-F** | Modularisasi Utang Teknis | Ganti `MODEL_PEMBELAJARAN` inline `index.html` → import modul (regresi test 18 model lama wajib tetap identik) | 1 hari |
| **MVP 3.5-G** | Validasi & Dokumentasi | Update `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, tambah contoh payload uji | 0.5 hari |

**Total estimasi:** ± 5.5–6.5 hari kerja (bisa dicicil per fase tanpa mengganggu produksi, karena setiap fase independen dan additive).

---

## 7. Kriteria Uji Terima (Acceptance Criteria)

| # | Kriteria | Cara Verifikasi |
|---|---|---|
| 1 | 18 model pembelajaran lama tetap menghasilkan output identik sebelum & sesudah perubahan | Diff manual output RPP untuk tiap model sebelum/sesudah refactor import |
| 2 | Memilih metode "STEM (Engineering Design Process)" menghasilkan sintaks 5M yang memuat 4 domain S-T-E-M secara eksplisit | Review manual teks output |
| 3 | Tombol "Generate LKPD" hanya muncul saat metode STEM dipilih | Uji UI manual |
| 4 | LKPD hasil generate valid terhadap `lkpd.schema.json` | Validasi via `ajv` (browser-compatible, tanpa build step) atau validator manual |
| 5 | Rubrik penilaian EDP menghasilkan total bobot = 100% | Assertion sederhana di kode (`sum weights === 100`) |
| 6 | Ekspor JSON (`lesson-plan-*.json`) tetap backward-compatible untuk RPP non-STEM | Uji ekspor dengan & tanpa properti `edpRubric` |
| 7 | Tidak ada perintah destructive dijalankan selama development | Review commit log |

---

## 8. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Refactor `MODEL_PEMBELAJARAN` inline → import modul memicu regresi 18 model lama | Lakukan di fase **terakhir** (MVP 3.5-F), setelah fitur STEM stabil, dengan uji diff output |
| LKPD terlalu generik (template kaku) jika topik antar mapel berbeda jauh (IPA vs Bahasa) | Reuse pola `isBahasa` check yang sudah ada di `SmartEngine.getLingkupMateri()` untuk percabangan konten |
| Beban satu file `index.html` makin besar (sudah 96 KB) | Pertimbangkan lazy-load blok render LKPD hanya saat dibutuhkan (dynamic import ES module) |
| Guru bingung kapan pakai STEM vs PjBL/Inquiry (karena mirip) | Tambahkan tooltip/deskripsi singkat di dropdown: *"Gunakan STEM jika ingin siswa merancang & menguji purwarupa dengan pengukuran data kuantitatif eksplisit."* |

---

## 9. Contoh Struktur Output (Ringkas)

```json
{
  "metode": "STEM (Engineering Design Process)",
  "sintaks": {
    "memahami": "Ask: Identifikasi masalah nyata & batasan teknis terkait topik...",
    "mengaplikasi": "Imagine-Plan-Create: Curah gagasan, sketsa desain, bangun purwarupa...",
    "merefleksi": "Test-Improve: Uji performa dengan data kuantitatif, revisi desain...",
    "sumatif": "Penilaian Produk & Proses Rancang (EDP 4 Kriteria)"
  },
  "lkpd": {
    "identitas": { "topik": "...", "mapel": "...", "kelas": "...", "waktu": "..." },
    "orientasiMasalah": "...",
    "kegiatanInti": { "ask": "...", "imagine_plan": "...", "create": "...", "test_improve": "..." },
    "lembarData": { "tabelPengukuran": [] },
    "refleksi": ["..."]
  },
  "rubrikEDP": {
    "kriteria": [
      { "nama": "Identifikasi Masalah & Batasan", "bobot": 20 },
      { "nama": "Kreativitas Desain", "bobot": 25 },
      { "nama": "Fungsionalitas Purwarupa & Data", "bobot": 35 },
      { "nama": "Kualitas Iterasi", "bobot": 20 }
    ],
    "skalaLevel": ["Baru Memulai", "Berkembang", "Cakap", "Mahir"]
  }
}
```

---

## 10. Rekomendasi Lanjutan (Opsional, Pasca-STEM)

- Setelah STEM Engine stabil, ini jadi **blueprint** yang sama untuk menghidupkan `Question Parser`/`Question Validator` yang sudah ada tapi belum terhubung — soal STEM (terutama numerasi & sains) sangat cocok diuji dengan validator taksonomi Bloom yang sudah dirancang di `questionValidatorEngine.js`.
- Data LKPD + rubrik EDP bisa jadi input langsung untuk modul roadmap **Google Form Builder** (isian data pengukuran siswa → auto-form Google Form dengan kolom numerik).

---

*Dokumen ini disusun berdasarkan audit langsung terhadap kode sumber repositori `nazure001/rpp-generator` (README, `docs/ARCHITECTURE.md`, `src/engines/*.js`, `src/schemas/*.json`, dan `index.html`) per 13 Juli 2026.*
