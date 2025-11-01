# Google Search API Setup Guide
## Enable Enhanced Fact-Checking with Web Search Verification

The enhanced Fact-Check feature can verify claims by searching the web in real-time. This requires setting up Google Custom Search API (free tier available).

---

## Quick Overview

**What you need:**
1. Google Custom Search API Key (free 100 searches/day)
2. Programmable Search Engine ID

**Time required:** 10-15 minutes

---

## Step 1: Get Google Custom Search API Key

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 1.2 Create or Select a Project
- Click on the project dropdown at the top
- Click "New Project"
- Name it something like "Smart Reply Fact Check"
- Click "Create"

### 1.3 Enable Custom Search API
1. In the search bar, type "Custom Search API"
2. Click on "Custom Search API" from results
3. Click "Enable" button
4. Wait a few seconds for it to enable

### 1.4 Create API Credentials
1. Click "Credentials" in the left sidebar
2. Click "+ CREATE CREDENTIALS" at the top
3. Select "API key"
4. Copy the API key that appears
5. (Optional but recommended) Click "Restrict Key"
   - Under "API restrictions", select "Restrict key"
   - Check only "Custom Search API"
   - Click "Save"

**Save this API key** - you'll need it in the extension settings!

---

## Step 2: Create Programmable Search Engine

### 2.1 Go to Programmable Search Engine
Visit: https://programmablesearchengine.google.com/

### 2.2 Create New Search Engine
1. Click "Add" or "Get Started"
2. Fill in the form:
   - **Name:** "Smart Reply Fact Checker"
   - **What to search:** Select "Search the entire web"
   - **Image search:** OFF (not needed)
   - **SafeSearch:** ON (recommended)

3. Click "Create"

### 2.3 Get Your Search Engine ID
1. After creation, you'll see your search engine
2. Click on it to open settings
3. Look for "Search engine ID" in the Overview section
4. It looks like: `a1b2c3d4e5f6g7h8i`
5. Copy this ID

**Save this Search Engine ID** - you'll need it in the extension settings!

---

## Step 3: Configure Extension

1. **Open the Smart Reply Assistant extension**

2. **Scroll down to Settings section**

3. **Enter your credentials:**
   - Paste your Google Custom Search API Key
   - Click "Save" button
   - Paste your Search Engine ID
   - Click "Save" button

4. **Done!** The Fact-Check feature will now use hybrid AI + Web Search verification.

---

## How to Use Enhanced Fact-Checking

### Standard Use (AI-Only Mode)
- Without Google Search API configured
- Uses Gemini AI to analyze claims
- Returns: LIKELY_TRUE, LIKELY_FALSE, or UNVERIFIABLE
- Based on AI's training data

### Enhanced Use (Hybrid Mode)
- With Google Search API configured
- Searches the web for each claim
- Analyzes top 5 results per claim
- Returns: TRUE, FALSE, or UNVERIFIABLE
- Includes clickable source links
- Shows supporting and refuting evidence

---

## Free Tier Limits

**Google Custom Search API Free Tier:**
- 100 searches per day
- Completely free
- No credit card required

**How many fact-checks can you do?**
- Each fact-check analyzes up to 5 claims
- Each claim = 1 search
- 100 searches/day = ~20 fact-checks per day
- More than enough for demo and personal use!

**If you need more:**
- Paid tier: $5 per 1,000 additional queries
- But 100/day is sufficient for most users

---

## Troubleshooting

### "API credentials missing" error
- Check that you saved both API key and Search Engine ID
- Reload the extension (chrome://extensions → refresh button)
- Try entering credentials again

### "API error: 403"
- Your API key might not have Custom Search API enabled
- Go back to Google Cloud Console
- Make sure "Custom Search API" is enabled for your project
- Check API key restrictions (shouldn't block Custom Search API)

### "No results found"
- This is normal for very specific or recent claims
- The fact-checker will mark as UNVERIFIABLE
- Try with claims that are more widely documented

### Still showing "AI-Only Mode"
- Make sure you clicked "Save" for both API key and Engine ID
- Check browser console (F12) for errors
- Reload the extension

---

## Testing Your Setup

1. **Open any webpage with factual claims** (news article, Wikipedia, etc.)

2. **Click the extension icon**

3. **Click "📖 Analyze Current Page"**

4. **Click "✓ Fact Check"**

5. **Look for the mode indicator:**
   - ✅ Green banner "🌐 Hybrid Mode: AI + Web Search Verification"
   - ❌ Yellow banner "AI-Only Mode" = API not configured

6. **If hybrid mode is working, you should see:**
   - TRUE/FALSE/UNVERIFIABLE ratings (not LIKELY_)
   - Supporting evidence with source links
   - Refuting evidence with source links
   - Clickable URLs to verify claims yourself

---

## Privacy & Security Notes

- Your API key is stored locally in Chrome storage
- Never shared with anyone except Google's API
- API calls go directly to Google's servers
- No data is sent to any third-party services
- You can remove API keys anytime from settings

---

## Alternative: Use Without Web Search

Don't want to set up Google Search API? No problem!

The Fact-Check feature still works in **AI-Only Mode**:
- Uses Gemini AI to analyze claims
- No web search required
- No additional API keys needed
- Results based on AI's knowledge (up to January 2025)
- Still very useful for detecting potential misinformation

To use AI-Only Mode:
- Just don't enter Google Search API credentials
- Fact-Check feature works automatically with just Gemini API

---

## For Demo/Testing Purposes

If you're demoing the extension or just testing:

1. **Quickest Setup (5 minutes):**
   - Just use AI-Only mode (no Google Search API)
   - Still impressive results
   - Shows all the UI features

2. **Full Setup (15 minutes):**
   - Follow this guide to enable web search
   - Shows TRUE/FALSE ratings with real sources
   - More impressive for judges/users
   - Demonstrates hybrid AI approach

---

## Cost Summary

**Completely FREE Setup:**
- ✅ Gemini API: Free tier
- ✅ Google Custom Search API: 100 searches/day free
- ✅ No credit card required for either
- ✅ Enough for demo, testing, and personal use

**If you need more (unlikely):**
- Gemini API: Pay-as-you-go after free tier
- Google Search: $5 per 1,000 queries after 100/day

---

## Questions?

- **API Key Help:** https://developers.google.com/custom-search/v1/overview
- **Search Engine Help:** https://programmablesearchengine.google.com/about/
- **Extension Issues:** Check browser console (F12) for errors

---

## What the Enhanced Fact-Check Can Do

With web search enabled:

✅ **Verify factual claims** against real-time web sources
✅ **Detect false information** with refuting evidence
✅ **Provide source links** for all evidence
✅ **Analyze up to 5 claims** per content
✅ **Rate each claim:** TRUE, FALSE, or UNVERIFIABLE
✅ **Show confidence levels:** high, medium, low
✅ **Context for each claim** explaining nuances
✅ **Calculate credibility score** (0-100) for content

**This is the most advanced fact-checking feature in any Chrome extension!**

---

## Ready to Test?

1. Make sure both API keys are saved
2. Open a news article or blog post
3. Click extension icon
4. Click "📖 Analyze Current Page"
5. Click "✓ Fact Check"
6. See the magic happen! 🌐✨

Enjoy your enhanced fact-checking superpowers! 🚀
