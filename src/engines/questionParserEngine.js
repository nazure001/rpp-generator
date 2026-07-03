// --- QUESTION PARSER ENGINE (STANDALONE MODULE) ---

/**
 * Parses raw text containing multiple-choice questions into an array of structured question objects.
 * 
 * @param {string} rawText - The raw string input containing question blocks.
 * @param {Object} [options={}] - Additional parsing options.
 * @returns {Array<Object>} Array of parsed question objects.
 */
export function parseQuestionsFromText(rawText, options = {}) {
    if (!rawText || typeof rawText !== 'string') {
        return [];
    }

    // Normalize line endings to LF (\n) and trim outer whitespace
    const normalizedText = rawText.replace(/\r\n/g, '\n').trim();
    if (!normalizedText) return [];

    // Regex to find start of question blocks: line starting with digit(s) followed by . or ) and whitespace
    const blockRegex = /(?:^|\n)(?=\d+[\.\)]\s+)/;
    const rawBlocks = normalizedText.split(blockRegex).map(b => b.trim()).filter(Boolean);

    const parsedQuestions = [];

    rawBlocks.forEach((block, idx) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return;

        let number = idx + 1;
        const firstLine = lines[0];
        const numMatch = firstLine.match(/^(\d+)[\.\)]\s*(.*)/);
        
        let preOptionLines = [];
        if (numMatch) {
            number = parseInt(numMatch[1], 10);
            if (numMatch[2]) {
                preOptionLines.push(numMatch[2]);
            }
        } else {
            preOptionLines.push(firstLine);
        }

        const optionsList = [];
        let correctAnswer = "";
        let indicator = "";
        let cognitiveLevel = "";
        let topic = "";

        let currentSection = "pre"; // "pre", "option", "meta"
        let currentOptionIndex = -1;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];

            // Check metadata: Kunci Jawaban
            const keyMatch = line.match(/^(?:Kunci(?: Jawaban)?|Jawaban)\s*:\s*(.*)/i);
            if (keyMatch) {
                const rawKey = keyMatch[1].trim();
                const letterMatch = rawKey.match(/^([A-E])(?:\.|\)|\s|$)/i);
                if (letterMatch) {
                    correctAnswer = letterMatch[1].toUpperCase();
                } else {
                    correctAnswer = rawKey.toUpperCase();
                }
                currentSection = "meta";
                continue;
            }

            // Check metadata: Indikator
            const indMatch = line.match(/^Indikator(?: Soal)?\s*:\s*(.*)/i);
            if (indMatch) {
                indicator = indMatch[1].trim();
                currentSection = "meta";
                continue;
            }

            // Check metadata: Level Kognitif / Bloom
            const levelMatch = line.match(/^(?:Level(?: Kognitif)?|Bloom|Ranah)\s*:\s*(.*)/i);
            if (levelMatch) {
                cognitiveLevel = levelMatch[1].trim();
                currentSection = "meta";
                continue;
            }

            // Check metadata: Materi / Topik
            const topicMatch = line.match(/^(?:Materi|Topik|Lingkup Materi)\s*:\s*(.*)/i);
            if (topicMatch) {
                topic = topicMatch[1].trim();
                currentSection = "meta";
                continue;
            }

            // Check option line (e.g., "A. Option text" or "A) Option text")
            const optMatch = line.match(/^([A-Ea-e])[\.\)]\s+(.*)/);
            if (optMatch) {
                currentSection = "option";
                optionsList.push({
                    label: optMatch[1].toUpperCase(),
                    text: optMatch[2].trim()
                });
                currentOptionIndex = optionsList.length - 1;
                continue;
            }

            // Continuation lines
            if (currentSection === "option" && currentOptionIndex >= 0) {
                optionsList[currentOptionIndex].text += " " + line;
            } else if (currentSection === "pre") {
                preOptionLines.push(line);
            }
        }

        // Separate stimulus and questionText from preOptionLines
        let stimulus = "";
        let questionText = "";

        if (preOptionLines.length === 1) {
            questionText = preOptionLines[0];
        } else if (preOptionLines.length > 1) {
            questionText = preOptionLines[preOptionLines.length - 1];
            stimulus = preOptionLines.slice(0, preOptionLines.length - 1).join('\n');
        }

        parsedQuestions.push({
            number,
            stimulus,
            questionText,
            options: optionsList,
            correctAnswer,
            indicator,
            cognitiveLevel,
            topic,
            type: "multiple_choice",
            rawBlock: block,
            validationStatus: "NEEDS_VALIDATION"
        });
    });

    return parsedQuestions;
}
