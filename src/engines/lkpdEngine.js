// --- LKPD GENERATOR ENGINE (STANDALONE MODULE) ---

/**
 * Generates a structured 5-part student worksheet data object.
 * 
 * @param {Object} payload - Input planning metadata and activities.
 * @returns {Object} Structured LKPD object.
 */
export function generateLKPD(payload = {}) {
    const topic = payload.topic || "Proyek STEM";
    const subject = payload.subject || "Sains/Matematika";
    const grade = payload.grade || "Umum";
    const duration = payload.duration || "2 JP";

    const orientasiMasalah = `Melalui proyek STEM ini, kita akan menyelidiki fenomena nyata terkait ${topic}. Lakukan riset dan analisis konsep sains serta hitunglah parameter kuantitatif yang relevan untuk merancang solusi/purwarupa terbaik.`;

    const kegiatanInti = {
        ask: `Tuliskan permasalahan utama yang perlu dipecahkan terkait ${topic}. Apa saja kriteria purwarupa yang sukses dan batasan (constraints) bahan/alat yang harus dipatuhi?`,
        imaginePlan: `Gambarkan sketsa blueprint awal purwarupa Anda. Cantumkan dimensi fisik (panjang, lebar, tinggi) dan keterangan bahan yang akan digunakan secara rinci.`,
        create: `Bangunlah purwarupa tersebut secara berkelompok. Tuliskan langkah-langkah perakitan dan kendala yang dihadapi saat proses pembuatan.`,
        testImprove: `Lakukan uji coba sebanyak 3 kali. Catat hasil pengukuran dalam tabel yang disediakan, analisis kegagalan, dan tuliskan tindakan perbaikan yang Anda lakukan.`,
        communicate: `Presentasikan hasil karya dan data uji coba kelompok Anda. Catat saran dan tanggapan berharga dari guru dan kelompok lain.`
    };

    const lembarData = {
        deskripsi: "Tabel Pencatatan Data Uji Coba Kuantitatif Purwarupa:",
        tabelPengukuran: [
            { ujiKe: "Uji Coba 1", parameter: "Waktu / Daya / Output", hasil: "....................", catatan: "...................." },
            { ujiKe: "Uji Coba 2", parameter: "Waktu / Daya / Output", hasil: "....................", catatan: "...................." },
            { ujiKe: "Uji Coba 3", parameter: "Waktu / Daya / Output", hasil: "....................", catatan: "...................." }
        ]
    };

    const refleksi = [
        "Bagaimana kontribusi konsep sains yang Anda pelajari membantu dalam merancang solusi ini?",
        "Kalkulasi matematika apa saja yang paling krusial untuk memastikan purwarupa Anda bekerja dengan efisien?",
        "Jika Anda memiliki waktu dan sumber daya tambahan, perbaikan desain apa yang ingin Anda implementasikan?"
    ];

    return {
        identitas: {
            topik: topic,
            mapel: subject,
            kelas: grade,
            alokasiWaktu: duration
        },
        orientasiMasalah,
        kegiatanInti,
        lembarData,
        refleksi
    };
}

/**
 * Renders a structured LKPD object to standard print-ready A4 HTML.
 * 
 * @param {Object} lkpd - The LKPD data object.
 * @returns {string} HTML string.
 */
export function renderLKPDToHTML(lkpd) {
    if (!lkpd) return "";

    return `
        <div class="lkpd-container bg-white text-black p-12 max-w-[210mm] min-h-[297mm] mx-auto shadow-2xl font-sans text-[12.5px] leading-relaxed mt-10 print-container page-break">
            <!-- Header -->
            <div class="text-center border-b-[3px] border-double border-black pb-3 mb-6">
                <h1 class="text-lg font-bold uppercase tracking-wide">LEMBAR KERJA PESERTA DIDIK (LKPD) STEM</h1>
                <h2 class="text-md font-semibold mt-0.5">PENDEKATAN ENGINEERING DESIGN PROCESS (EDP)</h2>
                <p class="text-[10px] font-normal uppercase mt-1">MATA PELAJARAN: ${lkpd.identitas.mapel} | TOPIK: ${lkpd.identitas.topik}</p>
            </div>

            <!-- Identitas -->
            <table class="w-full text-left mb-6 text-[11px] border-none">
                <tbody>
                    <tr>
                        <td class="w-32 font-bold py-0.5">Mata Pelajaran</td><td class="w-4">:</td><td>${lkpd.identitas.mapel}</td>
                        <td class="w-32 font-bold">Fase / Kelas</td><td class="w-4">:</td><td>${lkpd.identitas.kelas}</td>
                    </tr>
                    <tr>
                        <td class="font-bold py-0.5">Topik Projek</td><td>:</td><td class="font-semibold">${lkpd.identitas.topik}</td>
                        <td class="font-bold">Alokasi Waktu</td><td>:</td><td>${lkpd.identitas.alokasiWaktu}</td>
                    </tr>
                    <tr>
                        <td class="font-bold py-0.5">Nama Anggota Kelompok</td><td>:</td><td colspan="4">1. ....................  2. ....................  3. ....................  4. ....................</td>
                    </tr>
                </tbody>
            </table>

            <!-- I. Orientasi Masalah -->
            <div class="mb-6">
                <div class="font-bold bg-slate-100 p-1.5 mb-2 uppercase border border-black text-[12px]">I. ORIENTASI MASALAH (REAL-WORLD PROBLEM)</div>
                <p class="text-justify leading-relaxed">${lkpd.orientasiMasalah}</p>
            </div>

            <!-- II. Kegiatan Inti EDP -->
            <div class="mb-6">
                <div class="font-bold bg-slate-100 p-1.5 mb-2 uppercase border border-black text-[12px]">II. TAHAPAN ENGINEERING DESIGN PROCESS (EDP)</div>
                
                <div class="space-y-4 mt-3">
                    <div class="border border-black p-3 rounded-lg">
                        <div class="font-bold text-slate-800 uppercase text-[11px]">Langkah 1: ASK (Identifikasi Masalah & Batasan)</div>
                        <p class="text-[11.5px] italic text-slate-600 mt-0.5">${lkpd.kegiatanInti.ask}</p>
                        <div class="border-b border-dashed border-slate-400 h-16 mt-2"></div>
                    </div>

                    <div class="border border-black p-3 rounded-lg page-break-inside-avoid">
                        <div class="font-bold text-slate-800 uppercase text-[11px]">Langkah 2: IMAGINE & PLAN (Sketsa Desain & Blueprint)</div>
                        <p class="text-[11.5px] italic text-slate-600 mt-0.5">${lkpd.kegiatanInti.imaginePlan}</p>
                        <div class="border border-dashed border-slate-400 h-44 mt-2 flex items-center justify-center text-slate-400 text-[10px]">
                            [ Area Gambar Sketsa Blueprint Kelompok ]
                        </div>
                    </div>

                    <div class="border border-black p-3 rounded-lg page-break-inside-avoid">
                        <div class="font-bold text-slate-800 uppercase text-[11px]">Langkah 3: CREATE (Pembuatan Purwarupa)</div>
                        <p class="text-[11.5px] italic text-slate-600 mt-0.5">${lkpd.kegiatanInti.create}</p>
                        <div class="border-b border-dashed border-slate-400 h-16 mt-2"></div>
                    </div>

                    <div class="border border-black p-3 rounded-lg page-break-inside-avoid">
                        <div class="font-bold text-slate-800 uppercase text-[11px]">Langkah 4: TEST & IMPROVE (Uji Coba & Perbaikan)</div>
                        <p class="text-[11.5px] italic text-slate-600 mt-0.5">${lkpd.kegiatanInti.testImprove}</p>
                        
                        <div class="mt-3">
                            <span class="font-bold text-[11px] block mb-1">${lkpd.lembarData.deskripsi}</span>
                            <table class="w-full border-collapse border border-black text-[11px] text-center">
                                <thead>
                                    <tr class="bg-slate-100 font-bold">
                                        <th class="border border-black p-1.5 w-24">Tahap</th>
                                        <th class="border border-black p-1.5">Parameter Uji</th>
                                        <th class="border border-black p-1.5 w-40">Hasil Ukur Kuantitatif</th>
                                        <th class="border border-black p-1.5">Catatan/Perbaikan Desain</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${lkpd.lembarData.tabelPengukuran.map(row => `
                                        <tr>
                                            <td class="border border-black p-1.5 font-semibold bg-slate-50">${row.ujiKe}</td>
                                            <td class="border border-black p-1.5 text-left text-slate-500">${row.parameter}</td>
                                            <td class="border border-black p-1.5">${row.hasil}</td>
                                            <td class="border border-black p-1.5">${row.catatan}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="border border-black p-3 rounded-lg page-break-inside-avoid">
                        <div class="font-bold text-slate-800 uppercase text-[11px]">Langkah 5: COMMUNICATE (Presentasi & Feedback)</div>
                        <p class="text-[11.5px] italic text-slate-600 mt-0.5">${lkpd.kegiatanInti.communicate}</p>
                        <div class="border-b border-dashed border-slate-400 h-16 mt-2"></div>
                    </div>
                </div>
            </div>

            <!-- III. Lembar Refleksi -->
            <div class="mb-6 page-break-inside-avoid">
                <div class="font-bold bg-slate-100 p-1.5 mb-2 uppercase border border-black text-[12px]">III. PERTANYAAN REFLEKSI & OPTIMASI (ENGINEERING DECISION)</div>
                <ol class="list-decimal pl-5 space-y-4 mt-2">
                    ${lkpd.refleksi.map(ref => `
                        <li>
                            <span class="font-medium text-[11.5px] text-slate-700">${ref}</span>
                            <div class="border-b border-dashed border-slate-400 h-12 mt-1"></div>
                        </li>
                    `).join('')}
                </ol>
            </div>
        </div>
    `;
}
