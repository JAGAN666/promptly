# 🔑 API Key Configuration Setup

## Quick Setup (2 minutes)

### Step 1: Edit config.js

Open the file: `/Users/jagan/Downloads/Hackaton/ext_final/argumentarmor/config.js`

### Step 2: Add Your API Key

Replace `YOUR_API_KEY_HERE` with your actual Gemini API key:

```javascript
const CONFIG = {
  // Your actual API key goes here
  GEMINI_API_KEY: 'AIzaSy...(your actual key)',

  // Set this to true to use the key above
  USE_HARDCODED_KEY: true,

  // ... rest of config
};
```

### Step 3: Save and Reload

1. Save the config.js file
2. Go to `chrome://extensions/`
3. Click "Reload" on Smart Reply Assistant
4. Done! The extension will now use your API key

---

## Configuration Options Explained

### USE_HARDCODED_KEY
- `true` = Use the API key from config.js
- `false` = Use the API key from extension settings popup

### PREFERRED_MODELS
List of models to try, in order. The extension will use the first one that works:
```javascript
PREFERRED_MODELS: [
  'gemini-1.5-flash-latest',  // Fastest, most likely to work
  'gemini-1.5-flash',          // Fallback
  'gemini-1.0-pro',            // Stable older version
  // Add more models as needed
]
```

### API_TEMPERATURE
- Range: 0.0 to 1.0
- Lower (0.3) = More focused, deterministic
- Higher (0.9) = More creative, varied
- Default: 0.7 (balanced)

### MAX_OUTPUT_TOKENS
- Maximum length of AI responses
- Default: 1024 (good for replies)
- Increase to 2048 for longer content

### DEBUG_MODE
- `true` = Shows detailed logs in Console (F12)
- `false` = Minimal logging

---

## Security Notes

### ⚠️ IMPORTANT: config.js is IGNORED by Git

The `.gitignore` file ensures your API key is NOT uploaded to GitHub:
- ✅ config.js is ignored (your actual key)
- ✅ config.example.js is included (template)

### When sharing code:
- Never commit config.js
- Share config.example.js instead
- Users copy it to config.js and add their key

---

## Two Ways to Use API Key

### Option 1: Config File (Recommended for Development)

**Pros:**
- Quick to set up
- No need to enter key in popup
- Survives extension reloads

**Setup:**
1. Edit config.js
2. Set `USE_HARDCODED_KEY: true`
3. Add your key
4. Reload extension

### Option 2: Extension Settings (Recommended for Distribution)

**Pros:**
- More secure (stored in Chrome)
- Users manage their own keys
- No file editing needed

**Setup:**
1. Set `USE_HARDCODED_KEY: false` in config.js
2. Click extension icon
3. Scroll to Settings
4. Enter API key
5. Click Save

---

## Testing Your Configuration

### Quick Test:
1. Open https://reddit.com
2. Click on any post
3. Click Smart Reply icon
4. Click "Analyze Current Page"
5. Click "Summarize"

### Check Console (F12):
You should see:
```
Using API key from config.js
Attempting with model: gemini-1.5-flash-latest
Success with model: gemini-1.5-flash-latest
```

---

## Troubleshooting

### "API key not found"
- Check config.js has your actual key
- Verify `USE_HARDCODED_KEY: true`
- Reload extension

### "Model not found"
- Update PREFERRED_MODELS list
- Try models from test-api.html results

### Changes not working
- Always reload extension after editing config.js
- Check Console (F12) for errors

---

## Get Your API Key

If you don't have one yet:
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with AIza...)
4. Paste in config.js

---

## Ready to Test!

Your config.js should now look like:
```javascript
const CONFIG = {
  GEMINI_API_KEY: 'AIzaSy_actualKeyHere...',
  USE_HARDCODED_KEY: true,
  // ... rest stays the same
};
```

Save, reload extension, and test! 🚀