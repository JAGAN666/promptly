#!/usr/bin/env node

// Test script to identify working Gemini models
const API_KEY = 'AIzaSyBojD4fUbn4BqDX0bc5HUYyY93DfjHIbEU';

const modelsToTest = [
    // Latest models (2024)
    'gemini-1.5-flash-002',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b-latest',
    'gemini-1.5-flash-8b-001',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro-002',
    'gemini-1.5-pro-001',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    // Experimental
    'gemini-2.0-flash-exp',
    'gemini-exp-1121',
    'gemini-exp-1114',
    // Older stable versions
    'gemini-1.0-pro-latest',
    'gemini-1.0-pro-001',
    'gemini-1.0-pro',
    'gemini-pro-latest',
    'gemini-pro'
];

console.log('🔍 Testing Gemini Models with your API key...\n');
console.log('API Key:', API_KEY.substring(0, 10) + '...\n');

async function testModel(model) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: 'Say hello' }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 50
                }
            })
        });

        const data = await response.json();

        if (response.ok && data.candidates && data.candidates[0]) {
            return { success: true, model, response: data.candidates[0].content.parts[0].text.substring(0, 30) };
        } else {
            return { success: false, model, error: data.error?.message || `HTTP ${response.status}` };
        }
    } catch (error) {
        return { success: false, model, error: error.message };
    }
}

async function testAllModels() {
    const workingModels = [];
    const failedModels = [];

    console.log('Testing models...\n');

    for (const model of modelsToTest) {
        const result = await testModel(model);

        if (result.success) {
            console.log(`✅ ${model} - WORKING`);
            console.log(`   Response: "${result.response}..."`);
            workingModels.push(model);
        } else {
            console.log(`❌ ${model} - ${result.error}`);
            failedModels.push({ model, error: result.error });
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));

    if (workingModels.length > 0) {
        console.log('\n✅ WORKING MODELS (' + workingModels.length + '):');
        workingModels.forEach(model => console.log(`  - ${model}`));

        console.log('\n📝 Updated config.js PREFERRED_MODELS array:');
        console.log('\nPREFERRED_MODELS: [');
        workingModels.forEach(model => console.log(`    '${model}',`));
        console.log(']');
    } else {
        console.log('\n❌ No working models found!');
        console.log('\nPossible issues:');
        console.log('1. API key might be invalid');
        console.log('2. Generative Language API not enabled in Google Cloud');
        console.log('3. Rate limited (wait 1 minute and try again)');
        console.log('4. Billing not enabled on the Google Cloud project');
    }

    if (failedModels.length > 0) {
        console.log('\n❌ Failed models (' + failedModels.length + '):');
        const errorGroups = {};
        failedModels.forEach(({ model, error }) => {
            if (!errorGroups[error]) errorGroups[error] = [];
            errorGroups[error].push(model);
        });

        Object.entries(errorGroups).forEach(([error, models]) => {
            console.log(`\n  Error: "${error}"`);
            models.forEach(model => console.log(`    - ${model}`));
        });
    }
}

// Run the test
testAllModels().then(() => {
    console.log('\n✨ Test complete!');
}).catch(error => {
    console.error('Fatal error:', error);
});