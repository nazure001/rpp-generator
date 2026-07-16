// --- STEM ENGINE (STANDALONE MODULE) ---

/**
 * Generates step-by-step STEM and EDP (Engineering Design Process) activities based on topic and context.
 * 
 * @param {string} topic - The learning topic.
 * @param {string} subject - The subject name.
 * @param {string} grade - The grade level.
 * @returns {Object} Structured STEM activities with domains and EDP stages.
 */
export function generateStemActivities(topic = "", subject = "", grade = "") {
    const cleanTopic = topic.trim() || "Proyek STEM";
    
    const scienceConcept = `Penerapan prinsip sains (sifat bahan, mekanika, transfer energi, atau reaksi kimia) yang mendasari fenomena ${cleanTopic}.`;
    const technologyTools = `Pemanfaatan instrumen pengukuran digital, simulator komputer, alat potong/akit, atau perangkat dokumentasi untuk menguji ${cleanTopic}.`;
    const engineeringDesign = `Proses merancang purwarupa (sketsa blueprint), menguji kekuatan struktural, menguji performa purwarupa, dan optimasi efisiensi rancangan.`;
    const mathematicsCalculations = `Kalkulasi dimensi fisik (panjang, volume, berat), pengolahan data pengukuran dalam tabel, perhitungan rata-rata, dan pembuatan grafik performa.`;

    const askDesc = `Mengidentifikasi permasalahan dunia nyata terkait ${cleanTopic}, menetapkan spesifikasi purwarupa (kriteria sukses), dan batasan proyek (constraints) seperti bahan, waktu, dan anggaran.`;
    const imaginePlanDesc = `Melakukan curah gagasan (brainstorming) sketsa desain purwarupa, mendiskusikan kelebihan/kekurangan masing-masing ide desain, lalu menggambar blueprint/sketsa final dengan dimensi terperinci.`;
    const createDesc = `Membangun purwarupa fisik/digital ${cleanTopic} secara berkelompok sesuai sketsa blueprint, memilih bahan yang sesuai dengan kriteria kekuatan dan efisiensi.`;
    const testImproveDesc = `Menguji coba purwarupa menggunakan instrumen pengukur, mencatat data kuantitatif performa ke dalam lembar kerja, mendeteksi kegagalan mekanik/sistem, lalu memodifikasi purwarupa untuk meningkatkan efisiensi.`;
    const communicateDesc = `Mempresentasikan hasil uji coba, memamerkan purwarupa di depan kelas, mendiskusikan justifikasi ilmiah atas revisi desain, serta mengumpulkan umpan balik dari rekan sejawat.`;

    return {
        topic: cleanTopic,
        subject,
        grade,
        domains: {
            science: scienceConcept,
            technology: technologyTools,
            engineering: engineeringDesign,
            mathematics: mathematicsCalculations
        },
        edpStages: {
            ask: askDesc,
            imagine_plan: imaginePlanDesc,
            create: createDesc,
            test_improve: testImproveDesc,
            communicate: communicateDesc
        }
    };
}
