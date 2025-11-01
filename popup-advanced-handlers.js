// Advanced Feature Handlers for Popup
// Integrates production-quality features into the popup

// Setup event listeners for advanced features
function setupAdvancedFeatureListeners() {
  console.log('[Advanced Features] Setting up event listeners...');

  const features = [
    { id: 'argument-analyzer-btn', handler: handleArgumentAnalyzer, name: 'Argument Analyzer' },
    { id: 'sentiment-btn', handler: handleSentimentAnalysis, name: 'Sentiment Analysis' },
    { id: 'toxicity-btn', handler: handleToxicityCheck, name: 'Toxicity Shield' },
    { id: 'debate-btn', handler: handleDebateMode, name: 'Debate Mode' },
    { id: 'echo-chamber-btn', handler: handleEchoChamber, name: 'Echo Chamber' },
    { id: 'fact-check-btn', handler: handleFactCheck, name: 'Fact Check' }
  ];

  features.forEach(({ id, handler, name }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', handler);
      console.log(`  ✓ ${name} listener attached`);
    } else {
      console.error(`  ✗ ${name} button not found (${id})`);
    }
  });

  console.log('[Advanced Features] ✓ Setup complete');
}

// Handler 1: ArgumentArmor Analyzer
async function handleArgumentAnalyzer() {
  if (!extractedContent || !extractedContent.text) {
    alert('Please analyze content first');
    return;
  }

  const apiKey = await getApiKey();
  if (!apiKey) {
    alert('Please set your API key');
    return;
  }

  showLoading('Analyzing argument strength...');

  try {
    const analysis = await analyzeArgumentStrength(extractedContent.text, apiKey);

    let html = '<div class="analyzer-results">';
    html += '<h3>🛡️ Argument Strength Analysis</h3>';

    // Score Grid
    html += '<div class="score-grid">';
    html += `<div class="score-card"><div class="score-label">Logic</div><div class="score-value" style="color: #3b82f6;">${analysis.scores.logic}/10</div></div>`;
    html += `<div class="score-card"><div class="score-label">Evidence</div><div class="score-value" style="color: #10b981;">${analysis.scores.evidence}/10</div></div>`;
    html += `<div class="score-card"><div class="score-label">Clarity</div><div class="score-value" style="color: #f59e0b;">${analysis.scores.clarity}/10</div></div>`;
    html += `<div class="score-card"><div class="score-label">Persuasive</div><div class="score-value" style="color: #8b5cf6;">${analysis.scores.persuasiveness}/10</div></div>`;
    html += '</div>';

    // Overall Rating
    const avg = (analysis.scores.logic + analysis.scores.evidence + analysis.scores.clarity + analysis.scores.persuasiveness) / 4;
    const ratingColor = avg >= 8 ? '#10b981' : avg >= 6 ? '#f59e0b' : '#ef4444';
    html += `<div class="armor-rating" style="background: ${ratingColor};">`;
    html += `<div style="font-size: 24px; font-weight: 700;">${analysis.overallRating.toUpperCase()}</div>`;
    html += `<div style="font-size: 14px; opacity: 0.9;">Overall Armor Rating: ${avg.toFixed(1)}/10</div>`;
    html += '</div>';

    // Logical Fallacies
    if (analysis.logicalFallacies && analysis.logicalFallacies.length > 0) {
      html += '<div class="fallacy-list"><h4>⚠️ Logical Fallacies Detected:</h4><ul>';
      analysis.logicalFallacies.forEach(f => {
        html += `<li><strong>${f.name}:</strong> ${f.explanation}</li>`;
      });
      html += '</ul></div>';
    }

    // Improvements
    if (analysis.improvements && analysis.improvements.length > 0) {
      html += '<div class="improvement-list"><h4>✨ Suggested Improvements:</h4><ul>';
      analysis.improvements.forEach(imp => {
        html += `<li>${imp}</li>`;
      });
      html += '</ul></div>';
    }

    // Summary
    html += `<p style="margin-top: 16px; padding: 12px; background: #f9fafb; border-radius: 8px;"><strong>Summary:</strong> ${analysis.summary}</p>`;
    html += '</div>';

    showResults('ArgumentArmor Analysis', html);
  } catch (error) {
    showError('Failed to analyze argument: ' + error.message);
  }
}

// Handler 2: Sentiment Analysis
async function handleSentimentAnalysis() {
  if (!extractedContent || !extractedContent.text) {
    alert('Please analyze content first');
    return;
  }

  const apiKey = await getApiKey();
  if (!apiKey) {
    alert('Please set your API key');
    return;
  }

  showLoading('Analyzing sentiment...');

  try {
    const sentiment = await analyzeSentiment(extractedContent.text, apiKey);

    let html = '<div class="sentiment-display">';
    html += `<div class="sentiment-emoji">${sentiment.emoji}</div>`;
    html += '<div class="sentiment-details">';
    html += `<div class="sentiment-label">Sentiment</div>`;
    html += `<div class="sentiment-value">${sentiment.sentiment.toUpperCase()} (${sentiment.confidence}% confident)</div>`;
    html += `<div class="sentiment-label" style="margin-top: 8px;">Tone</div>`;
    html += `<div class="sentiment-value">${sentiment.tone}</div>`;
    html += `<div class="sentiment-suggestion"><strong>💡 Suggested reply tone:</strong> ${sentiment.suggestedResponseTone}</div>`;
    html += `<p style="margin-top: 8px; font-size: 13px;">${sentiment.explanation}</p>`;
    html += '</div></div>';

    showResults('Sentiment Analysis', html);
  } catch (error) {
    showError('Failed to analyze sentiment: ' + error.message);
  }
}

// Handler 3: Toxicity Shield
async function handleToxicityCheck() {
  if (!extractedContent || !extractedContent.text) {
    alert('Please analyze content first');
    return;
  }

  const apiKey = await getApiKey();
  if (!apiKey) {
    alert('Please set your API key');
    return;
  }

  showLoading('Checking for toxicity...');

  try {
    const toxicity = await analyzeToxicity(extractedContent.text, apiKey);

    const cssClass = toxicity.toxicityScore < 20 ? 'toxicity-safe' :
                     toxicity.toxicityScore < 50 ? 'toxicity-warning' : 'toxicity-danger';

    let html = `<div class="toxicity-display ${cssClass}">`;
    html += '<h3>🛡️ Toxicity Shield Analysis</h3>';
    html += `<div class="toxicity-score">${toxicity.toxicityScore}/100</div>`;
    html += `<div style="text-align: center; font-size: 18px; font-weight: 700; margin-bottom: 16px;">${toxicity.level.toUpperCase()}</div>`;

    if (toxicity.isAppropriate) {
      html += '<p style="text-align: center; font-weight: 600;">✅ Content appears appropriate</p>';
    } else {
      html += '<p style="text-align: center; font-weight: 600;">⚠️ Content may need revision</p>';
    }

    if (toxicity.issues && toxicity.issues.length > 0) {
      html += '<div class="toxicity-issues"><h4>Issues Found:</h4>';
      toxicity.issues.forEach(issue => {
        html += `<div class="issue-item"><strong>${issue.type}:</strong> "${issue.phrase}" → Suggested: "${issue.suggestion}"</div>`;
      });
      html += '</div>';
    }

    if (toxicity.improvements && toxicity.improvements.length > 0) {
      html += '<div style="margin-top: 12px;"><h4>Improvements:</h4><ul>';
      toxicity.improvements.forEach(imp => {
        html += `<li>${imp}</li>`;
      });
      html += '</ul></div>';
    }

    html += '</div>';

    showResults('Toxicity Shield', html);
  } catch (error) {
    showError('Failed to check toxicity: ' + error.message);
  }
}

// Handler 4: Debate Mode
async function handleDebateMode() {
  if (!extractedContent || !extractedContent.text) {
    alert('Please analyze content first');
    return;
  }

  const apiKey = await getApiKey();
  if (!apiKey) {
    alert('Please set your API key');
    return;
  }

  showLoading('Generating balanced debate...');

  try {
    const debate = await generateDebateMode(extractedContent, apiKey);

    let html = '<div class="debate-container">';
    html += '<h3>⚖️ Debate Mode: Both Perspectives</h3>';
    html += `<p style="margin: 12px 0; padding: 12px; background: #f9fafb; border-radius: 8px;"><strong>Topic:</strong> ${debate.topic}</p>`;

    html += '<div class="debate-columns">';

    // Pro column
    html += '<div class="pro-column"><h4>✅ Pro Arguments</h4>';
    if (debate.proArguments && debate.proArguments.length > 0) {
      debate.proArguments.forEach(arg => {
        html += `<div class="debate-point"><strong>${arg.point}</strong><br><small>${arg.evidence}</small></div>`;
      });
    }
    html += '</div>';

    // Con column
    html += '<div class="con-column"><h4>❌ Con Arguments</h4>';
    if (debate.conArguments && debate.conArguments.length > 0) {
      debate.conArguments.forEach(arg => {
        html += `<div class="debate-point"><strong>${arg.point}</strong><br><small>${arg.evidence}</small></div>`;
      });
    }
    html += '</div>';

    html += '</div>'; // end columns

    // Summary
    html += `<div style="margin-top: 16px; padding: 12px; background: #e0e7ff; border-radius: 8px;">`;
    html += `<h4>📊 Neutral Summary:</h4><p>${debate.neutralSummary}</p>`;
    html += '</div>';

    // Common Ground
    if (debate.commonGround && debate.commonGround.length > 0) {
      html += '<div style="margin-top: 12px; padding: 12px; background: #d1fae5; border-radius: 8px;">';
      html += '<h4>🤝 Common Ground:</h4><ul>';
      debate.commonGround.forEach(point => {
        html += `<li>${point}</li>`;
      });
      html += '</ul></div>';
    }

    html += '</div>';

    showResults('Debate Mode', html);
  } catch (error) {
    showError('Failed to generate debate: ' + error.message);
  }
}

// Handler 5: Echo Chamber Breaker
async function handleEchoChamber() {
  if (!extractedContent || !extractedContent.text) {
    alert('Please analyze content first');
    return;
  }

  const apiKey = await getApiKey();
  if (!apiKey) {
    alert('Please set your API key');
    return;
  }

  showLoading('Breaking echo chamber...');

  try {
    const echo = await breakEchoChamber(extractedContent, apiKey);

    let html = '<div class="echo-chamber-display">';
    html += '<h3>🌍 Echo Chamber Breaker</h3>';
    html += `<p style="margin: 12px 0; padding: 12px; background: white; border-radius: 8px;"><strong>Current Perspective:</strong> ${echo.detectedPerspective}</p>`;

    html += '<div class="opposite-view">';
    html += '<h4>🔄 Opposite Viewpoint</h4>';
    html += `<p><strong>Summary:</strong> ${echo.oppositeView.summary}</p>`;

    if (echo.oppositeView.keyPoints && echo.oppositeView.keyPoints.length > 0) {
      html += '<h5 style="margin-top: 12px;">Key Points:</h5><ul>';
      echo.oppositeView.keyPoints.forEach(point => {
        html += `<li>${point}</li>`;
      });
      html += '</ul>';
    }

    if (echo.oppositeView.validConcerns && echo.oppositeView.validConcerns.length > 0) {
      html += '<h5 style="margin-top: 12px;">Valid Concerns:</h5><ul>';
      echo.oppositeView.validConcerns.forEach(concern => {
        html += `<li>${concern}</li>`;
      });
      html += '</ul>';
    }

    if (echo.oppositeView.nuance) {
      html += `<p style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 6px;"><strong>Nuance:</strong> ${echo.oppositeView.nuance}</p>`;
    }

    html += '</div>';

    if (echo.bridgeStatement) {
      html += `<div class="bridge-statement">🤝 Bridge: ${echo.bridgeStatement}</div>`;
    }

    if (echo.questionToConsider) {
      html += `<div style="margin-top: 12px; padding: 12px; background: white; border-radius: 8px; border-left: 4px solid #8b5cf6;"><strong>🤔 Question to Consider:</strong> ${echo.questionToConsider}</div>`;
    }

    html += '</div>';

    showResults('Echo Chamber Breaker', html);
  } catch (error) {
    showError('Failed to break echo chamber: ' + error.message);
  }
}

// Handler 6: Fact Check Assistant (Production Quality)
async function handleFactCheck() {
  if (!extractedContent || !extractedContent.text) {
    alert('Please analyze content first');
    return;
  }

  const apiKey = await getApiKey();
  if (!apiKey) {
    alert('Please set your API key');
    return;
  }

  // Get Google Search API credentials from storage
  const searchSettings = await chrome.storage.local.get(['googleSearchApiKey', 'googleSearchEngineId']);
  const searchApiKey = searchSettings.googleSearchApiKey || null;
  const searchEngineId = searchSettings.googleSearchEngineId || null;

  showLoading('Production-quality fact-checking...');

  try {
    const factCheck = await factCheckContent(extractedContent, apiKey, searchApiKey, searchEngineId);

    let html = '<div class="fact-check-display">';
    html += '<h3>✓ Production-Quality Fact-Checker</h3>';

    // Production Mode indicator with details
    html += '<div style="background: #dbeafe; color: #1e40af; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; border-left: 4px solid #3b82f6;">';
    html += '<div style="font-weight: 700; margin-bottom: 4px;">🔬 Multi-Source Verification</div>';
    html += '<div style="font-size: 12px; line-height: 1.5;">';
    html += '✓ Google Fact Check API (100+ professional fact-checkers)<br>';
    html += '✓ Wikipedia for established facts<br>';
    html += '✓ Authoritative sources only (.edu, .gov, major news)<br>';
    html += '✓ Cross-referenced with AI analysis';
    html += '</div></div>';

    if (factCheck.summary && factCheck.summary.professionalFactChecks > 0) {
      html += `<div style="background: #d1fae5; color: #065f46; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px; font-size: 13px; display: flex; align-items: center; gap: 6px;">`;
      html += `<span>⭐</span><strong>${factCheck.summary.professionalFactChecks} professional fact-check(s) found!</strong>`;
      html += `</div>`;
    }

    // Credibility Score
    const scoreColor = factCheck.credibilityScore >= 70 ? '#10b981' :
                       factCheck.credibilityScore >= 40 ? '#f59e0b' : '#ef4444';
    html += `<div class="credibility-score" style="color: ${scoreColor};">${factCheck.credibilityScore}/100</div>`;
    html += '<div style="text-align: center; font-weight: 600; margin-bottom: 20px;">Overall Credibility</div>';

    // Summary
    if (factCheck.summary) {
      html += '<div style="background: #f9fafb; padding: 12px; border-radius: 8px; margin-bottom: 16px;">';
      html += `<strong>Analysis Summary:</strong> ${factCheck.summary.total} claims verified`;
      html += `<div style="display: flex; gap: 10px; margin-top: 8px; font-size: 13px; flex-wrap: wrap;">`;
      html += `<span style="color: #10b981;">✓ ${factCheck.summary.verified} TRUE</span>`;
      html += `<span style="color: #ef4444;">✗ ${factCheck.summary.refuted} FALSE</span>`;
      if (factCheck.summary.disputed > 0) {
        html += `<span style="color: #f59e0b;">⚠ ${factCheck.summary.disputed} DISPUTED</span>`;
      }
      html += `<span style="color: #6b7280;">? ${factCheck.summary.unverifiable} UNVERIFIABLE</span>`;
      html += `</div></div>`;
    }

    // Claims with production-quality display
    if (factCheck.claims && factCheck.claims.length > 0) {
      html += '<h4>📋 Verified Claims:</h4>';

      factCheck.claims.forEach((claim, index) => {
        const ratingColors = {
          'TRUE': '#10b981',
          'FALSE': '#ef4444',
          'DISPUTED': '#f59e0b',
          'UNVERIFIABLE': '#6b7280'
        };
        const ratingEmojis = {
          'TRUE': '✓',
          'FALSE': '✗',
          'DISPUTED': '⚠',
          'UNVERIFIABLE': '?'
        };

        html += `<div class="claim-card" style="border-left: 4px solid ${ratingColors[claim.rating] || '#6b7280'};">`;

        // Claim header with source count
        html += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">`;
        html += `<span style="background: #e5e7eb; color: #374151; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">#${index + 1}</span>`;
        html += `<span style="background: ${ratingColors[claim.rating] || '#6b7280'}; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600;">${ratingEmojis[claim.rating] || '?'} ${claim.rating}</span>`;
        html += `<span style="background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase;">${claim.confidence} CONFIDENCE</span>`;

        // Source count badge
        if (claim.sourceCount) {
          html += `<span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 11px;">${claim.sourceCount} source(s)</span>`;
        }

        html += `</div>`;

        // Claim text
        html += `<div style="font-weight: 500; margin-bottom: 10px; color: #1f2937; font-size: 14px;">"${claim.claim}"</div>`;

        // Consensus explanation
        if (claim.consensus) {
          html += `<div style="font-size: 13px; color: #4b5563; margin-bottom: 10px; background: #f0f9ff; padding: 8px; border-radius: 4px;"><strong>Consensus:</strong> ${claim.consensus}</div>`;
        }

        // Analysis
        if (claim.analysis) {
          html += `<div style="font-size: 13px; color: #4b5563; margin-bottom: 10px; line-height: 1.5;">${claim.analysis}</div>`;
        }

        // Supporting Evidence with quality indicators
        if (claim.supportingEvidence && claim.supportingEvidence.length > 0) {
          html += '<div style="background: #f0fdf4; padding: 10px; border-radius: 6px; margin-top: 10px; border-left: 3px solid #10b981;">';
          html += '<div style="font-weight: 600; font-size: 13px; color: #065f46; margin-bottom: 8px;">✓ Supporting Evidence:</div>';
          claim.supportingEvidence.forEach(ev => {
            const stars = '⭐'.repeat(ev.quality || 3);
            html += `<div style="margin-bottom: 10px;">`;
            html += `<div style="font-size: 12px; color: #064e3b; margin-bottom: 4px;">• ${ev.text}</div>`;
            if (ev.source) {
              if (ev.source.verified) {
                // Professional fact-checker
                html += `<div style="font-size: 11px; color: #059669; margin-left: 12px;">`;
                html += `${stars} <strong>${ev.source.publisher || 'Fact-checker'}</strong>`;
                if (ev.source.url) {
                  html += ` - <a href="${ev.source.url}" target="_blank" style="color: #059669; text-decoration: none;">View source →</a>`;
                }
                html += `</div>`;
              } else if (ev.source.url) {
                html += `<a href="${ev.source.url}" target="_blank" style="color: #059669; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; margin-left: 12px;">📎 ${ev.source.title || 'Source'} →</a>`;
              }
            }
            html += `</div>`;
          });
          html += '</div>';
        }

        // Refuting Evidence
        if (claim.refutingEvidence && claim.refutingEvidence.length > 0) {
          html += '<div style="background: #fef2f2; padding: 10px; border-radius: 6px; margin-top: 10px; border-left: 3px solid #ef4444;">';
          html += '<div style="font-weight: 600; font-size: 13px; color: #991b1b; margin-bottom: 8px;">✗ Refuting Evidence:</div>';
          claim.refutingEvidence.forEach(ev => {
            const stars = '⭐'.repeat(ev.quality || 3);
            html += `<div style="margin-bottom: 10px;">`;
            html += `<div style="font-size: 12px; color: #7f1d1d; margin-bottom: 4px;">• ${ev.text}</div>`;
            if (ev.source) {
              if (ev.source.verified) {
                html += `<div style="font-size: 11px; color: #dc2626; margin-left: 12px;">`;
                html += `${stars} <strong>${ev.source.publisher || 'Fact-checker'}</strong>`;
                if (ev.source.url) {
                  html += ` - <a href="${ev.source.url}" target="_blank" style="color: #dc2626; text-decoration: none;">View source →</a>`;
                }
                html += `</div>`;
              } else if (ev.source.url) {
                html += `<a href="${ev.source.url}" target="_blank" style="color: #dc2626; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; margin-left: 12px;">📎 ${ev.source.title || 'Source'} →</a>`;
              }
            }
            html += `</div>`;
          });
          html += '</div>';
        }

        // Context
        if (claim.context) {
          html += `<div style="font-size: 12px; color: #6b7280; background: #f9fafb; padding: 8px; border-radius: 4px; margin-top: 10px;"><strong>Important Context:</strong> ${claim.context}</div>`;
        }

        html += `</div>`; // end claim-card
      });
    }

    // Disclaimer
    if (factCheck.disclaimer) {
      html += '<div style="background: #fef3c7; color: #92400e; padding: 10px; border-radius: 6px; margin-top: 16px; font-size: 12px; border-left: 3px solid #f59e0b;">';
      html += `<strong>⚠️ Disclaimer:</strong> ${factCheck.disclaimer}`;
      html += '</div>';
    }

    html += '</div>';

    showResults('Production-Quality Fact-Checker', html);
  } catch (error) {
    showError('Failed to fact-check: ' + error.message);
  }
}

// Helper functions
function showLoading(text) {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading-text').textContent = text;
  document.getElementById('results').style.display = 'none';
}

function showResults(title, html) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('results-title').textContent = title;
  document.getElementById('results-content').innerHTML = html;
  document.getElementById('results').style.display = 'block';

  // Add copy button listeners
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = e.target.dataset.text;
      navigator.clipboard.writeText(text);
      e.target.textContent = 'Copied!';
      setTimeout(() => e.target.textContent = 'Copy', 2000);
    });
  });
}

function showError(message) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('results-title').textContent = '❌ Error';
  document.getElementById('results-content').innerHTML = `
    <div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px;">
      <strong>Error:</strong> ${message}
    </div>
  `;
  document.getElementById('results').style.display = 'block';
}