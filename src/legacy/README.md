# 🏛️ Legacy Architecture & Refactoring Preparation Notes

Dokumen ini menjelaskan status arsitektur masa transisi dalam repositori `nazure001/rpp-generator`.

---

## 🛑 Status Produksi Eksisting (`index.html`)

Aplikasi produksi utama **Smart RPP Generator Pro** saat ini tetap berjalan 100% dari berkas monolitik `index.html` yang berada di root repositori.
Sesuai prinsip **Zero-Breakage Guarantee**:
1. Berkas `index.html` **TIDAK DIUBAH ATAUPUN DIMODIFIKASI** pada tahap persiapan refactor ini.
2. Seluruh alur kerja guru, form input, dan pratinjau cetak A4 pada `index.html` tetap berfungsi normal dan tidak bergantung pada berkas modular baru.

---

## 🚀 Persiapan Modul Arsitektur Baru (`src/engines/`)

Untuk mempersiapkan transformasi menuju **AssessmentHub AI** tanpa mengganggu aplikasi lama, kami telah mengekstraksi data dan logika mesin utama ke dalam struktur modul ES6 terpisah:

* **`src/engines/curriculumEngine.js`**: Menyimpan dan mengekspor objek `DATABASE_KURIKULUM` (BSKAP No. 046/H/KR/2026).
* **`src/engines/pmmEngine.js`**: Menyimpan dan mengekspor objek `DATA_PMM_FULL` (8 Indikator Observasi Kinerja PMM).
* **`src/engines/learningModelEngine.js`**: Menyimpan dan mengekspor objek `MODEL_PEMBELAJARAN`, `ASPEK_MURID_MAP`, dan fungsi `getModelData(metode)`.
* **`src/engines/planningEngine.js`**: Menyimpan dan mengekspor objek `SmartEngine` (logika perumusan skenario pembelajaran, asesmen, dan mitigasi masalah) yang mengimpor dependensi dari engine di atas.

Modul-modul ini **belum dihubungkan (*not wired yet*)** ke dalam `index.html` ataupun `asesmen.html`. Modul ini disiapkan khusus untuk arsitektur AssessmentHub AI masa depan agar alur kerja baru menjadi lebih modular, mudah diuji, dan tidak terikat pada satu berkas monolitik besar.
