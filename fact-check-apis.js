// Fact-Checking APIs Integration
// Google Fact Check Tools API + Wikipedia API for production-quality verification

/**
 * GOOGLE FACT CHECK TOOLS API
 * Searches database of fact-checked claims from 100+ professional fact-checkers
 * Includes: Snopes, PolitiFact, FactCheck.org, AFP, Reuters, Full Fact, etc.
 * FREE API - No API key required!
 */

/**
 * Query Google Fact Check Tools API for verified claims
 * @param {string} claim - The claim to fact-check
 * @returns {Promise<Array>} Array of fact-check results from professional fact-checkers
 */
async function queryGoogleFactCheckAPI(claim) {
  try {
    // Google Fact Check Tools API is FREE and doesn't require API key!
    const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(claim)}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('[Google Fact Check] API error:', response.status);
      return [];
    }

    const data = await response.json();

    if (!data.claims || data.claims.length === 0) {
      return [];
    }

    // Extract verified fact-checks
    const factChecks = [];

    for (const claimData of data.claims) {
      for (const review of claimData.claimReview || []) {
        factChecks.push({
          claim: claimData.text || claim,
          rating: review.textualRating || 'Unknown',
          publisher: review.publisher?.name || 'Unknown',
          url: review.url,
          title: review.title,
          reviewDate: review.reviewDate,
          sourceQuality: calculateFactCheckerQuality(review.publisher?.name),
          verified: true, // From professional fact-checkers
          apiSource: 'Google Fact Check'
        });
      }
    }

    return factChecks;
  } catch (error) {
    console.error('[Google Fact Check] Error:', error);
    return [];
  }
}

/**
 * Calculate quality score for fact-checking source
 * @param {string} publisher - Publisher name
 * @returns {number} Quality score 1-5 stars
 */
function calculateFactCheckerQuality(publisher) {
  const highQuality = [
    'snopes',
    'politifact',
    'factcheck.org',
    'reuters',
    'afp fact check',
    'full fact',
    'washington post fact checker',
    'ap fact check',
    'bbc reality check'
  ];

  const mediumQuality = [
    'fact crescendo',
    'check your fact',
    'lead stories',
    'usa today',
    'science feedback'
  ];

  const publisherLower = (publisher || '').toLowerCase();

  for (const source of highQuality) {
    if (publisherLower.includes(source)) {
      return 5; // ⭐⭐⭐⭐⭐
    }
  }

  for (const source of mediumQuality) {
    if (publisherLower.includes(source)) {
      return 4; // ⭐⭐⭐⭐
    }
  }

  return 3; // ⭐⭐⭐ (default for any fact-checker in the database)
}

/**
 * WIKIPEDIA API
 * Query Wikipedia for established factual information
 */

/**
 * Search Wikipedia for information about a claim
 * @param {string} claim - The claim to search
 * @returns {Promise<Object>} Wikipedia search result with summary and sources
 */
async function queryWikipediaAPI(claim) {
  try {
    // Extract main subject/keywords from claim
    const searchTerms = extractKeywords(claim);

    // Wikipedia REST API search
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchTerms)}&limit=3&format=json&origin=*`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData[1] || searchData[1].length === 0) {
      return null;
    }

    // Get the first result
    const title = searchData[1][0];
    const description = searchData[2][0];
    const url = searchData[3][0];

    // Get full article summary
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const summaryResponse = await fetch(summaryUrl);
    const summaryData = await summaryResponse.json();

    return {
      title,
      extract: summaryData.extract || description,
      url,
      sourceQuality: 4, // Wikipedia is high-quality for established facts
      verified: false, // Not a fact-check, just reference material
      apiSource: 'Wikipedia'
    };
  } catch (error) {
    console.error('[Wikipedia] Error:', error);
    return null;
  }
}

/**
 * Extract keywords from claim for Wikipedia search
 * @param {string} claim - The claim text
 * @returns {string} Extracted keywords
 */
function extractKeywords(claim) {
  // Remove common words and extract main subject
  const stopWords = ['the', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'that', 'this', 'these', 'those', 'a', 'an', 'and', 'or', 'but', 'if', 'because', 'as', 'what', 'which', 'who', 'when', 'where', 'why', 'how'];

  const words = claim.toLowerCase().split(/\s+/);
  const keywords = words.filter(word =>
    word.length > 3 &&
    !stopWords.includes(word) &&
    !/^\d+$/.test(word)
  );

  return keywords.slice(0, 3).join(' ');
}

/**
 * AUTHORITATIVE SOURCE DOMAINS
 * Whitelist of trusted domains for filtering Google Search results
 */
const AUTHORITATIVE_DOMAINS = {
  // Academic institutions
  academic: [
    '.edu', // All educational institutions
    'scholar.google.com',
    'researchgate.net',
    'academia.edu'
  ],

  // Government sources
  government: [
    '.gov', // All US government
    '.gov.uk', // UK government
    'europa.eu', // European Union
    'who.int', // World Health Organization
    'cdc.gov',
    'nih.gov',
    'nasa.gov'
  ],

  // Major news outlets
  news: [
    'reuters.com',
    'apnews.com',
    'bbc.com',
    'bbc.co.uk',
    'npr.org',
    'pbs.org',
    'theguardian.com',
    'nytimes.com',
    'washingtonpost.com',
    'wsj.com',
    'ft.com',
    'economist.com',
    'bloomberg.com',
    'axios.com'
  ],

  // Scientific journals
  scientific: [
    'nature.com',
    'science.org',
    'sciencedirect.com',
    'springer.com',
    'pubmed.gov',
    'plos.org',
    'cell.com'
  ],

  // Fact-checking organizations
  factCheck: [
    'snopes.com',
    'politifact.com',
    'factcheck.org',
    'fullfact.org'
  ]
};

/**
 * Check if a domain is authoritative
 * @param {string} url - URL to check
 * @returns {Object} {isAuthoritative: boolean, category: string, qualityScore: number}
 */
function isAuthoritativeDomain(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    // Check each category
    for (const [category, domains] of Object.entries(AUTHORITATIVE_DOMAINS)) {
      for (const domain of domains) {
        if (hostname.includes(domain.replace('.', ''))) {
          const qualityScores = {
            academic: 5,
            government: 5,
            scientific: 5,
            factCheck: 5,
            news: 4
          };

          return {
            isAuthoritative: true,
            category,
            qualityScore: qualityScores[category] || 3
          };
        }
      }
    }

    return {
      isAuthoritative: false,
      category: 'unknown',
      qualityScore: 1
    };
  } catch (error) {
    return {
      isAuthoritative: false,
      category: 'unknown',
      qualityScore: 1
    };
  }
}

/**
 * MULTI-SOURCE CROSS-REFERENCING
 * Aggregate results from multiple sources and calculate consensus
 */

/**
 * Cross-reference a claim across multiple sources
 * @param {string} claim - The claim to verify
 * @param {string} geminiApiKey - Gemini API key for AI analysis
 * @param {string} searchApiKey - Google Custom Search API key (optional)
 * @param {string} searchEngineId - Search Engine ID (optional)
 * @returns {Promise<Object>} Aggregated verification result with consensus
 */
async function crossReferenceMultipleSources(claim, geminiApiKey, searchApiKey, searchEngineId) {
  const sources = [];

  // Source 1: Google Fact Check Tools API (professional fact-checkers)
  const factCheckResults = await queryGoogleFactCheckAPI(claim);
  sources.push(...factCheckResults);

  // Source 2: Wikipedia (established facts)
  const wikiResult = await queryWikipediaAPI(claim);
  if (wikiResult) {
    sources.push(wikiResult);
  }

  // Source 3: Google Custom Search (authoritative sources only)
  if (searchApiKey && searchEngineId && typeof searchWeb === 'function') {
    const searchResults = await searchWeb(claim, searchApiKey, searchEngineId);

    if (searchResults.results) {
      // Filter to authoritative sources only
      const authoritativeSources = searchResults.results
        .map(result => ({
          ...result,
          ...isAuthoritativeDomain(result.url)
        }))
        .filter(result => result.isAuthoritative);

      sources.push(...authoritativeSources.map(result => ({
        title: result.title,
        snippet: result.snippet,
        url: result.url,
        sourceQuality: result.qualityScore,
        category: result.category,
        verified: false,
        apiSource: 'Google Search (Authoritative)'
      })));
    }
  }

  // Analyze consensus
  return analyzeConsensus(claim, sources, geminiApiKey);
}

/**
 * Analyze consensus from multiple sources
 * @param {string} claim - The claim being verified
 * @param {Array} sources - Array of source results
 * @param {string} geminiApiKey - Gemini API key
 * @returns {Promise<Object>} Consensus analysis
 */
async function analyzeConsensus(claim, sources, geminiApiKey) {
  if (sources.length === 0) {
    return {
      claim,
      rating: 'UNVERIFIABLE',
      confidence: 'low',
      sources: [],
      consensus: 'No sources found',
      message: 'Unable to find reliable sources for this claim.'
    };
  }

  // Build context from all sources
  const sourcesContext = sources.map((source, idx) => {
    if (source.verified) {
      // From professional fact-checkers
      return `Fact-Checker ${idx + 1} (${source.publisher}): "${source.rating}" - ${source.url}`;
    } else if (source.apiSource === 'Wikipedia') {
      return `Wikipedia: ${source.extract} - ${source.url}`;
    } else {
      return `Source ${idx + 1} (${source.category}): ${source.snippet} - ${source.url}`;
    }
  }).join('\n\n');

  // Use AI to analyze all sources and determine consensus
  const prompt = `You are analyzing a factual claim against multiple reliable sources. Determine if there is consensus.

CLAIM: "${claim}"

SOURCES:
${sourcesContext}

Analyze the sources and return ONLY JSON:

{
  "rating": "<TRUE|FALSE|DISPUTED|UNVERIFIABLE>",
  "confidence": "<high|medium|low>",
  "consensus": "<brief explanation of what sources agree on>",
  "supportingEvidence": [
    {"text": "<evidence>", "sourceIndex": <index>, "quality": <1-5>}
  ],
  "refutingEvidence": [
    {"text": "<evidence>", "sourceIndex": <index>, "quality": <1-5>}
  ],
  "analysis": "<3-5 sentence detailed analysis>",
  "context": "<important context or nuance>"
}

Rating guidelines:
- TRUE: 2+ high-quality sources confirm, no credible refutation
- FALSE: 2+ high-quality sources refute, clear evidence against
- DISPUTED: Sources significantly contradict each other
- UNVERIFIABLE: Sources insufficient or inconclusive`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1536 }
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0]) {
      const resultText = data.candidates[0].content.parts[0].text;
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);

        // Attach source details to evidence
        if (analysis.supportingEvidence) {
          analysis.supportingEvidence = analysis.supportingEvidence.map(ev => ({
            ...ev,
            source: sources[ev.sourceIndex] || {}
          }));
        }

        if (analysis.refutingEvidence) {
          analysis.refutingEvidence = analysis.refutingEvidence.map(ev => ({
            ...ev,
            source: sources[ev.sourceIndex] || {}
          }));
        }

        return {
          claim,
          ...analysis,
          sources,
          sourceCount: sources.length,
          professionalFactCheckers: sources.filter(s => s.verified).length
        };
      }
    }
  } catch (error) {
    console.error('[Consensus Analysis] Error:', error);
  }

  // Fallback
  return {
    claim,
    rating: 'UNVERIFIABLE',
    confidence: 'low',
    sources,
    consensus: 'Analysis incomplete',
    message: 'Unable to complete consensus analysis.'
  };
}

// Export functions for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    queryGoogleFactCheckAPI,
    queryWikipediaAPI,
    isAuthoritativeDomain,
    crossReferenceMultipleSources,
    AUTHORITATIVE_DOMAINS
  };
} else {
  // Browser environment - expose functions globally
  window.queryGoogleFactCheckAPI = queryGoogleFactCheckAPI;
  window.queryWikipediaAPI = queryWikipediaAPI;
  window.isAuthoritativeDomain = isAuthoritativeDomain;
  window.crossReferenceMultipleSources = crossReferenceMultipleSources;
  window.AUTHORITATIVE_DOMAINS = AUTHORITATIVE_DOMAINS;
}
