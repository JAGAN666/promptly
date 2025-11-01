// Chrome Built-in AI APIs Integration
// For Google Chrome Built-in AI Challenge

/**
 * Chrome AI Availability Checker
 */
async function checkChromeAIAvailability() {
  const availability = {
    prompt: false,
    summarizer: false,
    writer: false,
    rewriter: false
  };

  try {
    // Check Prompt API
    if (window.ai && window.ai.canCreateTextSession) {
      const promptCapability = await window.ai.canCreateTextSession();
      availability.prompt = promptCapability === 'readily';
    }
  } catch (e) {
    console.log('[Chrome AI] Prompt API not available:', e.message);
  }

  try {
    // Check Summarizer API
    if (window.ai && window.ai.summarizer) {
      const summarizerCapability = await window.ai.summarizer.capabilities();
      availability.summarizer = summarizerCapability.available === 'readily';
    }
  } catch (e) {
    console.log('[Chrome AI] Summarizer API not available:', e.message);
  }

  try {
    // Check Writer API
    if (window.ai && window.ai.writer) {
      const writerCapability = await window.ai.writer.capabilities();
      availability.writer = writerCapability.available === 'readily';
    }
  } catch (e) {
    console.log('[Chrome AI] Writer API not available:', e.message);
  }

  try {
    // Check Rewriter API
    if (window.ai && window.ai.rewriter) {
      const rewriterCapability = await window.ai.rewriter.capabilities();
      availability.rewriter = rewriterCapability.available === 'readily';
    }
  } catch (e) {
    console.log('[Chrome AI] Rewriter API not available:', e.message);
  }

  console.log('[Chrome AI] Availability:', availability);
  return availability;
}

/**
 * Chrome Prompt API - Generate Replies
 */
async function generateRepliesWithChromeAI(content, style, customDescription = null) {
  try {
    if (!window.ai || !window.ai.canCreateTextSession) {
      throw new Error('Chrome Prompt API not available');
    }

    const capability = await window.ai.canCreateTextSession();
    if (capability !== 'readily') {
      throw new Error('Chrome Prompt API not ready');
    }

    // Create AI session
    const session = await window.ai.createTextSession({
      temperature: 0.8,
      topK: 3
    });

    // Build prompt based on style or custom description
    let prompt;
    if (customDescription) {
      prompt = `Generate 3 different reply options to this content with the following style: "${customDescription}"

Content:
${content.text}

Each reply should match the requested style closely. Format as:
1. [Reply one]
2. [Reply two]
3. [Reply three]`;
    } else {
      const stylePrompts = {
        supportive: 'Generate 3 supportive, encouraging replies that show agreement and add positive perspective',
        questions: 'Generate 3 replies that ask thoughtful, engaging questions to deepen the discussion',
        counter: 'Generate 3 replies that respectfully present alternative viewpoints or counter-arguments',
        professional: 'Generate 3 formal, professional replies suitable for business or academic contexts'
      };

      prompt = `${stylePrompts[style] || stylePrompts.professional}

Content to reply to:
${content.text}

Format as:
1. [Reply one]
2. [Reply two]
3. [Reply three]`;
    }

    console.log('[Chrome AI] Generating replies with Prompt API...');
    const response = await session.prompt(prompt);

    // Clean up session
    session.destroy();

    return {
      success: true,
      text: response,
      source: 'chrome-ai'
    };

  } catch (error) {
    console.error('[Chrome AI] Prompt API error:', error);
    return {
      success: false,
      error: error.message,
      source: 'chrome-ai'
    };
  }
}

/**
 * Chrome Summarizer API - Summarize Content
 */
async function summarizeWithChromeAI(content) {
  try {
    if (!window.ai || !window.ai.summarizer) {
      throw new Error('Chrome Summarizer API not available');
    }

    const capabilities = await window.ai.summarizer.capabilities();
    if (capabilities.available !== 'readily') {
      throw new Error('Chrome Summarizer API not ready');
    }

    console.log('[Chrome AI] Creating summarizer...');
    const summarizer = await window.ai.summarizer.create({
      type: 'key-points',
      format: 'markdown',
      length: 'medium'
    });

    console.log('[Chrome AI] Summarizing with Summarizer API...');
    const summary = await summarizer.summarize(content.text);

    // Clean up
    summarizer.destroy();

    return {
      success: true,
      text: summary,
      source: 'chrome-ai'
    };

  } catch (error) {
    console.error('[Chrome AI] Summarizer API error:', error);
    return {
      success: false,
      error: error.message,
      source: 'chrome-ai'
    };
  }
}

/**
 * Chrome Writer API - Generate Content
 */
async function writeWithChromeAI(prompt, tone = 'neutral') {
  try {
    if (!window.ai || !window.ai.writer) {
      throw new Error('Chrome Writer API not available');
    }

    const capabilities = await window.ai.writer.capabilities();
    if (capabilities.available !== 'readily') {
      throw new Error('Chrome Writer API not ready');
    }

    console.log('[Chrome AI] Creating writer...');
    const writer = await window.ai.writer.create({
      tone: tone, // 'formal', 'neutral', or 'casual'
      length: 'medium'
    });

    console.log('[Chrome AI] Writing with Writer API...');
    const result = await writer.write(prompt);

    // Clean up
    writer.destroy();

    return {
      success: true,
      text: result,
      source: 'chrome-ai'
    };

  } catch (error) {
    console.error('[Chrome AI] Writer API error:', error);
    return {
      success: false,
      error: error.message,
      source: 'chrome-ai'
    };
  }
}

/**
 * Chrome Rewriter API - Adjust Tone/Length
 */
async function rewriteWithChromeAI(text, options = {}) {
  try {
    if (!window.ai || !window.ai.rewriter) {
      throw new Error('Chrome Rewriter API not available');
    }

    const capabilities = await window.ai.rewriter.capabilities();
    if (capabilities.available !== 'readily') {
      throw new Error('Chrome Rewriter API not ready');
    }

    console.log('[Chrome AI] Creating rewriter...');
    const rewriter = await window.ai.rewriter.create({
      tone: options.tone || 'as-is', // 'more-formal', 'more-casual', 'as-is'
      length: options.length || 'as-is' // 'shorter', 'longer', 'as-is'
    });

    console.log('[Chrome AI] Rewriting with Rewriter API...');
    const result = await rewriter.rewrite(text);

    // Clean up
    rewriter.destroy();

    return {
      success: true,
      text: result,
      source: 'chrome-ai'
    };

  } catch (error) {
    console.error('[Chrome AI] Rewriter API error:', error);
    return {
      success: false,
      error: error.message,
      source: 'chrome-ai'
    };
  }
}

/**
 * Hybrid Function - Try Chrome AI first, fallback to Gemini
 */
async function generateRepliesHybrid(content, style, customDescription, geminiApiKey) {
  console.log('[Hybrid AI] Checking Chrome AI availability...');

  // Try Chrome AI first
  const chromeResult = await generateRepliesWithChromeAI(content, style, customDescription);

  if (chromeResult.success) {
    console.log('[Hybrid AI] ✅ Used Chrome Built-in AI');
    return chromeResult;
  }

  // Fallback to Gemini
  console.log('[Hybrid AI] Chrome AI not available, falling back to Gemini...');
  // This will be called from popup.js with Gemini fallback
  return {
    success: false,
    useFallback: true,
    error: chromeResult.error
  };
}

/**
 * Hybrid Summarizer - Try Chrome AI first, fallback to Gemini
 */
async function summarizeHybrid(content, geminiApiKey) {
  console.log('[Hybrid AI] Checking Chrome AI Summarizer availability...');

  // Try Chrome AI first
  const chromeResult = await summarizeWithChromeAI(content);

  if (chromeResult.success) {
    console.log('[Hybrid AI] ✅ Used Chrome Built-in AI Summarizer');
    return chromeResult;
  }

  // Fallback to Gemini
  console.log('[Hybrid AI] Chrome AI Summarizer not available, falling back to Gemini...');
  return {
    success: false,
    useFallback: true,
    error: chromeResult.error
  };
}

// Export functions for use in popup.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkChromeAIAvailability,
    generateRepliesWithChromeAI,
    summarizeWithChromeAI,
    writeWithChromeAI,
    rewriteWithChromeAI,
    generateRepliesHybrid,
    summarizeHybrid
  };
}