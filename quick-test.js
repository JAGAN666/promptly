// Quick Console Test Script
// Copy and paste this entire script into Chrome DevTools Console (F12)
// Replace YOUR_KEY with your actual API key

const API_KEY = 'AIzaSyBojD4fUbn4BqDX0bc5HUYyY93DfjHIbEU';

async function findWorkingModels() {
    console.log('🔍 Finding working models for your API key...\n');

    // First, list all available models
    try {
        const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const listData = await listResponse.json();

        if (listData.models) {
            console.log('📋 Available models from API:');
            listData.models.forEach(model => {
                console.log(`  - ${model.name} (${model.displayName})`);
            });
            console.log('\n');
        }
    } catch (error) {
        console.error('Failed to list models:', error);
    }

    // Test common models
    const modelsToTest = [
        'gemini-1.5-flash-002',
        'gemini-1.5-flash-001',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b-latest',
        'gemini-1.5-flash-8b',
        'gemini-1.5-pro-002',
        'gemini-1.5-pro-001',
        'gemini-1.5-pro-latest',
        'gemini-1.5-pro',
        'gemini-1.0-pro-latest',
        'gemini-1.0-pro',
        'gemini-pro'
    ];

    console.log('🧪 Testing models...\n');
    const workingModels = [];

    for (const model of modelsToTest) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: 'Say hello' }] }],
                    generationConfig: { temperature: 0.1, maxOutputTokens: 50 }
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.candidates && data.candidates[0]) {
                    console.log(`✅ ${model} - WORKING`);
                    workingModels.push(model);
                } else {
                    console.log(`❌ ${model} - No response`);
                }
            } else {
                const error = await response.json();
                console.log(`❌ ${model} - ${error.error?.message || response.status}`);
            }
        } catch (error) {
            console.log(`❌ ${model} - ${error.message}`);
        }
    }

    console.log('\n📊 Summary:');
    console.log('================');
    if (workingModels.length > 0) {
        console.log('✅ WORKING MODELS:');
        workingModels.forEach(model => console.log(`  - ${model}`));
        console.log('\n🎯 Update your config.js PREFERRED_MODELS with these working models!');
        console.log('\nSuggested config:');
        console.log('PREFERRED_MODELS: [');
        workingModels.forEach(model => console.log(`  '${model}',`));
        console.log(']');
    } else {
        console.log('❌ No working models found!');
        console.log('Possible issues:');
        console.log('1. API key might be invalid');
        console.log('2. Generative Language API not enabled');
        console.log('3. Rate limited (wait 1 minute)');
    }
}

// Run the test
findWorkingModels();