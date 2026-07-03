import { DATA_PMM_FULL } from './pmmEngine.js';
import { getModelData, ASPEK_MURID_MAP } from './learningModelEngine.js';

// --- SMART ENGINE LOGIC ---
export const SmartEngine = {
    getLingkupMateri: (topik, mapel, metode, elemen) => {
        const t = topik || "[Topik]";
        const el = elemen || "[Elemen]";
        const m = (mapel || "").toLowerCase();
        const isBahasa = m.includes("bahasa") || m.includes("sastra") || m.includes("english") || m.includes("inggris");
        
        if (isBahasa) return `Kajian Elemen ${el}: Struktur, Kebahasaan, dan Refleksi Kontekstual pada Materi ${t}`;
        return `Eksplorasi Kompetensi Elemen ${el}: Penerapan Praktis dan Pendalaman Teoretis ${t} Berbasis Pendekatan ${metode}`;
    },

    getKesiapan: (topik, mapel) => ({
        konsep: `Sebagian besar siswa sudah berinteraksi dengan fenomena materi "${topik || '[Topik]'}" secara parsial di keseharian, namun pemahaman mendalam secara akademis pada rumpun mapel ${mapel || '[Mapel]'} memerlukan jembatan konsep yang terstruktur.`,
        teknis: `Siswa membutuhkan orientasi prosedural untuk menggunakan instrumen berpikir atau piranti teknis guna mengolah data terkait ${topik || '[Topik]'}.`,
        mental: `Menciptakan zona belajar bebas perundungan agar siswa memiliki ketahanan mental untuk bereksplorasi tanpa rasa takut salah.`
    }),

    generatePengalamanBelajar: (topik, mapel, metode, indikator, fokusPMM) => {
        const mod = getModelData(metode);
        const dataIndikator = DATA_PMM_FULL[indikator];

        let actsAwal = [];
        let actsInti = [];
        let actsAkhir = [];

        if (fokusPMM === "Semua Fokus") {
            const keys = Object.keys(dataIndikator);
            actsAwal = [dataIndikator[keys[0]][0], dataIndikator[keys[1]][0], dataIndikator[keys[2]][0]];
            actsInti = [dataIndikator[keys[0]][1], dataIndikator[keys[1]][1], dataIndikator[keys[2]][1]];
            actsAkhir = [dataIndikator[keys[0]][2], dataIndikator[keys[1]][2], dataIndikator[keys[2]][2]];
        } else {
            const fData = dataIndikator[fokusPMM];
            if(fData) {
                actsAwal = [fData[0]];
                actsInti = [fData[1]];
                actsAkhir = [fData[2]];
            }
        }

        const buildMulti = (arr) => {
            if (!arr || arr.length === 0) return "";
            if (arr.length === 1) return `**Guru ${arr[0]}**`;
            return `**Guru ${arr[0]}**, **${arr[1]}**, serta proaktif **${arr[2]}**`;
        };

        let inti1_pmm = "";
        let inti2_pmm = "";
        let inti3_pmm = "";

        if (fokusPMM === "Semua Fokus") {
            inti1_pmm = `- Di awal fase pemecahan, **guru secara asertif ${actsInti[0]}**.`;
            inti2_pmm = `- Saat murid mengaplikasikan instruksi, **guru berkeliling guna ${actsInti[1]}**.`;
            inti3_pmm = `- Pada sesi penarikan makna, **guru memandu jalannya kelas serta ${actsInti[2]}**.`;
        } else {
            inti2_pmm = `- Sebagai aksi nyata observasi PMM, **guru senantika proaktif ${actsInti[0]}**.`;
        }

        return {
            awal: `- Guru membuka kelas dengan salam hangat, mengecek presensi, dan memimpin doa bersama.\n- Kondisi Pijakan Awal: Dalam mengondisikan kesiapan belajar siswa, ${buildMulti(actsAwal)}.\n- Guru melempar pertanyaan pemantik kontekstual mengenai ${topik || "[Topik]"} dalam ruang lingkup ${mapel || "[Mapel]"}.\n- Menyampaikan target capaian pembelajaran hari ini.`,
            inti1: `${mod.memahami}\n\n${inti1_pmm ? inti1_pmm : "- Guru memandu jalannya orientasi konsep secara runtul dan joyful."}`,
            inti2: `${mod.mengaplikasi}\n\n${inti2_pmm}`,
            inti3: `${mod.merefleksi}\n\n${inti3_pmm ? inti3_pmm : "- Guru memfasilitasi konfirmasi materi guna meluruskan miskonsepsi siswa."}`,
            penutup: `- Guru bersama peserta didik merangkum kesimpulan esensial dari aktivitas ${topik || "[Topik]"}.\n- Kondisi Resolusi Akhir: Saat melakukan evaluasi dan refleksi penutup kelas, ${buildMulti(actsAkhir)}.\n- Berdoa bersama dan menutup kelas dengan salam.`
        };
    },

    generateRekomendasiAsesmen: (topik, metode, indikator, fokusPMM) => {
        const mod = getModelData(metode);
        const infoFokus = fokusPMM === "Semua Fokus" ? "seluruh ragam target perilaku" : "fokus aksi klinis";
        return {
            awal: `Diagnostik Kognitif awal: Mengukur pemahaman prasyarat siswa tentang ${topik || "[Topik]"}.`,
            formatif: `Lembar Observasi Sikap: Menilai dinamika perkembangan karakter siswa yang sinkron dengan rubrik PMM ${indikator} (${infoFokus}).`,
            sumatif: mod.sumatif
        }
    },

    generateInstrumenAsesmen: (topik, mapel, metode, indikator) => {
        const t = topik || "[Topik]";
        const m = mapel || "[Mapel]";
        const mod = getModelData(metode);

        const soalAwal = `PERTANYAAN DIAGNOSTIK:\n1. Tuliskan apa yang kamu pahami tentang materi "${t}" pada pelajaran ${m}?\n2. Berikan contoh nyata relevansi "${t}" dalam kehidupan sehari-hari!`;
        const legend = "Baru Memulai: Pasif, indikator belum terlihat, membutuhkan intervensi konstan.\nBerkembang: Mulai konsisten memunculkan perilaku namun belum stabil.\nCakap: Secara mandiri memunculkan perilaku baku secara ajeg.\nMahir: Proaktif, memberikan dampak positif bagi ritme kerja kelompok.";
        
        let soalSumatif = `TAGIHAN SUMATIF MATERI (${metode}):\n${mod.sumatif}\n\nPETUNJUK KERJA:\nSelesaikan penugasan komprehensif materi "${t}" ini secara bertanggung jawab bersama mitra kelompok Anda berdasarkan rubrik penilaian unjuk kerja terpilih!`;
        if (metode === "Project-Based Learning (PjBL)") soalSumatif = `TUGAS PROYEK MAJU:\nBuatlah purwarupa/karya nyata aplikatif terkait konsep "${t}".\n\nRubrik Penilaian:\n1. Orisinalitas & Desain Ide (20%)\n2. Proses Manufaktur & Gotong Royong (30%)\n3. Fungsionalitas Mekanik Produk (30%)\n4. Presentasi (20%)`;
        else if (metode === "Problem-Based Learning (PBL)") soalSumatif = `STUDI KASUS NYATA:\nLakukan bedah analisis mendalam pada problem rikel terkait "${t}" dan formulasikan draf solusinya!\n\nRubrik Penilaian:\n1. Kedalaman Identifikasi Akar Masalah (30%)\n2. Kelogisan & Relevansi Solusi (40%)\n3. Struktur Argumen Kelompok (30%)`;
        else if (metode === "Inquiry Learning") soalSumatif = `LAPORAN PENYELIDIKAN:\nSusunlah artikel laporan ilmiah terstruktur dari percobaan mandiri materi "${t}".\n\nRubrik Penilaian:\n1. Konstruksi Hipotesis (20%)\n2. Validitas Instrumen Data (30%)\n3. Ketajaman Analisis Kesimpulan (50%)`;

        return { instAwal: soalAwal, formAspek: ASPEK_MURID_MAP[indikator], formLegend: legend, instSumatif: soalSumatif };
    },

    generateTroubleshooting: (topik) => [
        { masalah: `Abstraksi konsep ${topik} sulit dicerna`, penyebab: "Minimnya jembatan media visual konkret.", solusi: "Gunakan visualisasi analogi atau simulator peraga." },
        { masalah: `Siswa menemui jalan buntu saat pengerjaan tugas ${topik}`, penyebab: "Instruksi terlalu makro / defisit literasi awal.", solusi: "Terapkan scaffolding: urai tugas menjadi sub-bagian kecil." },
        { masalah: "Dinamika internal kelompok macet", penyebab: "Sentralisasi peran atau ada anggota yang pasif.", solusi: "Tegaskan pembagian jobdesk spesifik (Notulis, Ketua, Presenter)." }
    ]
};
