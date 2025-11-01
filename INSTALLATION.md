# ArgumentArmor - Installation & Testing Guide

## Quick Installation (5 minutes)

### Step 1: Load the Extension

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Toggle "Developer mode" ON (top right corner)
4. Click "Load unpacked"
5. Select the `argumentarmor` folder
6. ✅ Extension is now installed!

### Step 2: Configure API Key (for Gemini Fallback)

Since Chrome Built-in AI is still rolling out, you'll need a Gemini API key as fallback:

1. Get a free API key:
   - Visit https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy your key

2. Configure in extension:
   - Click the ArgumentArmor icon in Chrome toolbar
   - Scroll to "Settings" section
   - Paste your API key
   - Click "Save"

### Step 3: Test It Works

1. Open any webpage (try Reddit or Twitter)
2. Select some text (any argument or opinion)
3. Right-click → Choose "Armor This Argument"
4. You should see the analysis overlay appear!

---

## Testing Guide

### Test Scenario 1: Weak Argument (Should Score Low)

**Test Text:**
```
Remote work is terrible and should be banned. Everyone I know hates it,
and anyone who likes it is just lazy. Plus, offices are always better
because I said so.
```

**Expected Results:**
- Score: 2-4/10
- Issues Found:
  - ❌ Ad hominem fallacy ("anyone who likes it is just lazy")
  - ❌ Unsupported claims (no evidence provided)
  - ❌ Appeal to authority ("because I said so")
  - ❌ Anecdotal evidence ("everyone I know")

**How to Test:**
1. Paste this text into any text field
2. Select all the text
3. Right-click → "Armor This Argument"
4. Verify low score and multiple issues detected

---

### Test Scenario 2: Strong Argument (Should Score High)

**Test Text:**
```
According to a 2023 Stanford study of 16,000 employees, remote work
increased productivity by 13% for workers in focused roles like programming
and writing. However, the same study found a 7% decrease in productivity
for collaborative roles requiring frequent communication. This suggests
organizations should adopt hybrid policies that match work style to location,
rather than mandating one approach for all employees. Critics argue that
remote work harms company culture, but this can be addressed through
intentional virtual team-building and regular in-person meetups.
```

**Expected Results:**
- Score: 8-9/10
- Issues: Few or none
- Should note: Strong evidence, addresses counter-arguments

**How to Test:**
1. Paste text into a text field
2. Select and right-click → "Armor This Argument"
3. Verify high score with minimal issues

---

### Test Scenario 3: Challenge Mode

**Test an Opponent's Argument:**
```
AI will never replace human creativity. Humans have emotions and life
experiences that machines can't replicate. Therefore, AI art and writing
are worthless.
```

**Expected Results:**
- Should generate counter-arguments
- Should identify:
  - False dichotomy (not replace OR worthless)
  - Appeal to nature fallacy
  - Unsupported conclusion

**How to Test:**
1. Select the text
2. Right-click → "Challenge This Argument"
3. Review counter-arguments generated

---

### Test Scenario 4: Context Modes

Test the same argument in different contexts:

**Test Text:**
```
This approach won't work.
```

**Expected Analysis by Context:**
- **Professional**: Should suggest more formal language
- **Casual**: May accept informal tone
- **Academic**: Should require evidence and citations

**How to Test:**
1. Open extension popup
2. Paste text
3. Select different contexts from dropdown
4. Click "Analyze Argument"
5. Note differences in feedback

---

## Testing on Different Websites

### Reddit Testing
1. Go to https://reddit.com/r/changemyview
2. Find any comment
3. Select text → Right-click → "Armor This Argument"
4. Verify overlay appears and doesn't break page layout

### Twitter/X Testing
1. Go to https://twitter.com
2. Select any tweet text
3. Right-click → "Armor This Argument"
4. Verify it works on short-form content

### Gmail Testing
1. Go to https://gmail.com
2. Compose a new email
3. Type an argument
4. Select text → Right-click → "Armor This Argument"
5. Verify it works in compose window

### LinkedIn Testing
1. Go to https://linkedin.com
2. Find any post or start writing one
3. Select text → Right-click → "Armor This Argument"
4. Verify professional context recognition

---

## Troubleshooting

### Extension doesn't appear in toolbar
- ✅ Make sure you clicked "Load unpacked" not "Load"
- ✅ Refresh the extensions page
- ✅ Pin the extension: Click puzzle icon → Pin ArgumentArmor

### Context menu doesn't show
- ✅ Make sure you selected text first
- ✅ Refresh the webpage after installing extension
- ✅ Check Console (F12) for errors

### "API key not configured" error
- ✅ You need to set up Gemini API key (see Step 2 above)
- ✅ Chrome Built-in AI may not be available on your system yet
- ✅ Check chrome://flags for "Prompt API for Gemini Nano"

### Analysis is slow or times out
- ✅ Shorter text = faster analysis
- ✅ Check internet connection (for Gemini API fallback)
- ✅ Try Chrome Canary for built-in AI features

### Overlay blocks content
- ✅ Click outside the overlay to close
- ✅ Click the X button in top-right
- ✅ Press ESC key to dismiss

---

## Chrome Built-in AI Status

### Checking if Chrome AI is Available

1. Open DevTools (F12)
2. Go to Console
3. Type: `window.ai`
4. If you see an object → Chrome AI is available!
5. If `undefined` → Using Gemini API fallback

### Enabling Chrome AI (if unavailable)

1. Navigate to `chrome://flags`
2. Search for "Prompt API for Gemini Nano"
3. Enable the flag
4. Search for "enables optimization guide on device"
5. Enable it
6. Restart Chrome
7. Wait for Gemini Nano model to download (may take 10-30 min)

**Note:** Chrome Built-in AI requires:
- Chrome 128+ (or Chrome Canary/Dev)
- At least 22GB free disk space
- Supported OS: Windows 10/11, macOS 13+, or ChromeOS

---

## Performance Benchmarks

**Expected Performance:**
- Analysis time: 2-5 seconds (Gemini API) or <1 second (Chrome AI)
- Memory usage: ~50-100MB
- Works offline: Yes (if Chrome AI available)

---

## Known Limitations

1. **Chrome AI Availability:** Still rolling out, most users will use Gemini API fallback
2. **API Rate Limits:** Gemini API has free tier limits (60 requests/min)
3. **Text Length:** Works best with 50-500 words
4. **Language:** Currently optimized for English
5. **Context Detection:** May not always detect website-specific context

---

## Next Steps

Once you've verified the extension works:

1. ✅ Test all scenarios above
2. ✅ Try on your favorite websites
3. ✅ Test both "Armor" and "Challenge" modes
4. ✅ Check stats tracking in popup
5. ✅ Ready for demo video!

---

## Need Help?

- Check Console: F12 → Console tab for error messages
- Check Background Page: chrome://extensions → ArgumentArmor → "Inspect views: service worker"
- File an issue on GitHub
