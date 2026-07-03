# 🛡️ AssessmentHub AI — Safe Coding & Agent Operating Rules

Dokumen ini memuat aturan keselamatan kerja, pedoman penulisan kode, dan batasan operasional yang **WAJIB DIPATUHI TANPA TERKECUALI** oleh setiap AI Agent atau kontributor pengembang yang bekerja pada repositori `nazure001/rpp-generator`.

Aturan ini dirancang untuk menjaga stabilitas sistem dan menjamin prinsip **Zero-Breakage Guarantee** bagi aplikasi RPP Generator eksisting.

---

## 🛑 Aturan Inti Keselamatan (Core Safety Rules)

### 1. Selalu Kerja di Branch Baru (*Work on Branches*)
* **Aturan**: Jangan pernah melakukan modifikasi langsung pada branch `main` atau `master`.
* **Alasan**: Menjaga branch utama tetap stabil dan aman sebagai versi produksi yang siap pakai.
* **Prosedur**: Setiap pengembangan fitur baru atau perbaikan harus dilakukan pada branch terisolasi dengan penamaan deskriptif, contoh: `feature/assessmenthub-foundation`, `feature/question-parser`, atau `fix/rubric-calculation`.

### 2. Jangan Hapus Aplikasi Eksisting (*Do Not Delete Existing App*)
* **Aturan**: Dilarang menghapus file lama seperti `index.html`, `README.md`, atau file pendukung lainnya.
* **Alasan**: Repositori lama berfungsi sebagai *Backup Hidup* (*Living Backup*) dan bukti rekam jejak pengembangan.
* **Prosedur**: Jika sebuah arsitektur baru diperkenalkan, bangun file baru berdampingan (misalnya `asesmen.html` atau file modular di folder `js/`) tanpa menghapus file monolitik aslinya.

### 3. Pertahankan Perilaku UI Eksisting (*Preserve Current UI Behavior*)
* **Aturan**: Fungsi, tampilan, dan alur kerja aplikasi RPP Generator lama di `index.html` harus tetap berjalan normal 100% (*No Regressions*).
* **Alasan**: Ribuan guru di Indonesia mengandalkan alur kerja eksisting untuk administrasi harian mereka; gangguan sekecil apa pun dapat merusak produktivitas mereka.
* **Prosedur**:
  * **PENTING: Jangan modifikasi `index.html` terlebih dahulu** sampai seluruh fondasi skema dan arsitektur AssessmentHub matang dan disetujui pengguna.
  * Setiap perubahan gaya CSS atau logika JS global harus dites silang agar tidak mempengaruhi tahapan form atau mode cetak A4 pada `index.html`.

### 4. Tanpa API Key di Dalam Kode (*No API Keys in Source*)
* **Aturan**: Dilarang keras menyisipkan atau meng-*hardcode* kredensial, rahasia (*secret*), token OAuth, atau API Key (OpenAI, Gemini, Firebase, dll.) ke dalam kode sumber HTML, JS, atau MD.
* **Alasan**: Mencegah kebocoran kredensial dan kelemahan keamanan publik pada repositori Git.
* **Prosedur**: Gunakan pendekatan logika algoritmik kontekstual lokal, atau minta input API Key secara dinamis dari pengguna melalui antarmuka UI tanpa menyimpannya secara permanen di dalam kode repositori.

### 5. Tanpa Perintah Shell Destruktif (*No Destructive Shell Commands*)
* **Aturan**: Dilarang menjalankan perintah terminal penghapusan massal atau pengaturan ulang paksa.
* **Alasan**: Mencegah kerusakan folder lokal, hilangnya arsip cadangan, atau keruntuhan riwayat Git.
* **Perintah Terlarang**:
  ```bash
  rm -rf *
  del /s /q *
  Remove-Item -Recurse -Force
  git reset --hard
  git clean -fd
  git push --force
  ```

### 6. Selalu Buat Ringkasan Perubahan (*Always Summarize Changes*)
* **Aturan**: Di setiap akhir penuntasan tugas atau tahap pengembangan, agen wajib menyajikan laporan ringkasan terstruktur.
* **Alasan**: Memudahkan tinjauan (*review*) dan audit perubahan oleh pemilik proyek sebelum disetujui.
* **Format Laporan Wajib**:
  * **COMPLETED**: Daftar item yang telah selesai dikerjakan.
  * **VERIFIED**: Metode pengujian atau verifikasi yang telah dilakukan.
  * **REMAINING RISKS**: Risiko yang tersisa atau area yang belum terverifikasi.
  * **RECOMMENDED NEXT PHASE**: Rekomendasi langkah prioritas berikutnya beserta tingkat risikonya.
  * **WAIT FOR APPROVAL**: Instruksi berhenti dan menunggu konfirmasi pengguna sebelum melanjutkan.

### 7. Verifikasi Minimal-Disrupsi (*Run Tests or Manual Verification*)
* **Aturan**: Lakukan pengujian dan verifikasi setelah setiap perubahan kode dengan metode yang paling tidak mengganggu (*least disruptive method*).
* **Alasan**: Memastikan stabilitas kompilasi (Babel JSX in-browser) dan fungsionalitas UI sebelum melaporkan tugas selesai.
* **Prosedur**:
  * Buka dan periksa render file HTML di browser.
  * Pastikan tidak ada pesan error pada konsol developer peramban (*Browser Console*).
  * Uji alur input dari Tahap 1 hingga mode Pratinjau Cetak A4.
  * Jangan pernah mengklaim bahwa kode telah terverifikasi jika pengujian sebenarnya tidak dilakukan.

---

## 📋 Checklist Kepatuhan Kontributor / Agen AI

Sebelum mengajukan *Pull Request* atau menyelesaikan sesi kerja, periksa daftar berikut:

- [ ] Apakah saya berada di branch `feature/*` atau `fix/*` (bukan `main`)?
- [ ] Apakah `index.html` tetap utuh dan berfungsi normal tanpa error konsol?
- [ ] Apakah saya tidak menggunakan perintah `rm`, `del`, atau `reset --hard`?
- [ ] Apakah seluruh berkas baru bersih dari *hardcode API Key* atau *OAuth Secret*?
- [ ] Apakah saya telah menyusun ringkasan perubahan terstruktur (COMPLETED/VERIFIED/REMAINING/NEXT PHASE)?
- [ ] Apakah saya telah menunggu persetujuan eksplisit pengguna sebelum lanjut ke fase berikutnya?
