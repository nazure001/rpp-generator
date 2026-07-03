// --- QUESTION VALIDATOR ENGINE (STANDALONE MODULE) ---

/**
 * Validates a single question object against structural and pedagogical rules.
 * 
 * @param {Object} question - The question object to validate.
 * @param {Object} [rules={}] - Custom validation rules/overrides.
 * @returns {Object} { isValid: boolean, errors: Array<string>, warnings: Array<string> }
 */
export function validateQuestion(question = {}, rules = {}) {
    const errors = [];
    const warnings = [];

    if (!question || typeof question !== 'object') {
        return {
            isValid: false,
            errors: ["Question object is null or invalid."],
            warnings: []
        };
    }

    // 1. questionText must not be empty
    const text = question.questionText || question.text || "";
    if (typeof text !== 'string' || !text.trim()) {
        errors.push("questionText must not be empty.");
    }

    // 2. multiple choice must have at least 4 options
    const type = question.type || "multiple_choice";
    const options = question.options || [];
    if (type === "multiple_choice") {
        if (!Array.isArray(options) || options.length < 4) {
            errors.push("multiple_choice question must have at least 4 options.");
        }
    }

    // 3. correct answer must match one of the option labels
    const ans = question.correctAnswer || question.kunci || "";
    if (!ans || typeof ans !== 'string' || !ans.trim()) {
        errors.push("correctAnswer is required and must not be empty.");
    } else if (type === "multiple_choice" && Array.isArray(options) && options.length > 0) {
        const normalizedAns = ans.trim().toUpperCase();
        const optionLabels = options.map(o => (o.label || "").trim().toUpperCase());
        if (!optionLabels.includes(normalizedAns)) {
            errors.push(`correctAnswer '${normalizedAns}' does not match any available option label (${optionLabels.join(", ")}).`);
        }
    }

    // 4. image is required only if rules.requireImage is true
    if (rules.requireImage === true) {
        const img = question.image || question.imageUrl || "";
        if (!img || (typeof img === 'string' && !img.trim())) {
            errors.push("image is required by validation rules but is missing.");
        }
    }

    // 5. indicator should not be empty (Warning)
    const ind = question.indicator || question.indikator || "";
    if (!ind || typeof ind !== 'string' || !ind.trim()) {
        warnings.push("indicator should not be empty.");
    }

    // 6. cognitiveLevel should be one of C1, C2, C3, C4, C5, C6 (Warning)
    const validLevels = ["C1", "C2", "C3", "C4", "C5", "C6"];
    const level = (question.cognitiveLevel || question.level || "").trim().toUpperCase();
    if (!level || !validLevels.includes(level)) {
        warnings.push(`cognitiveLevel should be one of ${validLevels.join(", ")}, got '${level || "empty"}'.`);
    }

    // 7. score should be positive if provided (Warning)
    if (question.score !== undefined && question.score !== null && question.score !== "") {
        const numScore = Number(question.score);
        if (isNaN(numScore) || numScore <= 0) {
            warnings.push("score should be a positive number if provided.");
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Validates an array or set of question objects.
 * 
 * @param {Array<Object>} questions - Array of question objects.
 * @param {Object} [rules={}] - Validation rules to apply.
 * @returns {Object} { total: number, valid: number, invalid: number, warnings: number, items: Array<Object> }
 */
export function validateQuestionSet(questions = [], rules = {}) {
    if (!Array.isArray(questions)) {
        return {
            total: 0,
            valid: 0,
            invalid: 0,
            warnings: 0,
            items: []
        };
    }

    let validCount = 0;
    let invalidCount = 0;
    let totalWarnings = 0;

    const items = questions.map(q => {
        const res = validateQuestion(q, rules);
        if (res.isValid) {
            validCount++;
        } else {
            invalidCount++;
        }
        totalWarnings += res.warnings.length;

        return {
            ...q,
            validationStatus: res.isValid ? "VALID" : "INVALID",
            isValid: res.isValid,
            errors: res.errors,
            warnings: res.warnings
        };
    });

    return {
        total: questions.length,
        valid: validCount,
        invalid: invalidCount,
        warnings: totalWarnings,
        items
    };
}
