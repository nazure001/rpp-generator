# 🧪 Question Parser Engine - Test Samples

Dokumen ini berisi sampel teks mentah (*raw text*) untuk menguji fungsionalitas modul `parseQuestionsFromText` pada `src/engines/questionParserEngine.js`.
Setiap sampel merepresentasikan skenario kualitas input yang berbeda yang akan dievaluasi oleh sistem validator pada fase pengembangan berikutnya (V3).

---

## Sampel 1: Valid Pilihan Ganda (PG Standard)
Sampel ini memuat format butir soal pilihan ganda yang lengkap dengan stimulus naratif, kalimat pertanyaan, 4 opsi jawaban standar (A, B, C, D), dan seluruh metadata pendukung.

```text
1. Perhatikan fenomena alam berikut ini!
Pada pagi hari yang dingin, sering kali kita melihat titik-titik air pada daun rumput di halaman rumah meskipun semalam tidak turun hujan. Fenomena alam ini terjadi karena adanya perubahan wujud zat dari uap air di udara menjadi cair.
Berdasarkan ilustrasi di atas, proses perubahan wujud zat yang terjadi disebut dengan peristiwa...
A. Menguap
B. Mengembun
C. Menyublim
D. Membeku
Kunci: B
Indikator: Peserta didik mampu menganalisis fenomena perubahan wujud zat dalam kehidupan sehari-hari
Level: C4
Materi: Wujud Zat dan Perubahannya
```

---

## Sampel 2: Missing Answer Key (Kunci Jawaban Hilang)
Sampel ini menguji ketahanan parser terhadap butir soal yang kehilangan metadata kunci jawaban (`Kunci:`). Parser tetap harus berhasil mengekstrak stimulus, pertanyaan, dan opsi jawaban, namun kolom `correctAnswer` akan bernilai string kosong (`""`) sehingga memicu status validasi bermasalah pada V3.

```text
2. Seorang siswa melakukan percobaan hukum Newton dengan mendorong meja seberat 15 kg di atas lantai licin. Gaya dorong yang diberikan oleh siswa tersebut adalah sebesar 30 N ke arah kanan.
Berapakah percepatan yang dialami oleh meja tersebut saat didorong?
A. 0,5 m/s²
B. 1,5 m/s²
C. 2,0 m/s²
D. 5,0 m/s²
Indikator: Peserta didik mampu menghitung percepatan benda menggunakan Hukum II Newton
Level: C3
Materi: Hukum Newton dan Dinamika Gerak
```

---

## Sampel 3: Option Count Less Than 4 (Opsi Kurang dari 4)
Sampel ini menguji butir soal tidak standar yang hanya memiliki 2 opsi jawaban (Benar/Salah atau opsi tidak lengkap). Parser akan menghasilkan array `options` dengan panjang 2 (`options.length < 4`).

```text
3. Bumi melakukan dua jenis gerakan utama di tata surya, yaitu rotasi dan revolusi. Rotasi bumi adalah perputaran bumi pada porosnya yang membutuhkan waktu sekitar 24 jam untuk satu kali putaran penuh.
Apakah dampak utama yang secara langsung ditimbulkan oleh rotasi bumi bagi kehidupan manusia sehari-hari?
A. Terjadinya pergantian siang dan malam di berbagai belahan bumi
B. Terjadinya perubahan musim yang berganti setiap enam bulan sekali
Kunci: A
Indikator: Peserta didik membedakan dampak rotasi dan revolusi bumi
Level: C2
Materi: Sistem Tata Surya
```
