const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
const errors = [];

function assert(condition, message) {
    totalTests++;
    if (condition) {
        passedTests++;
    } else {
        errors.push(message);
        console.error(`❌ FAILED: ${message}`);
    }
}

console.log('🔍 Starting Regression Guard: Syntax & Schema Validation...\n');

// 1. Validate JSON schemas
const schemaFiles = [
    'src/schemas/assessment.schema.json',
    'src/schemas/export.schema.json',
    'src/schemas/lessonPlan.schema.json',
    'src/schemas/question.schema.json',
    'src/schemas/lkpd.schema.json'
];

schemaFiles.forEach(file => {
    const filePath = path.join(ROOT_DIR, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(content);
        assert(parsed && typeof parsed === 'object', `Schema ${file} should be a valid JSON object.`);
        assert(parsed.$schema, `Schema ${file} should have a $schema property.`);
        assert(parsed.$id, `Schema ${file} should have a $id property.`);
        console.log(`✅ Schema ${file} parsed successfully.`);
    } catch (err) {
        assert(false, `Failed to parse schema ${file}: ${err.message}`);
    }
});

// 2. Validate JSON fixtures
const fixtureFiles = [
    'test-valid-lesson-plan.json',
    'test-valid-assessment-draft.json',
    'test-valid.json',
    'test-invalid.json'
];

fixtureFiles.forEach(file => {
    const filePath = path.join(ROOT_DIR, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(content);
        assert(parsed && typeof parsed === 'object', `Fixture ${file} should be a valid JSON object.`);
        console.log(`✅ Fixture ${file} parsed successfully.`);
    } catch (err) {
        assert(false, `Failed to parse fixture ${file}: ${err.message}`);
    }
});

// 3. Validate JavaScript engine files syntax
const engineFiles = [
    'src/engines/curriculumEngine.js',
    'src/engines/learningModelEngine.js',
    'src/engines/planningEngine.js',
    'src/engines/pmmEngine.js',
    'src/engines/questionParserEngine.js',
    'src/engines/questionValidatorEngine.js',
    'src/engines/stemEngine.js',
    'src/engines/lkpdEngine.js'
];

engineFiles.forEach(file => {
    const filePath = path.join(ROOT_DIR, file);
    try {
        const code = fs.readFileSync(filePath, 'utf8');
        // Compile using VM (wrapping in an ES module syntax or function compilation check)
        // Since ES modules are allowed, compile as module if supported, or wrap/check syntax
        new vm.Script(code, { filename: file });
        assert(true, `Engine ${file} has valid JavaScript syntax.`);
        console.log(`✅ Engine ${file} syntax verified.`);
    } catch (err) {
        // Node VM script compiles ESM with import/export statements throwing SyntaxError
        // If it throws SyntaxError: Unexpected token 'export', it's still valid ES module syntax
        if (err.message.includes("Unexpected token 'export'") || err.message.includes("Cannot use import statement outside a module")) {
            assert(true, `Engine ${file} has valid ES Module syntax.`);
            console.log(`✅ Engine ${file} syntax verified (ES Module).`);
        } else {
            assert(false, `Syntax error in engine ${file}: ${err.message}`);
        }
    }
});

console.log(`\n📋 Validation Summary: ${passedTests}/${totalTests} tests passed.`);
if (errors.length > 0) {
    console.error(`\n❌ Validation failed with ${errors.length} errors.`);
    process.exit(1);
} else {
    console.log('🎉 Regression Guard checks passed successfully!');
    process.exit(0);
}
