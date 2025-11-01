// Promptly Popup Script

let extractedContent = null;
let currentPlatform = null;
let chromeAIAvailable = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  console.log('[Init] Starting Promptly initialization...');

  // Debug: Check if all required functions are loaded
  console.log('[Init] Function availability check:');
  console.log('  - setupAdvancedFeatureListeners:', typeof setupAdvancedFeatureListeners);
  console.log('  - factCheckContent:', typeof factCheckContent);
  console.log('  - analyzeArgumentStrength:', typeof analyzeArgumentStrength);
  console.log('  - crossReferenceMultipleSources:', typeof crossReferenceMultipleSources);

  await loadSettings();
  detectPlatform();
  setupEventListeners();
  await checkForSelectedText();
  await checkChromeAI();

  // Setup advanced feature listeners
  if (typeof setupAdvancedFeatureListeners === 'function') {
    console.log('[Init] Setting up advanced feature listeners...');
    setupAdvancedFeatureListeners();
    console.log('[Init] ✓ Advanced features initialized successfully');
  } else {
    console.error('[Init] ✗ setupAdvancedFeatureListeners not found!');
  }

  console.log('[Init] ✓ Initialization complete');
}

// Check Chrome Built-in AI availability
async function checkChromeAI() {
  try {
    if (typeof checkChromeAIAvailability === 'function') {
      chromeAIAvailable = await checkChromeAIAvailability();
      console.log('[Promptly] Chrome AI Status:', chromeAIAvailable);

      // Show Chrome AI badge if available
      if (chromeAIAvailable.prompt || chromeAIAvailable.summarizer) {
        showChromeAIBadge();
      }
    } else {
      console.log('[Promptly] Chrome AI functions not loaded');
      chromeAIAvailable = { prompt: false, summarizer: false, writer: false, rewriter: false };
    }
  } catch (error) {
    console.error('[Promptly] Chrome AI check error:', error);
    chromeAIAvailable = { prompt: false, summarizer: false, writer: false, rewriter: false };
  }
}

// Show Chrome AI badge in UI
function showChromeAIBadge() {
  const tagline = document.querySelector('.tagline');
  if (tagline) {
    tagline.innerHTML += ' <span style="background: #4ade80; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">⚡ Chrome AI</span>';
  }
}

// Check if popup was opened with selected text
async function checkForSelectedText() {
  try {
    const result = await chrome.storage.local.get(['selectedText', 'timestamp']);

    if (result.selectedText && result.timestamp) {
      // Check if selection is recent (within last 5 seconds)
      const now = Date.now();
      const age = now - result.timestamp;

      if (age < 5000) {
        console.log('[Promptly] Found selected text:', result.selectedText.substring(0, 50) + '...');

        // Create mock extracted content from selected text
        extractedContent = {
          title: 'Selected Text',
          text: result.selectedText,
          author: '',
          platform: 'selection'
        };

        // Update UI to show the selected text
        document.getElementById('preview-text').textContent =
          result.selectedText.length > 200
            ? result.selectedText.substring(0, 200) + '...'
            : result.selectedText;

        // Show the content preview and action buttons
        document.getElementById('content-preview').style.display = 'block';
        document.getElementById('action-buttons').style.display = 'flex';

        // Show advanced features section
        const advancedFeatures = document.getElementById('advanced-features');
        if (advancedFeatures) {
          advancedFeatures.style.display = 'block';
        }

        // Hide the analyze button
        document.querySelector('.analyze-section').style.display = 'none';

        // Clear the stored text
        await chrome.storage.local.remove(['selectedText', 'timestamp']);

        console.log('[Promptly] Ready to analyze selected text');
      } else {
        // Clear old selection
        await chrome.storage.local.remove(['selectedText', 'timestamp']);
      }
    }
  } catch (error) {
    console.error('[Promptly] Error checking for selected text:', error);
  }
}

// Setup all event listeners
function setupEventListeners() {
  document.getElementById('analyze-page-btn').addEventListener('click', analyzeCurrentPage);
  document.getElementById('summarize-btn')?.addEventListener('click', () => generateContent('summarize'));
  document.getElementById('generate-replies-btn')?.addEventListener('click', showReplyOptions);
  document.getElementById('save-api-key').addEventListener('click', saveApiKey);
  document.getElementById('save-search-key')?.addEventListener('click', saveSearchApiKey);
  document.getElementById('save-search-engine-id')?.addEventListener('click', saveSearchEngineId);
  document.getElementById('clear-history').addEventListener('click', clearHistory);
  document.getElementById('settings-toggle')?.addEventListener('click', toggleSettings);

  // Reply style buttons
  document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const style = e.currentTarget.dataset.style;
      generateContent('reply', style);
    });
  });

  // Custom reply button
  document.getElementById('generate-custom-btn')?.addEventListener('click', generateCustomReply);

  // Allow Enter key in custom input to generate reply
  document.getElementById('custom-reply-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      generateCustomReply();
    }
  });
}

// Detect current platform
async function detectPlatform() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url || '';

    if (url.includes('reddit.com')) {
      currentPlatform = 'Reddit';
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      currentPlatform = 'Twitter/X';
    } else if (url.includes('linkedin.com')) {
      currentPlatform = 'LinkedIn';
    } else if (url.includes('news') || url.includes('article')) {
      currentPlatform = 'News';
    } else {
      currentPlatform = 'Web';
    }

    document.getElementById('platform-indicator').textContent = `Platform: ${currentPlatform}`;
  } catch (error) {
    console.error('Platform detection error:', error);
  }
}

// Analyze the current page
async function analyzeCurrentPage() {
  const btn = document.getElementById('analyze-page-btn');
  const loading = document.getElementById('loading');
  const status = document.getElementById('page-status');

  // Show loading
  btn.disabled = true;
  loading.style.display = 'block';
  document.getElementById('loading-text').textContent = 'Extracting page content...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if it's a valid webpage
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      throw new Error('Please open a regular webpage (Reddit, Twitter, news site, etc.)');
    }

    // Inject content extraction script
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractPageContent
    });

    if (results && results[0] && results[0].result) {
      extractedContent = results[0].result;
      displayContentPreview(extractedContent);
      status.textContent = '✅ Content extracted successfully!';
      status.style.color = '#10b981';
    } else {
      throw new Error('No content found on this page');
    }
  } catch (error) {
    console.error('Page analysis error:', error);
    status.textContent = `❌ ${error.message}`;
    status.style.color = '#ef4444';
  } finally {
    btn.disabled = false;
    loading.style.display = 'none';
  }
}

// Content extraction function (injected into page)
function extractPageContent() {
  const url = window.location.href;
  let content = { title: '', text: '', author: '', platform: '' };

  // Reddit extraction
  if (url.includes('reddit.com')) {
    content.platform = 'reddit';

    // Try to find post title
    const titleEl = document.querySelector('h1') ||
                    document.querySelector('[data-testid="post-title"]') ||
                    document.querySelector('.Post h3');
    if (titleEl) content.title = titleEl.textContent.trim();

    // Try to find post content
    const postEl = document.querySelector('[data-testid="post-container"]') ||
                   document.querySelector('.Post') ||
                   document.querySelector('[data-click-id="text"]');
    if (postEl) {
      const textElements = postEl.querySelectorAll('p, div[data-click-id="text"]');
      content.text = Array.from(textElements).map(el => el.textContent).join(' ').trim();
    }

    // If no post content, try to get the selected comment
    if (!content.text) {
      const comments = document.querySelectorAll('[data-testid="comment"]');
      if (comments.length > 0) {
        content.text = comments[0].textContent.trim();
      }
    }
  }
  // Twitter/X extraction
  else if (url.includes('twitter.com') || url.includes('x.com')) {
    content.platform = 'twitter';

    const tweetEl = document.querySelector('article[data-testid="tweet"]');
    if (tweetEl) {
      const textEl = tweetEl.querySelector('[data-testid="tweetText"]');
      if (textEl) content.text = textEl.textContent.trim();

      const authorEl = tweetEl.querySelector('[data-testid="User-Name"]');
      if (authorEl) content.author = authorEl.textContent.trim();
    }
  }
  // LinkedIn extraction
  else if (url.includes('linkedin.com')) {
    content.platform = 'linkedin';

    const postEl = document.querySelector('.feed-shared-update-v2');
    if (postEl) {
      const textEl = postEl.querySelector('.feed-shared-text');
      if (textEl) content.text = textEl.textContent.trim();

      const authorEl = postEl.querySelector('.feed-shared-actor__name');
      if (authorEl) content.author = authorEl.textContent.trim();
    }
  }
  // Generic article extraction
  else {
    content.platform = 'article';

    // Try to find article title
    const titleEl = document.querySelector('h1') ||
                    document.querySelector('article h1') ||
                    document.querySelector('[class*="title"]');
    if (titleEl) content.title = titleEl.textContent.trim();

    // Try to find article content
    const articleEl = document.querySelector('article') ||
                      document.querySelector('main') ||
                      document.querySelector('[role="article"]');
    if (articleEl) {
      const paragraphs = articleEl.querySelectorAll('p');
      content.text = Array.from(paragraphs).map(p => p.textContent).join(' ').trim();
    }
  }

  // Fallback: get selected text if nothing found
  if (!content.text) {
    const selection = window.getSelection().toString().trim();
    if (selection) {
      content.text = selection;
      content.title = 'Selected Text';
    }
  }

  // Final fallback: get first meaningful text on page
  if (!content.text) {
    const bodyText = document.body.innerText;
    if (bodyText) {
      content.text = bodyText.substring(0, 1000); // First 1000 chars
      content.title = 'Page Content';
    }
  }

  return content;
}

// Display content preview
function displayContentPreview(content) {
  const previewDiv = document.getElementById('content-preview');
  const previewText = document.getElementById('preview-text');
  const actionButtons = document.getElementById('action-buttons');
  const advancedFeatures = document.getElementById('advanced-features');

  if (content && content.text) {
    const preview = content.text.substring(0, 200) + (content.text.length > 200 ? '...' : '');
    previewText.textContent = preview;
    previewDiv.style.display = 'block';
    actionButtons.style.display = 'flex';

    // Show advanced features section
    if (advancedFeatures) {
      advancedFeatures.style.display = 'block';
    }
  }
}

// Show reply style options
function showReplyOptions() {
  document.getElementById('reply-options').style.display = 'block';
  document.getElementById('action-buttons').style.display = 'none';
}

// Generate custom reply based on user description
async function generateCustomReply() {
  const customInput = document.getElementById('custom-reply-input');
  const customDescription = customInput.value.trim();

  if (!customDescription) {
    alert('Please describe the reply style you want');
    customInput.focus();
    return;
  }

  if (!extractedContent || !extractedContent.text) {
    alert('Please analyze the page or select text first');
    return;
  }

  // Check API key
  const apiKey = await getApiKey();
  if (!apiKey) {
    alert('Please set your Gemini API key in Settings');
    return;
  }

  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const resultsContent = document.getElementById('results-content');
  const resultsTitle = document.getElementById('results-title');

  // Show loading
  loading.style.display = 'block';
  document.getElementById('reply-options').style.display = 'none';
  document.getElementById('loading-text').textContent = 'Generating custom replies...';
  resultsTitle.textContent = `✨ Custom Replies`;

  try {
    let response;
    let usedChromeAI = false;

    // Try Chrome AI Prompt first
    if (chromeAIAvailable && chromeAIAvailable.prompt && typeof generateRepliesWithChromeAI === 'function') {
      console.log('[Promptly] Trying Chrome AI for custom replies...');
      const chromeResult = await generateRepliesWithChromeAI(extractedContent, null, customDescription);

      if (chromeResult.success) {
        response = chromeResult.text;
        usedChromeAI = true;
        console.log('[Promptly] ✅ Used Chrome AI for custom replies');
      } else {
        console.log('[Promptly] Chrome AI failed, using Gemini fallback');
      }
    }

    // Fallback to Gemini if Chrome AI not available or failed
    if (!usedChromeAI) {
      // Create custom prompt based on user description
      const prompt = `You are helping someone reply to this content:

Title: ${extractedContent.title || 'N/A'}
Content: ${extractedContent.text}

The user wants a reply with this style/approach: "${customDescription}"

Generate exactly 3 different reply options that match the user's request: "${customDescription}".

Each reply should:
- Follow the user's style description closely
- Be appropriate and relevant to the content
- Be ready to post (complete sentences)
- Be distinct from the other options

Format your response as:
1. [First reply]

2. [Second reply]

3. [Third reply]`;

      response = await callGeminiAPI(prompt, apiKey);
    }

    // Display results with source indicator
    resultsContent.innerHTML = formatResults(response, 'reply');
    if (usedChromeAI) {
      resultsContent.innerHTML = `<div style="background: #d1fae5; color: #065f46; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; font-size: 13px; display: flex; align-items: center; gap: 6px;">
        <span>⚡</span>
        <strong>Powered by Chrome Built-in AI</strong>
        <span style="font-size: 11px; opacity: 0.8;">(Fast & Private)</span>
      </div>` + resultsContent.innerHTML;
    }
    results.style.display = 'block';

    // Clear the input
    customInput.value = '';

    // Add copy functionality to buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.target.dataset.text;
        navigator.clipboard.writeText(text);
        e.target.textContent = 'Copied!';
        setTimeout(() => e.target.textContent = 'Copy', 2000);
      });
    });
  } catch (error) {
    console.error('Custom generation error:', error);

    // Show detailed error in results
    resultsContent.innerHTML = `
      <div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px;">
        <strong>❌ Generation Failed</strong><br/>
        ${error.message || 'Unknown error occurred'}
      </div>
    `;
    results.style.display = 'block';
  } finally {
    loading.style.display = 'none';
  }
}

// Generate content (summary or reply)
async function generateContent(type, style = null) {
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const resultsContent = document.getElementById('results-content');
  const resultsTitle = document.getElementById('results-title');

  if (!extractedContent || !extractedContent.text) {
    alert('Please analyze the page first');
    return;
  }

  // Check API key
  const apiKey = await getApiKey();
  if (!apiKey) {
    alert('Please set your Gemini API key in Settings');
    return;
  }

  // Show loading
  loading.style.display = 'block';
  document.getElementById('reply-options').style.display = 'none';

  if (type === 'summarize') {
    document.getElementById('loading-text').textContent = 'Generating summary...';
    resultsTitle.textContent = '📝 Summary';
  } else {
    document.getElementById('loading-text').textContent = `Generating ${style} replies...`;
    resultsTitle.textContent = `💬 ${style.charAt(0).toUpperCase() + style.slice(1)} Replies`;
  }

  try {
    let response;
    let usedChromeAI = false;

    if (type === 'summarize') {
      // Try Chrome AI Summarizer first
      if (chromeAIAvailable && chromeAIAvailable.summarizer && typeof summarizeWithChromeAI === 'function') {
        console.log('[Promptly] Trying Chrome AI Summarizer...');
        const chromeResult = await summarizeWithChromeAI(extractedContent);

        if (chromeResult.success) {
          response = chromeResult.text;
          usedChromeAI = true;
          console.log('[Promptly] ✅ Used Chrome AI Summarizer');
        } else {
          console.log('[Promptly] Chrome AI failed, using Gemini fallback');
        }
      }

      // Fallback to Gemini if Chrome AI not available or failed
      if (!usedChromeAI) {
        const prompt = createPrompt(type, style, extractedContent);
        response = await callGeminiAPI(prompt, apiKey);
      }
    } else {
      // Try Chrome AI Prompt for replies
      if (chromeAIAvailable && chromeAIAvailable.prompt && typeof generateRepliesWithChromeAI === 'function') {
        console.log('[Promptly] Trying Chrome AI Prompt...');
        const chromeResult = await generateRepliesWithChromeAI(extractedContent, style, null);

        if (chromeResult.success) {
          response = chromeResult.text;
          usedChromeAI = true;
          console.log('[Promptly] ✅ Used Chrome AI Prompt');
        } else {
          console.log('[Promptly] Chrome AI failed, using Gemini fallback');
        }
      }

      // Fallback to Gemini if Chrome AI not available or failed
      if (!usedChromeAI) {
        const prompt = createPrompt(type, style, extractedContent);
        response = await callGeminiAPI(prompt, apiKey);
      }
    }

    // Display results with source indicator
    resultsContent.innerHTML = formatResults(response, type);
    if (usedChromeAI) {
      resultsContent.innerHTML = `<div style="background: #d1fae5; color: #065f46; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; font-size: 13px; display: flex; align-items: center; gap: 6px;">
        <span>⚡</span>
        <strong>Powered by Chrome Built-in AI</strong>
        <span style="font-size: 11px; opacity: 0.8;">(Fast & Private)</span>
      </div>` + resultsContent.innerHTML;
    }
    results.style.display = 'block';

    // Add copy functionality to buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.target.dataset.text;
        navigator.clipboard.writeText(text);
        e.target.textContent = 'Copied!';
        setTimeout(() => e.target.textContent = 'Copy', 2000);
      });
    });
  } catch (error) {
    console.error('Generation error:', error);

    // Show detailed error in results instead of alert
    resultsContent.innerHTML = `
      <div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px;">
        <h4>❌ Generation Failed</h4>
        <p style="margin: 10px 0;"><strong>Error:</strong> ${error.message}</p>
        <div style="margin-top: 15px; font-size: 13px;">
          <strong>Troubleshooting:</strong>
          <ol style="margin: 10px 0 0 20px;">
            <li>Open test-api.html to test your API key</li>
            <li>Check Console (F12) for detailed error messages</li>
            <li>Verify API key is saved in Settings below</li>
            <li>Try reloading the extension (chrome://extensions)</li>
          </ol>
        </div>
      </div>
    `;
    results.style.display = 'block';
  } finally {
    loading.style.display = 'none';
  }
}

// Create AI prompt based on type
function createPrompt(type, style, content) {
  const contentText = content.title ?
    `Title: ${content.title}\n\nContent: ${content.text}` :
    content.text;

  if (type === 'summarize') {
    return `Summarize this ${content.platform || 'content'} in 2-3 clear, concise sentences:

${contentText}

Provide a brief, informative summary.`;
  }

  // Reply generation
  const stylePrompts = {
    supportive: `Generate 3 supportive and encouraging replies to this post. Be positive, empathetic, and constructive:`,
    questions: `Generate 3 thoughtful questions about this post. Ask for clarification, deeper insights, or related experiences:`,
    counter: `Generate 3 respectful counter-arguments or alternative perspectives to this post. Be constructive and logical:`,
    professional: `Generate 3 professional, formal responses to this post. Use appropriate business language:`
  };

  return `${stylePrompts[style]}

${contentText}

Generate exactly 3 different reply options, each 1-3 sentences long.
Format as:
1. [First reply]
2. [Second reply]
3. [Third reply]`;
}

// Call Gemini API
async function callGeminiAPI(prompt, apiKey) {
  // Use models from config if available, otherwise use defaults
  const models = (typeof CONFIG !== 'undefined' && CONFIG.PREFERRED_MODELS) ?
    CONFIG.PREFERRED_MODELS : [
      'gemini-2.0-flash-exp'       // Only working model (tested Oct 31, 2025)
    ];

  const temperature = CONFIG?.API_TEMPERATURE || 0.7;
  const maxOutputTokens = CONFIG?.MAX_OUTPUT_TOKENS || 1024;

  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Attempting with model: ${model}`);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: temperature,
            maxOutputTokens: maxOutputTokens
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        console.error(`Model ${model} failed: ${errorMessage}`);
        lastError = new Error(`${model}: ${errorMessage}`);
        continue; // Try next model
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error(`Model ${model}: Invalid response structure`);
        lastError = new Error(`${model}: Invalid response structure`);
        continue;
      }

      console.log(`Success with model: ${model}`);
      return data.candidates[0].content.parts[0].text;

    } catch (error) {
      console.error(`Error with ${model}:`, error);
      lastError = error;
      continue; // Try next model
    }
  }

  // If all models failed, throw detailed error
  throw new Error(`All models failed. Last error: ${lastError?.message}\n\nTroubleshooting:\n1. Open test-api.html to check which models work\n2. Verify API key is correct\n3. Check if Generative Language API is enabled`);
}

// Format results for display
function formatResults(text, type) {
  if (type === 'summarize') {
    return `
      <div class="summary-result">
        <p>${text}</p>
        <button class="copy-btn" data-text="${text.replace(/"/g, '&quot;')}">Copy</button>
      </div>
    `;
  }

  // Format replies
  const replies = text.split(/\d+\.\s+/).filter(r => r.trim());
  return replies.map((reply, i) => `
    <div class="reply-result">
      <div class="reply-number">${i + 1}</div>
      <p>${reply.trim()}</p>
      <button class="copy-btn" data-text="${reply.trim().replace(/"/g, '&quot;')}">Copy</button>
    </div>
  `).join('');
}

// Load settings from storage
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get(['geminiApiKey', 'googleSearchApiKey', 'googleSearchEngineId']);
    if (result.geminiApiKey) {
      document.getElementById('api-key-input').value = result.geminiApiKey;
    }
    if (result.googleSearchApiKey) {
      document.getElementById('google-search-key-input').value = result.googleSearchApiKey;
    }
    if (result.googleSearchEngineId) {
      document.getElementById('search-engine-id-input').value = result.googleSearchEngineId;
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

// Get API key from storage or config
async function getApiKey() {
  // First check if we should use hardcoded key from config
  if (typeof CONFIG !== 'undefined' && CONFIG.USE_HARDCODED_KEY && CONFIG.GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
    if (CONFIG.DEBUG_MODE) {
      console.log('Using API key from config.js');
    }
    return CONFIG.GEMINI_API_KEY;
  }

  // Otherwise get from Chrome storage
  const result = await chrome.storage.local.get(['geminiApiKey']);
  if (CONFIG?.DEBUG_MODE) {
    console.log('Using API key from Chrome storage');
  }
  return result.geminiApiKey;
}

// Save API key
async function saveApiKey() {
  const input = document.getElementById('api-key-input');
  const btn = document.getElementById('save-api-key');
  const apiKey = input.value.trim();

  if (!apiKey) {
    alert('Please enter an API key');
    return;
  }

  try {
    await chrome.storage.local.set({ geminiApiKey: apiKey });
    btn.textContent = 'Saved!';
    btn.classList.add('saved');

    setTimeout(() => {
      btn.textContent = 'Save';
      btn.classList.remove('saved');
    }, 2000);
  } catch (error) {
    console.error('Failed to save API key:', error);
    alert('Failed to save API key');
  }
}

// Save Google Search API Key
async function saveSearchApiKey() {
  const input = document.getElementById('google-search-key-input');
  const btn = document.getElementById('save-search-key');
  const apiKey = input.value.trim();

  if (!apiKey) {
    alert('Please enter a Google Search API key');
    return;
  }

  try {
    await chrome.storage.local.set({ googleSearchApiKey: apiKey });
    btn.textContent = 'Saved!';
    btn.classList.add('saved');

    setTimeout(() => {
      btn.textContent = 'Save';
      btn.classList.remove('saved');
    }, 2000);
  } catch (error) {
    console.error('Failed to save Google Search API key:', error);
    alert('Failed to save API key');
  }
}

// Save Search Engine ID
async function saveSearchEngineId() {
  const input = document.getElementById('search-engine-id-input');
  const btn = document.getElementById('save-search-engine-id');
  const engineId = input.value.trim();

  if (!engineId) {
    alert('Please enter a Search Engine ID');
    return;
  }

  try {
    await chrome.storage.local.set({ googleSearchEngineId: engineId });
    btn.textContent = 'Saved!';
    btn.classList.add('saved');

    setTimeout(() => {
      btn.textContent = 'Save';
      btn.classList.remove('saved');
    }, 2000);
  } catch (error) {
    console.error('Failed to save Search Engine ID:', error);
    alert('Failed to save ID');
  }
}

// Toggle settings visibility
function toggleSettings(e) {
  e.preventDefault();
  const settingsSection = document.getElementById('settings-section');
  const toggleBtn = document.getElementById('settings-toggle');

  if (settingsSection.style.display === 'none') {
    // Show settings
    settingsSection.style.display = 'block';
    setTimeout(() => settingsSection.classList.add('show'), 10);
    toggleBtn.textContent = '✕ Close Settings';
  } else {
    // Hide settings
    settingsSection.classList.remove('show');
    setTimeout(() => settingsSection.style.display = 'none', 300);
    toggleBtn.textContent = '⚙️ Settings';
  }
}

// Clear history
async function clearHistory() {
  if (confirm('Clear all history?')) {
    await chrome.storage.local.remove(['history']);
    alert('History cleared');
  }
}