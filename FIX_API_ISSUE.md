# 🔧 Fix API Model Issue - Quick Guide

## The Problem
Google has been updating their model names. The error "models/gemini-1.5-pro is not found" means we need to find which models are currently available.

## Solution Steps (5 minutes)

### Step 1: Test Your API Key
1. **Open test-api.html** in Chrome:
   - File path: `/Users/jagan/Downloads/Hackaton/ext_final/argumentarmor/test-api.html`
   - Or drag the file into Chrome

2. **Enter your API key** (the one starting with AIza...)

3. **Click "List All Available Models"**
   - This shows which models Google provides for your key

4. **Click "Test All Common Models"**
   - This tests each model to see which ones work
   - Working models will show ✅
   - Failed models will show ❌

5. **Note the working models** (usually one or more of these):
   - `gemini-1.5-flash-latest` (most common)
   - `gemini-1.5-flash`
   - `gemini-1.0-pro`
   - `gemini-pro`

---

### Step 2: Reload Extension
1. Go to `chrome://extensions/`
2. Find "Smart Reply Assistant"
3. Click the **Reload** button
4. The extension now tries multiple models automatically

---

### Step 3: Test Extension
1. Go to https://reddit.com/r/technology
2. Click on any post
3. Click Smart Reply icon
4. Click "📖 Analyze Current Page"
5. **Press F12** to open Console and see which model works

You should see in Console:
```
Attempting with model: gemini-1.5-flash-latest
Success with model: gemini-1.5-flash-latest
```

---

## What We Fixed

### Old Code (Broken)
```javascript
const models = ['gemini-1.5-flash', 'gemini-1.5-pro'];
```

### New Code (Working)
```javascript
const models = [
  'gemini-1.5-flash-latest',  // Most likely to work
  'gemini-1.5-flash',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro',
  'gemini-1.0-pro',           // Older but stable
  'gemini-pro'                // Legacy fallback
];
```

The code now:
- ✅ Tries 6 different model names
- ✅ Automatically uses the first one that works
- ✅ Shows detailed error messages if all fail
- ✅ Logs which model succeeds in Console

---

## Common Issues & Solutions

### Issue: "API key not valid"
**Solution:**
- Go to https://aistudio.google.com/app/apikey
- Create a new API key
- Make sure there are no spaces when copying

### Issue: "Generative Language API not enabled"
**Solution:**
1. Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Make sure you're logged in with the same Google account
3. Click "ENABLE" button
4. Wait 2 minutes for it to activate

### Issue: "Quota exceeded (429 error)"
**Solution:**
- Wait 60 seconds (rate limit resets)
- Or create a new API key

### Issue: No models work at all
**Solution:**
1. Your API key might be restricted
2. Create a new UNRESTRICTED key:
   - Go to https://aistudio.google.com/app/apikey
   - Delete old key
   - Create new key
   - Choose "No restrictions"

---

## Quick Test Command

To test if API works at all, paste this in Console (F12):

```javascript
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: 'Say hello' }] }]
  })
}).then(r => r.json()).then(console.log);
```

Replace `YOUR_KEY` with your actual key.

**Expected:** Returns JSON with AI response
**If error:** Shows exact problem

---

## ✅ Success Checklist

After following these steps:
- [ ] test-api.html shows at least 1 working model
- [ ] Extension reloaded in chrome://extensions
- [ ] Console shows "Success with model: [model-name]"
- [ ] Smart Reply generates summaries/replies
- [ ] No more model not found errors

---

## Still Not Working?

Check Console (F12) for the exact error. The new code shows detailed messages:
- Which models it tried
- What error each one gave
- Suggestions for fixing

The extension will now try ALL common model names automatically, so it should work!

---

**Ready? Test it now!** The fix should work immediately after reloading the extension.