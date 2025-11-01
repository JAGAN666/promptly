// Quick API Verification Script
// Run this in Chrome DevTools Console to verify the API is working

const API_KEY = 'AIzaSyBojD4fUbn4BqDX0bc5HUYyY93DfjHIbEU';
const MODEL = 'gemini-2.0-flash-exp';

console.log('🔍 Testing Smart Reply Assistant Configuration...\n');

async function testSmartReply() {
    console.log('API Key:', API_KEY.substring(0, 15) + '...');
    console.log('Model:', MODEL);
    console.log('\n📝 Sending test request...');

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Generate a short supportive reply to this Reddit comment: "I just started learning programming and it's really hard. I feel like giving up."`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 200
                }
            })
        });

        const data = await response.json();

        if (response.ok && data.candidates && data.candidates[0]) {
            console.log('✅ SUCCESS! API is working!\n');
            console.log('📝 Sample Reply Generated:');
            console.log('-------------------');
            console.log(data.candidates[0].content.parts[0].text);
            console.log('-------------------');
            console.log('\n🎉 Your extension is ready to use!');
            console.log('Next steps:');
            console.log('1. Go to chrome://extensions/');
            console.log('2. Click reload on Smart Reply Assistant');
            console.log('3. Test on Reddit!');
            return true;
        } else {
            console.error('❌ API Error:', data.error?.message || 'Unknown error');
            return false;
        }
    } catch (error) {
        console.error('❌ Network Error:', error.message);
        return false;
    }
}

// Run the test
testSmartReply().then(success => {
    if (!success) {
        console.log('\n⚠️ Troubleshooting:');
        console.log('1. Check your internet connection');
        console.log('2. Verify the API key is correct');
        console.log('3. Try again in a minute (rate limit)');
    }
});