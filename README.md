# Smart RPP Generator Pro (DeepLearningOS) & AssessmentHub AI

**Smart RPP Generator Pro** adalah aplikasi berbasis web (*Single Page Application* / SPA) yang dirancang khusus untuk guru di Indonesia guna menyusun Rencana Pelaksanaan Pembelajaran (RPP) dan Modul Ajar secara cerdas, cepat, dan terintegrasi langsung dengan sistem observasi PMM (Pengelolaan Kinerja Guru) terbaru. 

Saat ini, proyek ini sedang bertransisi dan berevolusi menuju ekosistem **AssessmentHub AI**, sebuah platform otomatisasi asesmen dan administrasi pembelajaran end-to-end berbasis teknologi cerdas tanpa mengganggu fungsionalitas RPP yang sudah berjalan stabil.

---

### 📊 Status Saat Ini (*Current Status*)

- **🟢 Produksi (Aktif & Stabil)**: 
  - **RPP Generator (`index.html`)**: Aplikasi generator RPP statis berbasis web berfungsi penuh untuk merancang RPP 5 langkah, mendukung cetak A4 (*print-ready*), serta dilengkapi fitur ekspor data JSON.
  - **AssessmentHub AI (`asesmen.html`)**: Kini aktif penuh hingga **MVP 13 (Controlled Random Builder)**. Mendukung blueprint dinamis, parsing/validasi butir soal, workflow persetujuan, manajemen bank soal dengan duplicate filtering, konfigurasi paket asesmen paralel, serta pengacakan soal cerdas dan swap manual.
- **🔵 Fondasi Arsitektur (*MVP 1 - MVP 3*)**: Skema standar data (*JSON Schema*), dokumentasi arsitektur, dan ekstraksi modul mesin pembantu (*engines*) telah disiapkan di dalam repositori.
- **🟣 Dalam Perencanaan (*Roadmap / Planned*)**: Integrasi Google Form kuis otomatis, organisasi Google Drive, dan pemetaan bukti akreditasi sedang dalam tahap rancangan jalan (*roadmap*).

---

## 🚀 Fitur Eksisting RPP Generator & AssessmentHub (*Existing Features*)

Aplikasi utama yang saat ini dapat langsung digunakan memiliki fitur unggulan sebagai berikut:

- **Integrasi 8 Indikator PMM**: Otomatisasi penyisipan target perilaku spesifik (Disiplin Positif, Keteraturan Kelas, dll) ke dalam skenario pembelajaran.
- **Smart Engine Logic**: Menghasilkan tujuan pembelajaran, langkah-langkah kegiatan, dan instrumen asesmen secara kontekstual hanya dengan memasukkan topik materi.
- **18+ Model Pembelajaran**: Mendukung berbagai model mulai dari PBL, PjBL, Discovery Learning, hingga Game-Based Learning.
- **Asesmen Komprehensif**: Pembuatan instrumen diagnostik, formatif (rubrik observasi), dan sumatif secara otomatis.
- **Question Bank Manager & Duplicate Filter**: Melacak duplikasi soal di bank menggunakan kemiripan Jaccard, dengan dukungan persetujuan/koreksi soal terstruktur.
- **Controlled Randomizer & Overrides**: Mengacak seleksi soal dari bank secara otomatis sesuai kriteria blueprint dan memungkinkan guru menukar soal (swap) dengan kandidat pengganti.
- **Ekspor Data Non-Destruktif**: Kemampuan mengunduh hasil rancangan ke dalam format berkas JSON standar.
- **Siap Cetak (Print-Ready)**: Output dokumen terformat standar A4 yang rapi untuk kebutuhan administrasi sekolah.

---

## 🌟 Visi Baru: AssessmentHub AI (*New Vision*)

**AssessmentHub AI** adalah visi kesinambungan untuk mengubah RPP Generator yang awalnya hanya memproduksi dokumen administrasi (RPP) menjadi ekosistem pembelajaran yang mampu mentransformasi rencana asesmen menjadi tindakan nyata di kelas.

Dengan visi ini, data tujuan pembelajaran dan rencana penilaian dari RPP akan diproses secara otomatis untuk menghasilkan **kisi-kisi asesmen (blueprint)**, **butir soal evaluasi tervalidasi**, **form ujian digital (Google Form)**, hingga **arsip bukti fisik di Google Drive** yang terikat langsung dengan indikator akreditasi dan PMM.

---

## 🧩 Modul yang Direncanakan (*Planned Modules*)

Beberapa modul utama yang menyusun arsitektur AssessmentHub AI dibagi ke dalam status berikut:

| Modul | Status | Deskripsi |
| :--- | :--- | :--- |
| **1. Planning Engine** | 🟢 **Selesai (Aktif)** | Mesin inti penyusun RPP dan skenario pembelajaran kontekstual berbasis Kurikulum Merdeka dan PMM. |
| **2. Question Parser** | 🟢 **Selesai (Aktif)** | Terintegrasi di UI `asesmen.html` untuk memotong teks mentah soal menjadi struktur JSON berlabel (stimulus, pertanyaan, opsi A-E, dan kunci jawaban). |
| **3. Question Validator** | 🟢 **Selesai (Aktif)** | Terintegrasi di UI `asesmen.html` untuk mengevaluasi keabsahan struktur soal (minimal 4 opsi, kesesuaian kunci, validitas ranah kognitif C1-C6, dan indikator). |
| **4. Assessment Generator** | 🟢 **Selesai (Aktif)** | Mesin perumus kisi-kisi (*blueprint*), bank soal kognitif, duplicate checker, konfigurasi paket, dan controlled random builder. |
| **5. Google Form Builder** | 🟣 **Roadmap** | Integrasi berbasis Google Apps Script (GAS) untuk mengubah paket soal JSON menjadi form kuis online secara instan. |
| **6. Drive Organizer** | 🟣 **Roadmap** | Penataan folder otomatis di Google Drive untuk mengarsip RPP, paket soal, rekap nilai, dan bukti kinerja guru. |
| **7. Evidence Mapper** | 🟣 **Roadmap** | Pemetaan otomatis hasil asesmen dan dokumen pembelajaran ke dalam borang bukti akreditasi dan laporan PMM. |

> Fitur berlabel **Roadmap** sedang dalam pengembangan aktif dan belum diintegrasikan ke Google Workspace untuk menjaga stabilitas produksi offline-first.

---

## 💻 Cara Instalasi Versi Statis (*Installation & Usage*)

Aplikasi versi statis saat ini dibangun menggunakan arsitektur *Zero-Build SPA*, sehingga tidak memerlukan *setup* server rumit atau *build step*:

1. **Unduh atau Klon Repositori**:
   ```bash
   git clone https://github.com/nazure001/rpp-generator.git
   cd rpp-generator
   ```
2. **Jalankan Aplikasi**:
   * Buka berkas `index.html` langsung melalui *browser* modern (Chrome, Edge, Firefox, Safari).
   * Atau gunakan lokal server sederhana seperti Live Server di VS Code untuk pengalaman terbaik.

---

## 🗺️ Peta Jalan Pengembangan (*Development Roadmap*)

Pengembangan AssessmentHub AI dilakukan secara bertahap dengan prinsip *zero-regression*:

- **Fase 0 (MVP 0 - Selesai)**: Audit keselamatan repositori dan isolasi *branch* pengembangan (`feature/assessmenthub-foundation`).
- **Fase 1 (MVP 1 & 2 - Selesai)**: Strukturisasi dokumentasi arsitektur (`docs/`) dan modularisasi logika eksisting ke folder `src/engines/`.
- **Fase 2 (MVP 3 & 4 - Selesai)**: Pembuatan standar *JSON Schema* (`src/schemas/`) serta fitur ekspor JSON RPP dan Draft Asesmen.
- **Fase 3 (MVP 5 - MVP 11 - Selesai)**: Integrasi modul *Question Parser & Validator UI*, workflow tinjauan & persetujuan, readiness gate kelayakan ekspor, skema tipe soal tingkat lanjut, dan manajemen Bank Soal dengan filter duplikasi kemiripan teks Jaccard.
- **Fase 4 (MVP 12 & MVP 13 - Selesai)**: Implementasi konfigurasi Paket Asesmen paralel serta algoritma *Controlled Random Builder* dengan antarmuka manual swap/override soal.
- **Fase 5 (V4 & V5 - Roadmap)**: Integrasi *Google Apps Script (GAS)* untuk otomatisasi *Google Form Builder* dan *Drive Organizer*.
- **Fase 6 (V6 - Roadmap)**: Implementasi *Evidence / Accreditation Mapper* untuk pelaporan sekolah.

---

## 🛡️ Catatan Keselamatan (*Safety Notes*)

Repositori ini dikelola di bawah aturan ketat untuk melindungi fungsi produksi dan data pengguna:
1. **No Breaking Changes**: Fitur RPP Generator eksisting tidak boleh diubah atau dirusak selama pengembangan modul baru.
2. **Non-Destructive Operations**: Dilarang menggunakan perintah penghapusan massal (`rm -rf`, `del /s`, dll) yang berisiko merusak histori atau berkas lokal.
3. **No Credential Leaks**: Dilarang menyisipkan API Key (OpenAI, Google, dll) secara *hardcoded* di dalam kode sumber.
4. **No Hallucination**: Ekspor data dan modul parser/validator hanya beroperasi pada data yang benar-benar ada tanpa memalsukan atau menghalusinasi nilai kosong.

---

## 🔄 Rencana Integrasi Google Apps Script (GAS)

Pada fase *Roadmap V4 & V5*, sistem ini akan terintegrasi dengan Google Workspace melalui **Google Apps Script (GAS)** tanpa memerlukan peladen backend khusus atau biaya server cloud:
* Aplikasi web akan mengekspor berkas standar `export.schema.json` berisi paket soal yang terverifikasi.
* Skrip GAS (disekripsikan di folder `docs/` atau secara ekstensi) akan membaca JSON tersebut untuk memanggil *Google Form API* dan *Google Drive API*.
* Guru akan menerima tautan Google Form siap pakai beserta folder arsip yang terstruktur rapi di Drive pribadi mereka.

---

## ✍️ Penulis (*Author*)

Dikembangkan oleh **nazure_02** ([@purwaumbara](https://instagram.com/purwaumbara)).
