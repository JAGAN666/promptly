// Web Search Integration for Fact Checking
// Uses Google Custom Search API for real-time verification

/**
 * Search the web for information about a claim
 * @param {string} query - The search query (claim to verify)
 * @param {string} apiKey - Google Custom Search API key
 * @param {string} searchEngineId - Google Custom Search Engine ID
 * @returns {Promise<Object>} Search results with URLs and snippets
 */
async function searchWeb(query, apiKey, searchEngineId) {
  if (!apiKey || !searchEngineId) {
    console.log('[Web Search] API credentials not configured');
    return { error: 'API credentials missing', results: [] };
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=5`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('[Web Search] API error:', response.status);
      return { error: `API error: ${response.status}`, results: [] };
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return { error: 'No results found', results: [] };
    }

    // Extract relevant information from search results
    const results = data.items.map(item => ({
      title: item.title,
      snippet: item.snippet,
      url: item.link,
      displayUrl: item.displayLink
    }));

    return { results, totalResults: data.searchInformation?.totalResults || 0 };
  } catch (error) {
    console.error('[Web Search] Error:', error);
    return { error: error.message, results: [] };
  }
}

/**
 * Verify a claim using web search and AI analysis
 * @param {string} claim - The claim to verify
 * @param {string} geminiApiKey - Gemini API key for analysis
 * @param {string} searchApiKey - Google Custom Search API key
 * @param {string} searchEngineId - Google Custom Search Engine ID
 * @returns {Promise<Object>} Verification result with rating and sources
 */
async function verifyClaimWithWebSearch(claim, geminiApiKey, searchApiKey, searchEngineId) {
  // Step 1: Search the web for the claim
  const searchResults = await searchWeb(claim, searchApiKey, searchEngineId);

  if (searchResults.error || searchResults.results.length === 0) {
    // Fall back to AI-only analysis
    return {
      claim,
      rating: 'UNVERIFIABLE',
      confidence: 'low',
      reason: 'No web sources found',
      sources: [],
      analysis: 'Unable to verify this claim through web search. This may be an opinion, prediction, or claim lacking online documentation.'
    };
  }

  // Step 2: Use AI to analyze the search results
  const sourcesText = searchResults.results.map((r, i) =>
    `Source ${i + 1} (${r.displayUrl}):\n${r.snippet}`
  ).join('\n\n');

  const prompt = `You are a fact-checker. Analyze this claim against web search results.

CLAIM: "${claim}"

WEB SEARCH RESULTS:
${sourcesText}

Analyze the search results and determine if the claim is TRUE, FALSE, or UNVERIFIABLE. Return ONLY JSON:

{
  "rating": "<TRUE|FALSE|UNVERIFIABLE>",
  "confidence": "<high|medium|low>",
  "analysis": "<3-5 sentence explanation>",
  "supportingEvidence": [
    {"text": "<evidence from sources>", "sourceIndex": <0-4>}
  ],
  "refutingEvidence": [
    {"text": "<contradicting evidence>", "sourceIndex": <0-4>}
  ],
  "context": "<important context or nuance>"
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
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
        const analysis = JSON.parse(jsonMatch[0]);

        // Attach source URLs to evidence
        if (analysis.supportingEvidence) {
          analysis.supportingEvidence = analysis.supportingEvidence.map(ev => ({
            ...ev,
            sourceUrl: searchResults.results[ev.sourceIndex]?.url,
            sourceTitle: searchResults.results[ev.sourceIndex]?.title,
            sourceDisplay: searchResults.results[ev.sourceIndex]?.displayUrl
          }));
        }

        if (analysis.refutingEvidence) {
          analysis.refutingEvidence = analysis.refutingEvidence.map(ev => ({
            ...ev,
            sourceUrl: searchResults.results[ev.sourceIndex]?.url,
            sourceTitle: searchResults.results[ev.sourceIndex]?.title,
            sourceDisplay: searchResults.results[ev.sourceIndex]?.displayUrl
          }));
        }

        return {
          claim,
          ...analysis,
          sources: searchResults.results
        };
      }
    }
  } catch (error) {
    console.error('[Claim Verification] AI analysis error:', error);
  }

  // Fallback if AI analysis fails
  return {
    claim,
    rating: 'UNVERIFIABLE',
    confidence: 'low',
    reason: 'Analysis error',
    sources: searchResults.results,
    analysis: 'Found sources but unable to complete analysis.'
  };
}

/**
 * Batch verify multiple claims
 * @param {Array<string>} claims - Array of claims to verify
 * @param {string} geminiApiKey - Gemini API key
 * @param {string} searchApiKey - Google Custom Search API key
 * @param {string} searchEngineId - Google Custom Search Engine ID
 * @param {number} maxClaims - Maximum number of claims to verify (default 5)
 * @returns {Promise<Array>} Array of verification results
 */
async function batchVerifyClaims(claims, geminiApiKey, searchApiKey, searchEngineId, maxClaims = 5) {
  // Limit number of claims to avoid API rate limits
  const claimsToVerify = claims.slice(0, maxClaims);

  const results = [];

  // Verify claims sequentially to avoid rate limiting
  for (const claim of claimsToVerify) {
    const result = await verifyClaimWithWebSearch(claim, geminiApiKey, searchApiKey, searchEngineId);
    results.push(result);

    // Small delay between requests to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    searchWeb,
    verifyClaimWithWebSearch,
    batchVerifyClaims
  };
} else {
  // Browser environment
  window.searchWeb = searchWeb;
  window.verifyClaimWithWebSearch = verifyClaimWithWebSearch;
  window.batchVerifyClaims = batchVerifyClaims;
}
