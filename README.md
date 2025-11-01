# Smart Reply Assistant 💬

**AI-powered reply suggestions and summarization for Reddit, Twitter, LinkedIn, and any webpage.**

Smart Reply Assistant is a Chrome extension that uses AI to read and understand posts/articles, then generates intelligent reply suggestions in multiple styles (supportive, questions, counter-arguments, professional) and provides concise summaries.

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 The Problem

Every day, we read countless posts, tweets, and articles online. Coming up with thoughtful, relevant replies takes time and mental effort. Sometimes we want to engage but don't know what to say, or we need to quickly understand long content without reading everything.

## ✨ Features

### 📖 Smart Content Extraction
- **Auto-detects content** on Reddit, Twitter/X, LinkedIn, news sites
- **Platform-aware** extraction for optimal results
- **Fallback support** for any webpage with text

### 💬 Multiple Reply Styles
Generate 3 reply suggestions in each style:
- **👍 Supportive** - Encouraging and positive responses
- **❓ Questions** - Thoughtful questions for deeper engagement
- **🎯 Counter** - Respectful counter-arguments and alternative views
- **💼 Professional** - Formal, business-appropriate responses

### 📝 Instant Summarization
- Get 2-3 sentence summaries of any content
- Perfect for long articles or posts
- Captures key points quickly

### 🎨 Beautiful UI
- Clean, modern popup interface
- One-click content analysis
- Easy copy buttons for each suggestion
- Platform indicator shows current site

### 🔒 Privacy First
- Uses Gemini API for AI processing
- No content stored permanently
- API key stored locally in browser

## 🚀 Quick Start

### Installation

1. **Clone this repository:**
   ```bash
   git clone https://github.com/yourusername/smart-reply-assistant.git
   cd smart-reply-assistant
   ```

2. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the folder containing the extension
   - The extension is now installed!

3. **Configure API Key:**
   - Get a free API key from https://aistudio.google.com/app/apikey
   - Click the Smart Reply icon in Chrome toolbar
   - Scroll to Settings
   - Paste your API key and click Save

### Usage

1. **Navigate to any supported site:**
   - Reddit posts/comments
   - Twitter/X tweets
   - LinkedIn posts
   - News articles
   - Any webpage with text

2. **Click the Smart Reply icon** in your toolbar

3. **Click "📖 Analyze Current Page"**
   - Extension extracts the main content
   - Shows preview of detected text

4. **Choose an action:**
   - **📝 Summarize** - Get a quick summary
   - **💬 Generate Replies** - Create reply suggestions

5. **For replies, select a style:**
   - Supportive, Questions, Counter, or Professional
   - Get 3 unique suggestions for each style

6. **Copy any suggestion** with one click!

## 🛠️ Technical Details

### Architecture
- **Manifest V3** Chrome extension
- **Popup-based UI** for clean user experience
- **Gemini AI API** for content generation
- **Platform-specific selectors** for content extraction

### Supported Platforms
- **Reddit**: Posts and comments
- **Twitter/X**: Tweets and threads
- **LinkedIn**: Feed posts and articles
- **News Sites**: Articles with standard markup
- **Generic**: Any webpage with text content

### AI Models
- **Primary**: Gemini 1.5 Flash (fast, efficient)
- **Fallback**: Gemini 1.5 Pro (if Flash unavailable)
- **Temperature**: 0.7 for balanced creativity

## 📋 File Structure

```
smart-reply-assistant/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── popup/
│   ├── popup.html        # Popup interface
│   ├── popup.css         # Popup styles
│   └── popup.js          # Main logic
└── icons/                # Extension icons
```

## 🎯 Use Cases

- **Social Media Engagement**: Quickly reply to posts and tweets
- **Professional Networking**: Generate thoughtful LinkedIn responses
- **News Commentary**: Add intelligent comments to articles
- **Discussion Forums**: Participate in debates with well-formed arguments
- **Quick Understanding**: Summarize long content instantly

## 🧪 Testing

### Test on Different Sites
1. **Reddit**: Go to any post, analyze, generate replies
2. **Twitter**: Navigate to a tweet, test all reply styles
3. **LinkedIn**: Find a professional post, use professional style
4. **News**: Open an article, test summarization

### Sample Test Flow
1. Open https://reddit.com/r/technology
2. Click on any post
3. Click Smart Reply icon
4. Click "Analyze Current Page"
5. Try both Summarize and Generate Replies
6. Test each reply style
7. Copy suggestions to verify they work

## 🚀 Roadmap

- [ ] Auto-detect selected text for partial analysis
- [ ] Save favorite replies for reuse
- [ ] Tone adjustment slider
- [ ] Multi-language support
- [ ] Batch processing for multiple posts
- [ ] Integration with comment boxes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Built For

Google Chrome Built-in AI Challenge 2025

**Category:** Most Helpful Chrome Extension

**APIs Used:** Chrome Extension APIs, Gemini API

## 🙏 Acknowledgments

- Built with Chrome Extension Manifest V3
- Powered by Google's Gemini AI
- Inspired by the need for better online communication

## 📧 Contact

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Email**: your.email@example.com

---

**Made with ❤️ for smarter online conversations.**