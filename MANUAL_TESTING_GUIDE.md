# Manual Testing Guide - All 7 Advanced Features

## Pre-Testing Setup

1. **Reload the Extension:**
   - Go to `chrome://extensions/`
   - Find "Smart Reply Assistant"
   - Click the refresh icon 🔄
   - Verify no errors in the console

2. **Prepare Test Content:**
   - Open Reddit, Twitter, or any webpage
   - Or prepare text to select

---

## Testing Checklist

### ✅ Feature 1: ArgumentArmor Analyzer

**Test Steps:**
1. Open extension popup
2. Click "📖 Analyze Current Page" or select text with floating button
3. Click "🛡️ Argument Analyzer" button
4. Wait for analysis to complete

**Expected Results:**
- ✅ Shows 4 scores: Logic, Evidence, Clarity, Persuasiveness (0-10)
- ✅ Displays overall rating with colored armor badge
- ✅ Lists detected logical fallacies (if any)
- ✅ Shows strengths, weaknesses, and improvements
- ✅ Color-coded display (green for good, yellow for moderate, red for weak)

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Feature 2: AI Comparison Mode

**Test Steps:**
1. Load content in popup (analyze page or select text)
2. Click "⚡ AI Comparison" button
3. Wait for both Chrome AI and Gemini to respond

**Expected Results:**
- ✅ Side-by-side comparison of Chrome AI vs Gemini
- ✅ Shows response times in milliseconds
- ✅ Displays 3 reply options from each AI
- ✅ Highlights winner with 🏆 badge
- ✅ Shows insights: "Chrome AI was Xx faster!"
- ✅ Copy buttons work for each reply

**Note:** Chrome AI may not be available (shows error), fallback to Gemini should work

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Feature 3: Sentiment Analysis

**Test Steps:**
1. Load content in popup
2. Click "😊 Sentiment" button
3. Wait for analysis

**Expected Results:**
- ✅ Shows sentiment (positive/negative/neutral/mixed)
- ✅ Displays tone (angry/happy/sad/sarcastic/professional/etc.)
- ✅ Shows confidence score (0-100%)
- ✅ Displays appropriate emoji
- ✅ Suggests response tone
- ✅ Includes brief explanation

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Feature 4: Toxicity Shield

**Test Steps:**
1. Load content in popup (test with both polite and harsh content)
2. Click "🛡️ Toxicity Shield" button
3. Wait for analysis

**Expected Results:**
- ✅ Shows toxicity score (0-100)
- ✅ Displays level (none/low/medium/high/severe)
- ✅ Color-coded shield (green=safe, yellow=caution, red=toxic)
- ✅ Lists specific issues with problematic phrases
- ✅ Provides suggestions for improvement
- ✅ Shows concerns and recommended changes

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Feature 5: Debate Mode

**Test Steps:**
1. Load content with an argument or opinion
2. Click "⚖️ Debate Mode" button
3. Wait for analysis

**Expected Results:**
- ✅ Identifies main topic
- ✅ Shows 2+ PRO arguments with evidence
- ✅ Shows 2+ CON arguments with evidence
- ✅ Displays neutral summary of both perspectives
- ✅ Lists common ground areas
- ✅ Two-column layout (Pro vs Con)

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Feature 6: Echo Chamber Breaker

**Test Steps:**
1. Load content with a clear perspective/opinion
2. Click "🌍 Echo Chamber" button
3. Wait for analysis

**Expected Results:**
- ✅ Detects current perspective
- ✅ Generates fair summary of opposite view
- ✅ Lists 3 strong points from opposite side
- ✅ Shows valid concerns
- ✅ Explains nuance both sides might miss
- ✅ Provides bridge statement (common ground)
- ✅ Includes thought-provoking question

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### ✅ Feature 7: Fact-Check Assistant

**Test Steps:**
1. Load content with factual claims
2. Click "✓ Fact Check" button
3. Wait for analysis

**Expected Results:**
- ✅ Lists all factual claims found
- ✅ For each claim: verifiable?, confidence level, needs source?
- ✅ Shows credibility score (0-100)
- ✅ Lists red flags (potential issues)
- ✅ Lists strengths (what's credible)
- ✅ Recommends source types for verification

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

## Additional Tests

### Integration Tests

**Test: All Features Appear**
- ✅ Advanced features section appears after analyzing content
- ✅ All 7 buttons are visible in grid layout
- ✅ Buttons have correct icons and labels

**Test: Error Handling**
- ✅ Features show appropriate error if API fails
- ✅ Loading spinner appears during processing
- ✅ User-friendly error messages displayed

**Test: UI/UX**
- ✅ Results are well-formatted and readable
- ✅ Color coding is appropriate and helpful
- ✅ Results section scrolls if content is long
- ✅ Can test multiple features without reloading

---

## Common Issues & Solutions

### Issue: "No content loaded"
**Solution:** Click "📖 Analyze Current Page" first, or select text on webpage

### Issue: "API key missing"
**Solution:** Enter Gemini API key in Settings section at bottom of popup

### Issue: "Chrome AI not available"
**Solution:** This is expected! Fallback to Gemini should work automatically

### Issue: Features don't appear
**Solution:**
1. Reload extension at chrome://extensions
2. Check browser console (F12) for errors
3. Verify all script files are loaded in popup.html

### Issue: Results not displaying
**Solution:**
1. Check API key is valid
2. Open test-api.html to verify API connectivity
3. Check console for detailed error messages

---

## Testing Results Summary

| Feature | Status | Notes |
|---------|--------|-------|
| 1. ArgumentArmor Analyzer | ⬜ | |
| 2. AI Comparison Mode | ⬜ | |
| 3. Sentiment Analysis | ⬜ | |
| 4. Toxicity Shield | ⬜ | |
| 5. Debate Mode | ⬜ | |
| 6. Echo Chamber Breaker | ⬜ | |
| 7. Fact-Check Assistant | ⬜ | |

**Overall Status:** ⬜ Not Started | 🔄 In Progress | ✅ All Pass | ❌ Has Failures

---

## Next Steps After Testing

1. ✅ All features pass → Proceed to demo recording
2. ❌ Some features fail → Debug and fix issues
3. 📝 Document any bugs or improvements needed
4. 🎥 Prepare demo showcasing all 7 features

---

## Demo Preparation Checklist

- [ ] Prepare compelling test content (Reddit post, tweet, article)
- [ ] Test all features one more time before recording
- [ ] Plan demo flow: show Chrome AI integration first, then 7 features
- [ ] Emphasize unique features (ArgumentArmor, AI Comparison, Echo Chamber)
- [ ] Highlight Chrome Built-in AI usage (CRITICAL for hackathon judges!)
- [ ] Show both Chrome AI and Gemini fallback working
- [ ] Demonstrate text selection floating button
- [ ] Show keyboard shortcuts (Ctrl+Shift+A)
- [ ] Record 3-5 minute demo video
- [ ] Take screenshots of each feature
