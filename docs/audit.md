# Analisis Repositori `nazure001/rpp-generator`

Aku sudah mempelajari repositori, histori pengembangan, arsitektur, modul, schema, PR aktif, serta tiga dokumen rancangan yang kamu unggah. **Tidak ada file, branch, issue, atau PR yang aku ubah.**

## Kesimpulan Utama

Repositori ini sudah bukan sekadar **RPP Generator**. Secara nyata, proyek telah berkembang menjadi dua aplikasi yang saling terhubung:

| Aplikasi       | Peran                            | Kondisi aktual                                 |
| -------------- | -------------------------------- | ---------------------------------------------- |
| `index.html`   | Generator RPP/Modul Ajar         | Aplikasi produksi utama, masih monolitik       |
| `asesmen.html` | AssessmentHub AI                 | Sudah berkembang sampai MVP 11                 |
| `src/engines/` | Referensi mesin modular          | Belum menjadi sumber logika utama UI           |
| `src/schemas/` | Kontrak data JSON                | Ada, tetapi mulai tertinggal dari implementasi |
| PR #9          | MVP 12 konfigurasi paket asesmen | Masih terbuka dan belum aman langsung digabung |

Dokumentasi README masih menyebut Assessment Generator sebagai roadmap dan parser-validator sebagai prototipe mandiri. Namun histori commit menunjukkan fitur sudah berkembang dari MVP 5 sampai MVP 11: import JSON, parser soal, validator, review workflow, readiness gate, Google Form Blueprint, advanced question schema, dan Question Bank Manager.

---

# Temuan Prioritas

## P0 — `asesmen.html` pada `main` terindikasi rusak

Pada fungsi `calculateDuplicateScores()`, terdapat blok kode yang terduplikasi:

```javascript
const score = calculateSimilarity(...);
if (score > maxScore) {
    if (score === 1.0 && i > idx) {
        const score = calculateSimilarity(...);
        if (score > maxScore) {
```

Struktur kurungnya tidak lagi seimbang terhadap loop dan callback di sekitarnya. Ini bukan sekadar duplikasi kosmetik; **kode tersebut sangat kuat terindikasi menghasilkan syntax error saat diproses Babel**, sehingga aplikasi asesmen dapat gagal merender.

Menariknya, blok tersebut sudah normal pada branch PR #9:

```javascript
if (score === 1.0 && i > idx) {
    continue;
}
maxScore = score;
duplicateOfId = other.questionId || other.id;
```

**Rekomendasi:** jangan menjadikan merge seluruh PR #9 sebagai cara memperbaiki bug ini. Ambil perbaikan kecil tersebut melalui branch terpisah, misalnya:

```text
fix/duplicate-score-syntax
```

Lalu lakukan browser smoke test sebelum melanjutkan MVP lain.

---

## P1 — Dokumentasi sudah tertinggal cukup jauh

Dokumen roadmap masih menyebut:

* MVP 5 sebagai roadmap.

* Parser dan validator belum terhubung UI.

* AssessmentHub masih prototipe eksperimental.

Sementara implementasi aktual sudah mencapai:

| MVP    | Fitur                                         |
| ------ | --------------------------------------------- |
| MVP 5  | Import RPP dan assessment draft               |
| MVP 6  | Parser dan validator UI                       |
| MVP 7  | Review dan approval                           |
| MVP 8  | Export readiness gate                         |
| MVP 9  | Google Form Blueprint                         |
| MVP 10 | Universal advanced question schema            |
| MVP 11 | Question Bank Manager dan duplicate detection |
| MVP 12 | Konfigurasi paket asesmen, masih PR           |

PR #9 untuk MVP 12 masih terbuka, mengubah hanya `asesmen.html`, dengan **571 penambahan baris**. Browser smoke test juga dinyatakan masih belum dilakukan.

Akibat dokumentasi yang stale, agen berikutnya dapat salah memahami posisi proyek dan membangun fitur pada fondasi yang sudah berubah.

---

## P1 — Schema dan runtime mulai mengalami drift

Contoh paling jelas adalah status validasi.

Schema menetapkan:

```text
Pending
Valid
Revision Required
Rejected
```

dan status review:

```text
Validated
Needs Revision
Approved
Locked
```

Tetapi runtime memakai:

```text
DRAFT
VALID
WARNING
ERROR
```

serta ketika soal masuk bank:

```javascript
reviewStatus: "Draft"
```

Standalone validator juga menghasilkan `"VALID"` atau `"INVALID"`, bukan enum yang ada di schema.

### Dampaknya

| Area                | Risiko                                                            |
| ------------------- | ----------------------------------------------------------------- |
| Validasi JSON       | Data runtime tidak lolos schema ketat                             |
| Import/export       | Status harus dinormalisasi berulang kali                          |
| Google Form Builder | Filter soal dapat salah membaca status                            |
| MVP 12–13           | Coverage dan random selection bisa menganggap soal tidak tersedia |
| Analitik masa depan | Status historis menjadi tidak konsisten                           |

Saat ini masalah tersebut tersamarkan karena sebagian schema memakai:

```json
"additionalProperties": true
```

Artinya data tambahan diterima, tetapi kontrak datanya tidak benar-benar mengendalikan implementasi.

---

## P1 — Arsitektur modular masih berupa “salinan referensi”

`learningModelEngine.js` sudah mengekspor `MODEL_PEMBELAJARAN` dan `getModelData()`.

Namun `index.html` masih memiliki salinan lengkap `MODEL_PEMBELAJARAN` dan fungsi `getModelData()` sendiri.

Pola serupa terjadi pada:

* Database kurikulum.
* Indikator PMM.
* Parser soal.
* Validator soal.
* Normalisasi tipe soal.
* Export builder.

Akibatnya ada dua atau tiga versi logika yang dapat berbeda:

```text
src/engines/*
      ↕ tidak benar-benar diimpor
index.html
asesmen.html
```

Ini adalah sumber utama **schema drift**, **logic drift**, dan regresi diam-diam.

### Catatan terhadap rencana STEM

Dalam dokumen implementasi STEM, modularisasi model dianggap dapat dilakukan dengan mengganti konstanta inline menjadi import ES module. 

Secara teknis, perubahan itu **bukan sekadar satu baris**:

* `index.html` menjalankan aplikasi dalam `<script type="text/babel">`.
* Engine menggunakan sintaks ES module `export`.
* Variabel dari `<script type="module">` tidak otomatis tersedia pada scope script Babel klasik.
* Urutan pemuatan asynchronous juga harus dikendalikan.

Solusinya memerlukan salah satu pendekatan:

| Opsi                                                 | Risiko                                             |
| ---------------------------------------------------- | -------------------------------------------------- |
| Bridge melalui `window.AssessmentHubEngines`         | Rendah–sedang                                      |
| Jadikan script Babel sebagai module                  | Sedang                                             |
| Migrasi ke Vite/build pipeline                       | Tinggi dan bertentangan dengan zero-build saat ini |
| Pertahankan inline sementara, tambah regression test | Paling aman untuk fase awal                        |

Jadi keputusan dokumen untuk melakukan modularisasi UI pada fase terakhir sudah tepat, tetapi estimasi teknisnya perlu dinaikkan.

---

## P2 — “Zero-build” benar, tetapi belum benar-benar “offline-first”

Kedua HTML mengambil dependensi dari internet:

* React dari `unpkg`.
* ReactDOM dari `unpkg`.
* Babel Standalone.
* Tailwind CDN.
* Lucide.
* Google Fonts.

Dokumentasi menyatakan aplikasi dapat dibuka langsung dan bersifat offline-capable.

Definisi yang lebih akurat saat ini:

> **Zero-build, static-host friendly, dan local-data-first, tetapi masih membutuhkan koneksi internet untuk memuat dependency pada kunjungan awal.**

Untuk menjadi offline-first penuh, aset perlu di-vendor secara lokal atau memakai service worker dengan cache yang teruji.

---

# Arsitektur Aktual yang Aku Pahami

```text
┌────────────────────────────────────────────┐
│ index.html — Smart RPP Generator           │
│ identitas, CP, PMM, model, RPP, instrumen  │
└───────────────────┬────────────────────────┘
                    │ Export JSON
                    ▼
┌────────────────────────────────────────────┐
│ asesmen.html — AssessmentHub AI            │
│ import draft / lesson plan                 │
│ blueprint                                  │
│ parser + validator                         │
│ question bank                              │
│ review / approval / lock                   │
│ duplicate detection                        │
│ readiness gate                             │
│ final JSON                                 │
│ Google Form Blueprint                      │
└───────────────────┬────────────────────────┘
                    │ tahap berikut
                    ▼
       Paket Asesmen → GAS → Google Form
```

Sedangkan arsitektur target jangka panjang mencakup Planning Engine, Curriculum Engine, Assessment Generator, Question Parser, Validator, Google Form Builder, Drive Organizer, dan Evidence Mapper.

---

# Evaluasi Tiga Dokumen yang Kamu Kirim

## 1. `IMPLEMENTATION_PLAN_STEM_ENGINE.md`

Dokumen ini **kuat secara arah arsitektur** karena:

| Kekuatan                         | Penilaian    |
| -------------------------------- | ------------ |
| Perubahan additive               | Tepat        |
| Tidak mengganti 18 model lama    | Tepat        |
| STEM memakai EDP                 | Tepat        |
| LKPD sebagai output terstruktur  | Tepat        |
| Rubrik menilai proses dan produk | Tepat        |
| Ada acceptance criteria          | Sangat bagus |
| Modularisasi dilakukan terakhir  | Aman         |

Namun asumsi status repo sudah tertinggal. Dokumen menganggap AssessmentHub masih berada dekat MVP 3–5, sedangkan implementasinya sudah MVP 11 dan menuju MVP 12. 

Penomoran **MVP 3.5** juga sudah tidak cocok. Lebih aman menjadikannya jalur fitur tersendiri:

```text
STEM-1  STEM Learning Model
STEM-2  STEM Context Schema
STEM-3  LKPD Generator
STEM-4  EDP Rubric
STEM-5  AssessmentHub Integration
```

Dengan begitu, fitur STEM tidak bertabrakan dengan nomor MVP AssessmentHub.

---

## 2. `SCHEMA_ASSESSMENTHUB.md`

Dokumen ini memberikan fondasi konseptual yang bagus:

* `CurriculumProfile`
* `AssessmentBlueprint`
* `QuestionBankSchema`
* `ObservationRubricSchema`
* `StudentAnalyticsSchema`
* Storage Adapter
* Cloud sync setelah schema matang



Namun implementasi sekarang sudah melampaui schema tersebut. Entitas yang perlu dimasukkan ke revisi schema antara lain:

| Entitas aktual baru               | Sumber fitur |
| --------------------------------- | ------------ |
| `reviewStatus` dan `reviewReport` | MVP 7        |
| `exportReadiness`                 | MVP 8        |
| `googleFormBlueprint`             | MVP 9        |
| Universal question type           | MVP 10       |
| `bankStatus`                      | MVP 11       |
| `duplicateCheck`                  | MVP 11       |
| `assessmentPackageConfig`         | MVP 12       |
| Blueprint row coverage            | MVP 12       |
| Parallel package configuration    | MVP 12       |

Jadi dokumen tersebut sebaiknya diperlakukan sebagai **Foundation v1**, bukan lagi schema final.

---

## 3. `STEM.md`

Dokumen ini lebih kuat pada sisi pedagogis dibanding implementation plan karena tidak hanya membahas EDP, tetapi juga mensyaratkan:

* Dimensi Profil Lulusan.
* Tujuan Pembelajaran eksplisit.
* Praktik pedagogis.
* Lingkungan pembelajaran.
* Kemitraan.
* Pemanfaatan digital.
* Topik dan permasalahan STEM.
* Tantangan proyek.
* Asesmen awal, proses, dan akhir.
* Assessment as/for/of learning.
* Ceklis, anekdotal, rubrik, dan portofolio.



Dokumen ini sebaiknya menjadi **pedagogical contract**, sedangkan `IMPLEMENTATION_PLAN_STEM_ENGINE.md` menjadi **technical contract**. Keduanya jangan digabung mentah; hubungkan melalui satu schema `stemContext`.

Contoh struktur konseptual yang lebih matang:

```javascript
stemContext: {
  realWorldProblem,
  projectChallenge,
  constraints,
  stemDomains: {
    science,
    technology,
    engineering,
    mathematics
  },
  graduateProfileDimensions: [],
  learningEnvironment,
  partnership,
  digitalUtilization,
  engineeringDesignProcess: {
    ask,
    imagine,
    plan,
    create,
    test,
    improve,
    communicate
  }
}
```

---

# Urutan Kerja yang Paling Aman

| Prioritas | Fase             | Tindakan                                                          |
| --------- | ---------------- | ----------------------------------------------------------------- |
| **P0**    | Recovery         | Perbaiki syntax `calculateDuplicateScores()` melalui PR kecil     |
| **P0**    | Verification     | Uji `index.html` dan `asesmen.html` di browser, cek console       |
| **P1**    | Contract Sync    | Selaraskan status, tipe soal, nama properti, dan enum schema      |
| **P1**    | Documentation    | Update README, ROADMAP, ARCHITECTURE, dan DATA_FLOW sampai MVP 12 |
| **P1**    | Regression Guard | Tambahkan pemeriksaan syntax dan fixture JSON minimal             |
| **P2**    | STEM Core        | Tambahkan `stemEngine.js` dan `stemContext.schema.json` tanpa UI  |
| **P2**    | STEM Model       | Tambahkan sintaks STEM-EDP secara additive                        |
| **P2**    | LKPD             | Bangun generator JSON dan HTML print-ready                        |
| **P2**    | Assessment       | Tambahkan diagnostik empat domain dan rubrik EDP                  |
| **P3**    | UI Wiring        | Hubungkan ke `index.html` setelah engine dan schema stabil        |
| **P3**    | AssessmentHub    | Jadikan output STEM sebagai input blueprint dan bank soal         |

---

## COMPLETED

* Mempelajari arsitektur dan histori repositori.
* Memeriksa `index.html`, `asesmen.html`, engine, schema, dokumentasi, dan roadmap.
* Memeriksa perkembangan MVP 5–11.
* Memeriksa PR #9 untuk MVP 12.
* Membandingkan implementasi dengan tiga dokumen STEM/AssessmentHub.
* Menemukan satu blocker kritis pada `main`.
* Tidak melakukan perubahan apa pun.

## VERIFIED

* Duplikasi logika antara HTML dan `src/engines/`.
* Ketidaksesuaian status runtime dengan schema.
* Dokumentasi tertinggal dari implementasi.
* PR #9 masih terbuka.
* Branch PR #9 memiliki blok duplicate scoring yang lebih benar daripada `main`.
* Build/deployment Vercel berstatus berhasil, tetapi itu **bukan bukti bahwa script Babel berhasil dirender di browser**.

## REMAINING RISKS

* Browser smoke test belum aku jalankan.
* Isi CP BSKAP dan istilah regulatif belum diaudit terhadap sumber resmi dalam audit kode ini.
* Belum ada bukti automated test yang menguji parsing Babel, UI flow, schema validation, atau export round-trip.
* PR #9 masih memiliki beberapa catatan review penting mengenai normalisasi tipe soal, performa, dan coverage matching.

## RECOMMENDED NEXT PHASE

**Jangan mulai implementasi STEM dulu sebelum blocker `asesmen.html` diperbaiki.** Urutan paling rasional adalah:

> Pulihkan `main` → verifikasi browser → sinkronkan schema dan dokumentasi → baru mulai STEM Core secara terisolasi.

Dengan peta ini, aku sudah memahami posisi repo, pola pengembangannya, prinsip keselamatannya, dan hubungan antara RPP Generator, AssessmentHub, STEM Engine, LKPD, serta pipeline asesmen berikutnya.
