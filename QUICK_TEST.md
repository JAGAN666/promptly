# Quick Test Guide - After Bug Fixes

## ✅ All Bugs Fixed!

### What Was Fixed:
1. ✅ Updated API model from `gemini-pro` (deprecated) to `gemini-1.5-flash`
2. ✅ Added fallback to 3 different models in case one fails
3. ✅ Improved error messages to show actual problems
4. ✅ Fixed content script injection from popup
5. ✅ Added helpful guidance for common errors

---

## 🚀 Testing Steps (5 minutes)

### Step 1: Reload Extension (30 seconds)

```
1. Go to chrome://extensions/
2. Find ArgumentArmor
3. Click the "Reload" button (circular arrow icon)
4. Make sure it's still enabled (toggle is ON)
```

✅ **Success:** No errors shown

---

### Step 2: Verify API Key (30 seconds)

```
1. Click ArgumentArmor icon in toolbar
2. Scroll to Settings section
3. Check that your API key is still there
4. If not, paste it again and click Save
```

✅ **Success:** Key is saved and shows "Saved!" confirmation

---

### Step 3: Test on Simple Page (2 minutes)

```
1. Open new tab: https://example.com
2. Press F12 (opens DevTools)
3. Go to Console tab (keep it open to see logs)
4. Right-click anywhere on the page
5. Type this text: "This is bad because I said so"
6. Select the text
7. Right-click → "Armor This Argument"
```

**Watch the Console for:**
```
✅ "Attempting API request with model: gemini-1.5-flash"
✅ "API request successful with model: gemini-1.5-flash"
```

**Watch the Page for:**
- Dark overlay appears
- Modal with ArgumentArmor logo
- Loading spinner (2-5 seconds)
- Results appear with score (should be LOW like 2-4/10)
- Issues listed

✅ **Success:** Analysis completes and shows results

❌ **If it fails:** Look at Console for the error message:
- `401/403`: API key issue → Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com and enable API
- `429`: Rate limit → Wait 1 minute
- Other: Check error message in red

---

### Step 4: Test Popup Method (1 minute)

```
1. Stay on example.com
2. Click ArgumentArmor icon
3. Paste this:
   "Everyone knows remote work is terrible."
4. Click "Analyze Argument"
```

✅ **Success:** Overlay appears on the page with analysis

❌ **If you see "Cannot analyze on this page":** You're on a chrome:// page, open a regular website

---

### Step 5: Test on Real Website (1 minute)

```
1. Go to https://reddit.com
2. Click anywhere to comment (or any text field)
3. Type: "This is the worst idea ever. Everyone agrees."
4. Select the text
5. Right-click → "Armor This Argument"
```

✅ **Success:** Analysis works on Reddit

---

## 🔍 Troubleshooting New Errors

### Error: "API error (401)"
**Cause:** API key invalid or not enabled

**Fix:**
1. Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Make sure you're signed in
3. Click "Enable" if not already enabled
4. Wait 2 minutes
5. Try again

---

### Error: "API error (403)"
**Cause:** API restrictions or permissions issue

**Fix:**
1. Go to https://aistudio.google.com/app/apikey
2. Delete your old API key
3. Create a NEW API key with NO restrictions
4. Copy the new key
5. Paste in extension → Save
6. Try again

---

### Error: "Attempting API request with model..." but no success message
**Cause:** All 3 models failed

**Fix:**
1. Check Console for specific error messages
2. Try test

ing API key directly:

```javascript
// Paste in Console (F12):
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_KEY_HERE', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: 'Say hello' }] }]
  })
})
.then(r => r.json())
.then(console.log)
```

Replace `YOUR_KEY_HERE` with your actual API key.

**Expected:** Should return JSON with AI response
**If error:** Shows exact problem

---

### Still Not Working?

**Last Resort Debug:**

1. **Open Console (F12)**
2. **Go to Console tab**
3. **Trigger analysis**
4. **Copy the ENTIRE error message (red text)**
5. **Read the error carefully - it will tell you exactly what's wrong**

Common fixes:
- "fetch failed" → Check internet connection
- "401/403" → API key or permissions issue
- "429" → Rate limited, wait 1 minute
- "Invalid JSON" → API response format changed (rare)

---

## ✅ If Tests Pass:

**You're ready for:**
1. ✅ Taking screenshots
2. ✅ Recording demo video
3. ✅ Submitting to Devpost

**Time remaining:**
- Screenshots: 15 min
- Video: 2-3 hours
- GitHub setup: 30 min
- Devpost submission: 30 min

**Total: ~4 hours to complete submission**

---

## 🎯 Quick Test Result Checklist

- [ ] Extension reloaded without errors
- [ ] API key saved successfully
- [ ] Test on example.com works
- [ ] Overlay appears correctly
- [ ] Analysis completes (2-5 seconds)
- [ ] Score is displayed (1-10)
- [ ] Issues are listed
- [ ] Popup analysis works
- [ ] Works on Reddit (or other real site)
- [ ] Console shows success messages
- [ ] No red errors in Console

**All checked?** → **READY FOR DEMO! 🎉**

---

## Next Steps After Testing Works:

1. **Test both modes:**
   - "Armor This Argument" (regular analysis)
   - "Challenge This Argument" (counter-arguments)

2. **Test on multiple sites:**
   - Reddit
   - Twitter
   - Gmail
   - Any blog/news site

3. **Take note of what works well** for demo video

4. **Check stats tracking:**
   - Click icon
   - See if "Total Analyzed" increments after each analysis

---

## Emergency Contacts:

If stuck:
- Check Console (F12) for detailed errors
- Read error messages carefully - they're now helpful!
- Check INSTALLATION.md for more detailed troubleshooting
- The error display now includes clickable links to fix issues

**Good luck! You've got this! 🚀**
