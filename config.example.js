// Configuration file for Smart Reply Assistant
// Copy this file to config.js and add your API key

const CONFIG = {
  // Replace with your actual Gemini API key from https://aistudio.google.com/app/apikey
  GEMINI_API_KEY: 'YOUR_API_KEY_HERE',

  // Set to true to use the hardcoded key above instead of the extension settings
  USE_HARDCODED_KEY: false,

  // Model preferences (in order of priority)
  // These are tested in order until one works
  PREFERRED_MODELS: [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-002',
    'gemini-1.5-flash',
    'gemini-1.0-pro',
    'gemini-pro'
  ],

  // API settings
  API_TEMPERATURE: 0.7,        // 0-1, higher = more creative
  MAX_OUTPUT_TOKENS: 1024,     // Maximum response length

  // Enable console logging for debugging
  DEBUG_MODE: true
};

// Make config available to extension
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}