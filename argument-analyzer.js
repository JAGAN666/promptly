// ArgumentArmor Analyzer - Argument Strength Analysis
// The UNIQUE feature that makes this extension stand out

/**
 * Analyze argument strength using AI
 */
async function analyzeArgumentStrength(text, apiKey) {
  const prompt = `You are an expert in logic, rhetoric, and argumentation. Analyze this argument for strength and quality.

ARGUMENT TO ANALYZE:
"${text}"

Provide a detailed analysis in the following JSON format:

{
  "scores": {
    "logic": <0-10>,
    "evidence": <0-10>,
    "clarity": <0-10>,
    "persuasiveness": <0-10>
  },
  "overallRating": "<weak|moderate|strong|excellent>",
  "logicalFallacies": [
    {"name": "<fallacy name>", "explanation": "<why it's a problem>"}
  ],
  "strengths": [
    "<strength 1>",
    "<strength 2>"
  ],
  "weaknesses": [
    "<weakness 1>",
    "<weakness 2>"
  ],
  "improvements": [
    "<specific suggestion 1>",
    "<specific suggestion 2>"
  ],
  "summary": "<2-sentence overall assessment>"
}

Be thorough and constructive. Focus on helping improve the argument.`;

  try {
    // Try Chrome AI first
    if (typeof generateRepliesWithChromeAI === 'function') {
      const content = { text: text, title: 'Argument Analysis' };
      const result = await generateRepliesWithChromeAI(content, null, prompt);
      if (result.success) {
        return parseAnalysisResult(result.text, 'chrome-ai');
      }
    }
  } catch (e) {
    console.log('[ArgumentArmor] Chrome AI unavailable, using Gemini');
  }

  // Fallback to Gemini
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048
        }
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0]) {
      const resultText = data.candidates[0].content.parts[0].text;
      return parseAnalysisResult(resultText, 'gemini');
    }
  } catch (error) {
    throw new Error('Failed to analyze argument: ' + error.message);
  }
}

/**
 * Parse AI response into structured analysis
 */
function parseAnalysisResult(text, source) {
  try {
    // Try to extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      parsed.source = source;
      return parsed;
    }
  } catch (e) {
    console.error('[ArgumentArmor] Failed to parse JSON, using fallback');
  }

  // Fallback: create basic structure from text
  return {
    scores: {
      logic: 7,
      evidence: 6,
      clarity: 7,
      persuasiveness: 7
    },
    overallRating: 'moderate',
    logicalFallacies: [],
    strengths: ['Analysis completed'],
    weaknesses: ['Could not parse detailed analysis'],
    improvements: ['Try analyzing again'],
    summary: text.substring(0, 200),
    source: source,
    rawText: text
  };
}

/**
 * Detect specific logical fallacies in text
 */
function detectLogicalFallacies(text) {
  const fallacies = [];
  const lowerText = text.toLowerCase();

  // Ad Hominem
  if (lowerText.match(/\b(you're|you are|he is|she is)\s+(stupid|dumb|idiot|moron|ignorant)/i)) {
    fallacies.push({
      name: 'Ad Hominem',
      explanation: 'Attacking the person instead of the argument',
      severity: 'high'
    });
  }

  // Strawman
  if (lowerText.match(/so (you're saying|you think|you believe)/i)) {
    fallacies.push({
      name: 'Potential Strawman',
      explanation: 'May be misrepresenting the opponent\'s argument',
      severity: 'medium'
    });
  }

  // False Dichotomy
  if (lowerText.match(/either .+ or .+/i) && lowerText.match(/only two (options|choices|ways)/i)) {
    fallacies.push({
      name: 'False Dichotomy',
      explanation: 'Presenting only two options when more exist',
      severity: 'medium'
    });
  }

  // Appeal to Authority
  if (lowerText.match(/experts? (say|agree|think)/i) || lowerText.match(/studies show/i)) {
    fallacies.push({
      name: 'Potential Appeal to Authority',
      explanation: 'Citing authority without evidence - ensure sources are credible',
      severity: 'low'
    });
  }

  // Slippery Slope
  if (lowerText.match(/if we .+ then .+ and then .+ and/i)) {
    fallacies.push({
      name: 'Potential Slippery Slope',
      explanation: 'Chain of events may not be inevitable',
      severity: 'medium'
    });
  }

  return fallacies;
}

/**
 * Calculate overall argument strength score
 */
function calculateStrengthScore(analysis) {
  const scores = analysis.scores;
  const average = (scores.logic + scores.evidence + scores.clarity + scores.persuasiveness) / 4;

  // Deduct points for fallacies
  const fallacyPenalty = analysis.logicalFallacies.length * 0.5;
  const finalScore = Math.max(0, average - fallacyPenalty);

  return {
    score: Math.round(finalScore * 10) / 10,
    rating: getRating(finalScore),
    color: getRatingColor(finalScore)
  };
}

/**
 * Get rating label from score
 */
function getRating(score) {
  if (score >= 9) return 'Excellent';
  if (score >= 7.5) return 'Strong';
  if (score >= 6) return 'Moderate';
  if (score >= 4) return 'Weak';
  return 'Very Weak';
}

/**
 * Get color for rating
 */
function getRatingColor(score) {
  if (score >= 9) return '#10b981'; // green
  if (score >= 7.5) return '#3b82f6'; // blue
  if (score >= 6) return '#f59e0b'; // orange
  if (score >= 4) return '#ef4444'; // red
  return '#991b1b'; // dark red
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeArgumentStrength,
    detectLogicalFallacies,
    calculateStrengthScore
  };
} else {
  // Browser environment
  window.analyzeArgumentStrength = analyzeArgumentStrength;
  window.detectLogicalFallacies = detectLogicalFallacies;
  window.calculateStrengthScore = calculateStrengthScore;
}