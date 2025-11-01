// Advanced Features - Sentiment, Toxicity, Debate Mode, Echo Chamber, Fact Check
// Features that make this extension a WINNER

/**
 * FEATURE 3: Sentiment Analysis + Tone Detection
 */
async function analyzeSentiment(text, apiKey) {
  const prompt = `Analyze the sentiment and tone of this text. Return ONLY a JSON object:

Text: "${text}"

{
  "sentiment": "<positive|negative|neutral|mixed>",
  "tone": "<angry|happy|sad|sarcastic|professional|casual|anxious|excited>",
  "confidence": <0-100>,
  "emoji": "<appropriate emoji>",
  "suggestedResponseTone": "<recommended tone for reply>",
  "explanation": "<brief explanation>"
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 512 }
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0]) {
      const resultText = data.candidates[0].content.parts[0].text;
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.error('[Sentiment] Analysis error:', error);
  }

  return {
    sentiment: 'neutral',
    tone: 'casual',
    confidence: 50,
    emoji: '😐',
    suggestedResponseTone: 'balanced',
    explanation: 'Unable to analyze sentiment'
  };
}

/**
 * FEATURE 4: Toxicity Shield
 */
async function analyzeToxicity(text, apiKey) {
  const prompt = `Analyze this text for toxicity, harassment, or inappropriate content. Return ONLY JSON:

Text: "${text}"

{
  "toxicityScore": <0-100>,
  "level": "<none|low|medium|high|severe>",
  "issues": [
    {"type": "<issue type>", "phrase": "<problematic phrase>", "suggestion": "<better alternative>"}
  ],
  "isAppropriate": <true|false>,
  "concerns": ["<concern 1>", "<concern 2>"],
  "improvements": ["<suggestion 1>", "<suggestion 2>"]
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0]) {
      const resultText = data.candidates[0].content.parts[0].text;
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.error('[Toxicity] Analysis error:', error);
  }

  return {
    toxicityScore: 0,
    level: 'none',
    issues: [],
    isAppropriate: true,
    concerns: [],
    improvements: []
  };
}

/**
 * FEATURE 5: Debate Mode - Generate Pro AND Con arguments
 */
async function generateDebateMode(content, apiKey) {
  const prompt = `Analyze this content and generate BOTH pro and con arguments. Return JSON:

Content: "${content.text}"

{
  "topic": "<main topic being discussed>",
  "proArguments": [
    {"point": "<pro point 1>", "evidence": "<supporting evidence>"},
    {"point": "<pro point 2>", "evidence": "<supporting evidence>"}
  ],
  "conArguments": [
    {"point": "<con point 1>", "evidence": "<supporting evidence>"},
    {"point": "<con point 2>", "evidence": "<supporting evidence>"}
  ],
  "neutralSummary": "<balanced summary of both perspectives>",
  "commonGround": ["<area of agreement 1>", "<area of agreement 2>"]
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 2048 }
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0]) {
      const resultText = data.candidates[0].content.parts[0].text;
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.error('[Debate] Generation error:', error);
  }

  return {
    topic: 'Analysis incomplete',
    proArguments: [],
    conArguments: [],
    neutralSummary: 'Unable to generate debate analysis',
    commonGround: []
  };
}

/**
 * FEATURE 6: Echo Chamber Breaker - Show opposite viewpoints
 */
async function breakEchoChamber(content, apiKey) {
  const prompt = `Analyze this content and generate the OPPOSITE perspective fairly and thoughtfully. Return JSON:

Content: "${content.text}"

{
  "detectedPerspective": "<current perspective>",
  "oppositeView": {
    "summary": "<fair summary of opposite view>",
    "keyPoints": [
      "<strong point from opposite side 1>",
      "<strong point from opposite side 2>",
      "<strong point from opposite side 3>"
    ],
    "validConcerns": ["<legitimate concern 1>", "<legitimate concern 2>"],
    "nuance": "<what both sides might be missing>"
  },
  "bridgeStatement": "<statement that finds common ground>",
  "questionToConsider": "<thought-provoking question>"
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1536 }
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0]) {
      const resultText = data.candidates[0].content.parts[0].text;
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.error('[Echo Chamber] Breaking error:', error);
  }

  return {
    detectedPerspective: 'Unknown',
    oppositeView: {
      summary: 'Unable to generate opposite view',
      keyPoints: [],
      validConcerns: [],
      nuance: ''
    },
    bridgeStatement: '',
    questionToConsider: ''
  };
}

/**
 * FEATURE 6: Fact-Check Assistant (Production Quality with Multi-Source Verification)
 * Uses: Google Fact Check API + Wikipedia + Authoritative Sources
 */
async function factCheckContent(content, apiKey, searchApiKey = null, searchEngineId = null) {
  console.log('[Fact Check] Starting production-quality fact-check with multi-source verification');

  // Step 1: Extract factual claims using AI
  const extractionPrompt = `Identify factual claims in this content. Return ONLY JSON:

Content: "${content.text}"

{
  "claims": [
    "<factual claim 1>",
    "<factual claim 2>",
    "<factual claim 3>"
  ]
}

Only extract claims that are verifiable facts, not opinions or predictions. Limit to 3 most important claims.`;

  let claimsToVerify = [];

  try {
    const extractResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: extractionPrompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 512 }
      })
    });

    const extractData = await extractResponse.json();
    if (extractData.candidates && extractData.candidates[0]) {
      const resultText = extractData.candidates[0].content.parts[0].text;
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        claimsToVerify = parsed.claims || [];
      }
    }
  } catch (error) {
    console.error('[Fact Check] Claim extraction error:', error);
  }

  if (claimsToVerify.length === 0) {
    return {
      mode: 'production',
      claims: [],
      credibilityScore: 50,
      message: 'No verifiable factual claims found in this content.'
    };
  }

  console.log(`[Fact Check] Extracted ${claimsToVerify.length} claims to verify`);

  // Step 2: Use multi-source cross-referencing
  // This includes: Google Fact Check API, Wikipedia, and Authoritative Sources
  const verifiedClaims = [];

  for (const claim of claimsToVerify) {
    console.log(`[Fact Check] Cross-referencing: "${claim}"`);

    let result;

    if (typeof crossReferenceMultipleSources === 'function') {
      // Use production-quality multi-source verification
      result = await crossReferenceMultipleSources(claim, apiKey, searchApiKey, searchEngineId);
    } else {
      // Fallback: basic verification
      console.warn('[Fact Check] crossReferenceMultipleSources not available, using fallback');
      result = {
        claim,
        rating: 'UNVERIFIABLE',
        confidence: 'low',
        analysis: 'Unable to verify - multi-source system not loaded',
        sources: []
      };
    }

    verifiedClaims.push(result);

    // Small delay between claims to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Calculate overall credibility score
  const ratings = verifiedClaims.map(c => c.rating);
  const trueCount = ratings.filter(r => r === 'TRUE').length;
  const falseCount = ratings.filter(r => r === 'FALSE').length;
  const disputedCount = ratings.filter(r => r === 'DISPUTED').length;
  const unverifiableCount = ratings.filter(r => r === 'UNVERIFIABLE').length;

  const totalVerifiable = trueCount + falseCount;
  let credibilityScore;

  if (totalVerifiable > 0) {
    // Base score on verified claims
    credibilityScore = Math.round((trueCount / totalVerifiable) * 100);
  } else if (disputedCount > 0) {
    // Disputed claims = medium credibility
    credibilityScore = 50;
  } else {
    // Mostly unverifiable = uncertain
    credibilityScore = 50;
  }

  // Count professional fact-checker sources
  const professionalFactChecks = verifiedClaims.reduce((sum, claim) => {
    return sum + (claim.professionalFactCheckers || 0);
  }, 0);

  console.log(`[Fact Check] Complete. Score: ${credibilityScore}, ${professionalFactChecks} professional fact-checks used`);

  return {
    mode: 'production',
    claims: verifiedClaims,
    credibilityScore,
    summary: {
      total: verifiedClaims.length,
      verified: trueCount,
      refuted: falseCount,
      disputed: disputedCount,
      unverifiable: unverifiableCount,
      professionalFactChecks
    },
    disclaimer: 'AI-assisted fact-checking using Google Fact Check API, Wikipedia, and authoritative sources. Always verify independently for critical decisions.'
  };
}

// Export all functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeSentiment,
    analyzeToxicity,
    generateDebateMode,
    breakEchoChamber,
    factCheckContent
  };
} else {
  // Browser environment
  window.analyzeSentiment = analyzeSentiment;
  window.analyzeToxicity = analyzeToxicity;
  window.generateDebateMode = generateDebateMode;
  window.breakEchoChamber = breakEchoChamber;
  window.factCheckContent = factCheckContent;
}