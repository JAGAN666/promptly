// AI Comparison Mode - Side-by-side Chrome AI vs Gemini comparison
// Showcases the value of Chrome Built-in AI

/**
 * Generate replies using BOTH Chrome AI and Gemini for comparison
 */
async function generateComparisonReplies(content, style, customDescription, apiKey) {
  const results = {
    chromeAI: null,
    gemini: null,
    timing: {
      chromeAI: 0,
      gemini: 0
    },
    winner: null
  };

  // Try both in parallel
  const startTime = Date.now();

  try {
    // Chrome AI attempt
    if (typeof generateRepliesWithChromeAI === 'function') {
      const chromeStart = Date.now();
      const chromeResult = await generateRepliesWithChromeAI(content, style, customDescription);

      if (chromeResult.success) {
        results.chromeAI = {
          text: chromeResult.text,
          success: true
        };
        results.timing.chromeAI = Date.now() - chromeStart;
      } else {
        results.chromeAI = {
          text: 'Chrome AI not available',
          success: false,
          error: chromeResult.error
        };
      }
    } else {
      results.chromeAI = {
        text: 'Chrome AI not available',
        success: false
      };
    }
  } catch (error) {
    results.chromeAI = {
      text: 'Chrome AI error: ' + error.message,
      success: false
    };
  }

  try {
    // Gemini attempt
    const geminiStart = Date.now();
    let prompt;

    if (customDescription) {
      prompt = `Generate 3 different reply options to this content with the following style: "${customDescription}"

Content:
${content.text}

Each reply should match the requested style. Format as:
1. [Reply one]
2. [Reply two]
3. [Reply three]`;
    } else {
      const stylePrompts = {
        supportive: 'Generate 3 supportive, encouraging replies',
        questions: 'Generate 3 replies with thoughtful questions',
        counter: 'Generate 3 respectful counter-argument replies',
        professional: 'Generate 3 formal, professional replies'
      };

      prompt = `${stylePrompts[style] || stylePrompts.professional}

Content:
${content.text}

Format as:
1. [Reply one]
2. [Reply two]
3. [Reply three]`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0]) {
      results.gemini = {
        text: data.candidates[0].content.parts[0].text,
        success: true
      };
      results.timing.gemini = Date.now() - geminiStart;
    }
  } catch (error) {
    results.gemini = {
      text: 'Gemini error: ' + error.message,
      success: false
    };
  }

  // Determine winner (if both succeeded)
  if (results.chromeAI?.success && results.gemini?.success) {
    // Chrome AI wins if significantly faster (>2x)
    if (results.timing.chromeAI < results.timing.gemini / 2) {
      results.winner = 'chromeAI';
      results.reason = 'Significantly faster';
    } else if (results.timing.chromeAI < results.timing.gemini) {
      results.winner = 'chromeAI';
      results.reason = 'Faster response time';
    } else {
      results.winner = 'tie';
      results.reason = 'Both performed well';
    }
  } else if (results.chromeAI?.success) {
    results.winner = 'chromeAI';
    results.reason = 'Only available AI';
  } else if (results.gemini?.success) {
    results.winner = 'gemini';
    results.reason = 'Only available AI';
  }

  return results;
}

/**
 * Format comparison results for display
 */
function formatComparisonDisplay(results) {
  const chromeAvailable = results.chromeAI?.success;
  const geminiAvailable = results.gemini?.success;

  let html = '<div class="ai-comparison-container">';

  // Header
  html += '<div class="comparison-header">';
  html += '<h3>⚡ AI Comparison Mode</h3>';
  html += '<p class="comparison-subtitle">Side-by-side: Chrome Built-in AI vs Gemini</p>';
  html += '</div>';

  // Comparison grid
  html += '<div class="comparison-grid">';

  // Chrome AI column
  html += '<div class="ai-column chrome-ai-column">';
  html += '<div class="ai-header">';
  html += '<span class="ai-icon">⚡</span>';
  html += '<span class="ai-name">Chrome Built-in AI</span>';
  if (chromeAvailable) {
    html += `<span class="ai-time">${results.timing.chromeAI}ms</span>`;
  }
  html += '</div>';

  if (chromeAvailable) {
    html += '<div class="ai-content success">';
    html += formatReplies(results.chromeAI.text, 'chromeAI');
    html += '</div>';
  } else {
    html += '<div class="ai-content unavailable">';
    html += '<p>❌ Not Available</p>';
    html += '<p class="ai-error">' + (results.chromeAI?.error || 'Chrome AI APIs require Chrome Canary/Dev') + '</p>';
    html += '</div>';
  }

  // Winner badge for Chrome AI
  if (results.winner === 'chromeAI') {
    html += `<div class="winner-badge">🏆 Winner - ${results.reason}</div>`;
  }

  html += '</div>'; // end chrome column

  // Gemini column
  html += '<div class="ai-column gemini-column">';
  html += '<div class="ai-header">';
  html += '<span class="ai-icon">🔷</span>';
  html += '<span class="ai-name">Gemini API</span>';
  if (geminiAvailable) {
    html += `<span class="ai-time">${results.timing.gemini}ms</span>`;
  }
  html += '</div>';

  if (geminiAvailable) {
    html += '<div class="ai-content success">';
    html += formatReplies(results.gemini.text, 'gemini');
    html += '</div>';
  } else {
    html += '<div class="ai-content unavailable">';
    html += '<p>❌ Error</p>';
    html += '<p class="ai-error">' + (results.gemini?.error || 'Failed to connect') + '</p>';
    html += '</div>';
  }

  // Winner badge for Gemini
  if (results.winner === 'gemini') {
    html += `<div class="winner-badge">🏆 Winner - ${results.reason}</div>`;
  }

  html += '</div>'; // end gemini column

  html += '</div>'; // end grid

  // Insights
  html += '<div class="comparison-insights">';
  html += '<h4>💡 Insights:</h4>';
  html += '<ul>';

  if (chromeAvailable) {
    html += '<li>✅ Chrome AI: Fast, private, offline-capable</li>';
    html += `<li>⚡ Response time: ${results.timing.chromeAI}ms</li>`;
  } else {
    html += '<li>⚠️ Chrome AI not available - requires Chrome Canary/Dev with AI features enabled</li>';
  }

  if (geminiAvailable) {
    html += `<li>🔷 Gemini: Reliable fallback (${results.timing.gemini}ms)</li>`;
  }

  if (chromeAvailable && geminiAvailable) {
    const speedup = Math.round((results.timing.gemini / results.timing.chromeAI) * 10) / 10;
    if (speedup > 1) {
      html += `<li>🚀 Chrome AI was ${speedup}x faster!</li>`;
    }
  }

  html += '</ul>';
  html += '</div>';

  html += '</div>'; // end container

  return html;
}

/**
 * Format replies for display
 */
function formatReplies(text, source) {
  const lines = text.split('\n').filter(line => line.trim());
  let html = '<div class="reply-options">';

  lines.forEach((line, idx) => {
    if (line.match(/^\d+\./)) {
      const replyText = line.replace(/^\d+\.\s*/, '').trim();
      html += `<div class="reply-option">
        <div class="reply-text">${replyText}</div>
        <button class="copy-btn" data-text="${replyText.replace(/"/g, '&quot;')}">Copy</button>
      </div>`;
    }
  });

  html += '</div>';
  return html;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateComparisonReplies,
    formatComparisonDisplay
  };
}