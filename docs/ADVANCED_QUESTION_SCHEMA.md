# Advanced Question Type Schema Reference

This document defines the schema design, field descriptions, and structure for the expanded question models supported by **AssessmentHub AI**.

---

## 1. Purpose of the Universal Question Schema

The universal question schema is designed to represent various types of assessment items in a single, unified format. By standardizing diverse question forms (ranging from basic multiple-choice to matching grids and statement tables), the system simplifies data processing, validation, and multi-format exports (e.g., printed A4 documents and Google Form handoffs).

---

## 2. Supported Question Types

The schema officially supports the following question types under the `type` field:

*   `multiple_choice` - Single-response multiple-choice (Pilihan Ganda biasa).
*   `multiple_select` - Multi-response multiple-choice (Pilihan Ganda kompleks).
*   `checkbox` - Multi-select checkbox options.
*   `true_false` - Binary choice (Benar/Salah).
*   `matching` - Association pairs (Menjodohkan).
*   `short_answer` - Fill-in-the-blank text (Isian Singkat).
*   `essay` - Long text response (Uraian).
*   `statement_table` - Grid of statements assessed against columns (e.g., Agree/Disagree, True/False per statement).

---

## 3. Field Dictionary

### Core Fields
*   `questionId` (string, UUID): The unique identifier for the question.
*   `id` (string): Backward-compatible alias ID.
*   `number` (integer): Order of the question within the assessment.
*   `type` (string): The item format category.
*   `stimulus` (string): Context, reading passages, charts, or tables preceding the question stem.
*   `questionText` (string): The main stem or question prompt.
*   `score` (number): Maximum credit/points allocated to the item.
*   `explanation` (string): Pedagogical explanation of the solution.

### Answer & Option Structures
*   `options` (array/object): Options for multiple-choice style questions. Contains key-value options or an array of objects containing `{ key, text, isCorrect }`.
*   `statements` (array of strings): List of statements for table-based items.
*   `pairs` (array of objects): Map of matching options `{ key, value }`.
*   `answerKey` (string): Correct answer key for single-select items.
*   `answerKeys` (array of strings): Correct answer keys for multi-select items.
*   `matchingAnswerKey` (array of objects): List of matching pairs `{ leftKey, rightKey }`.
*   `shortAnswerKeys` (array of strings): Acceptable strings for short answer matching.
*   `rubric` (array of strings): Rubric scoring guidelines for essays.

### Quality & Analysis Indicators
*   `cognitiveLevel` (string: `C1`-`C6`): Bloom's Taxonomy cognitive level.
*   `difficultyTarget` (string: `Easy` | `Medium` | `Hard`): Target level of difficulty during question design. This represents the **design intent** (difficulty target) and is not the empirical difficulty index.
*   `predictedDiscrimination` (string: `Low` | `Medium` | `High`): The anticipated discrimination index (daya pembeda) based on cognitive complexity. It represents a predictive estimate and is not measured empirical discrimination.

> [!NOTE]
> Empirical analysis (such as item difficulty index $P$ and discrimination index $D$) is not calculated at this stage. True empirical analysis requires gathering actual student response data after test administration.

---

## 4. Examples for Each Question Type

### A. Multiple Choice (`multiple_choice`)
```json
{
  "questionId": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "number": 1,
  "type": "multiple_choice",
  "questionText": "Hukum I Newton juga sering disebut sebagai hukum...",
  "options": [
    { "key": "A", "text": "Kelembaman (Inersia)", "isCorrect": true },
    { "key": "B", "text": "Aksi-Reaksi", "isCorrect": false },
    { "key": "C", "text": "Percepatan", "isCorrect": false },
    { "key": "D", "text": "Gaya Gesek", "isCorrect": false }
  ],
  "answerKey": "A",
  "score": 1,
  "cognitiveLevel": "C1",
  "difficultyTarget": "Easy",
  "predictedDiscrimination": "Medium"
}
```

### B. Multiple Select (`multiple_select`)
```json
{
  "questionId": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
  "number": 2,
  "type": "multiple_select",
  "questionText": "Pilihlah peristiwa yang menunjukkan berlakunya Hukum Newton III! (Pilih semua yang sesuai)",
  "options": [
    { "key": "A", "text": "Tangan terasa sakit saat memukul meja.", "isCorrect": true },
    { "key": "B", "text": "Pendayung mendorong air ke belakang agar perahu bergerak ke depan.", "isCorrect": true },
    { "key": "C", "text": "Penumpang terdorong ke depan saat bus direm mendadak.", "isCorrect": false }
  ],
  "answerKeys": ["A", "B"],
  "score": 2,
  "cognitiveLevel": "C4",
  "difficultyTarget": "Medium",
  "predictedDiscrimination": "High"
}
```

### C. True/False (`true_false`)
```json
{
  "questionId": "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
  "number": 3,
  "type": "true_false",
  "questionText": "Gaya gesek kinetik selalu lebih besar daripada gaya gesek statis maksimum untuk dua permukaan yang sama.",
  "options": [
    { "key": "Benar", "text": "Benar", "isCorrect": false },
    { "key": "Salah", "text": "Salah", "isCorrect": true }
  ],
  "answerKey": "Salah",
  "score": 1,
  "cognitiveLevel": "C2",
  "difficultyTarget": "Medium",
  "predictedDiscrimination": "Medium"
}
```

### D. Matching (`matching`)
```json
{
  "questionId": "4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
  "number": 4,
  "type": "matching",
  "questionText": "Pasangkanlah pernyataan hukum fisika berikut dengan ilmuwan penemunya!",
  "pairs": [
    { "key": "Hukum Kelembaman", "value": "Isaac Newton" },
    { "key": "Hukum Archimedes", "value": "Archimedes" },
    { "key": "Hukum Relativitas", "value": "Albert Einstein" }
  ],
  "matchingAnswerKey": [
    { "leftKey": "Hukum Kelembaman", "rightKey": "Isaac Newton" },
    { "leftKey": "Hukum Archimedes", "rightKey": "Archimedes" },
    { "leftKey": "Hukum Relativitas", "rightKey": "Albert Einstein" }
  ],
  "score": 3,
  "cognitiveLevel": "C2",
  "difficultyTarget": "Medium",
  "predictedDiscrimination": "Medium"
}
```

### E. Short Answer (`short_answer`)
```json
{
  "questionId": "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
  "number": 5,
  "type": "short_answer",
  "questionText": "Alat yang digunakan untuk mengukur besar gaya adalah...",
  "shortAnswerKeys": ["dinamometer", "neraca pegas"],
  "score": 1,
  "cognitiveLevel": "C1",
  "difficultyTarget": "Easy",
  "predictedDiscrimination": "Low"
}
```

### F. Essay (`essay`)
```json
{
  "questionId": "6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c",
  "number": 6,
  "type": "essay",
  "questionText": "Jelaskan mengapa rem hidrolik mobil memanfaatkan hukum Pascal!",
  "rubric": [
    "Menyebutkan prinsip penyebaran tekanan zat cair ke segala arah (Skor 2)",
    "Menjelaskan hubungan gaya masukan kecil menghasilkan gaya keluaran besar (Skor 3)"
  ],
  "score": 5,
  "cognitiveLevel": "C5",
  "difficultyTarget": "Hard",
  "predictedDiscrimination": "High"
}
```

### G. Statement Table (`statement_table`)
```json
{
  "questionId": "7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
  "number": 7,
  "type": "statement_table",
  "questionText": "Tentukan kebenaran dari masing-masing pernyataan tentang usaha fisika berikut!",
  "statements": [
    "Usaha bernilai nol jika gaya tehap lurus dengan perpindahan.",
    "Usaha bernilai negatif jika arah gaya searah dengan perpindahan.",
    "Usaha diukur dalam satuan Joule."
  ],
  "options": [
    { "key": "Benar", "text": "Benar" },
    { "key": "Salah", "text": "Salah" }
  ],
  "answerKeys": ["Benar", "Salah", "Benar"],
  "score": 3,
  "cognitiveLevel": "C3",
  "difficultyTarget": "Medium",
  "predictedDiscrimination": "Medium"
}
```

---

## 5. Illustration Metadata

The `illustration` object describes auxiliary visual assets intended to be associated with the question:
*   `mode` (string): `none` (no image), `prompt_only` (generate an image using AI via the prompt), or `image_url` (static path).
*   `type` (string): The stylistic category (`diagram` | `scene` | `table` | `chart` | `photo_style` | `icon`).
*   `prompt` (string): Text query to generate the illustration.
*   `imageUrl` (string): Direct path/URL to the asset.
*   `altText` (string): Screen reader description.

---

## 6. Card Metadata (Kartu Soal)

The `cardMetadata` object holds structural elements required by school/district curriculum archives:
*   `learningObjective` (string): The specific Tujuan Pembelajaran (TP).
*   `questionForm` (string): Form category (e.g., Pilihan Ganda, Uraian).
*   `scoringGuide` (string): Quick teacher marking instruction.

---

## 7. Current Boundaries and Roadmap

The schema acts as data-model preparation:
*   **No Active AI Image Generation:** The `illustration.prompt` field is prepared, but no background generator connects to DALL-E/Midjourney yet.
*   **No Empirical Item Metrics:** All stats (`difficultyTarget`, `predictedDiscrimination`) are design estimates. Real performance values will be computed when response datasets are fed back into the system.
*   **No Direct Google Form Generation:** Items are exported in the blueprint formats, but Google Forms are not directly instantiated yet.
