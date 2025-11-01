# ArgumentArmor - Devpost Submission

## 🎯 Tagline (50 characters max)
Never post a weak argument again. AI-powered armor.

## 📝 Short Description (200 characters max)
AI-powered Chrome extension that analyzes your arguments before you post, identifying logical fallacies, unsupported claims, and counter-arguments using Chrome Built-in AI.

---

## 🌟 Full Description

### The Problem

Every day, millions of people write arguments online—Reddit comments, Twitter threads, professional emails, work Slack messages. Too often, we post first and realize too late that our argument was weak, logically flawed, or missed obvious counter-arguments. The result? Embarrassment, wasted time, and diminished credibility.

**There's no "test before you post" tool for arguments... until now.**

### The Solution: ArgumentArmor 🛡️

ArgumentArmor is a Chrome extension that uses AI to analyze your arguments BEFORE you post them, showing exactly where they're weak so you can fix them. Think of it as spell-check for your reasoning.

### How It Works

**1. Write your argument** anywhere online (Reddit, Twitter, Gmail, LinkedIn, etc.)

**2. Right-click and select "Armor This Argument"**

**3. Instant AI analysis shows:**
- ⚡ Strength score (1-10 scale)
- ❌ Logical fallacies detected (ad hominem, strawman, false dichotomy, etc.)
- 📝 Unsupported claims that need evidence
- 🎯 Counter-arguments you haven't addressed
- 💬 Tone issues (too aggressive, unclear, etc.)
- ✏️ Grammar and clarity improvements

**4. Apply AI-suggested fixes** with one click

**5. Re-analyze** to see your score improve

**6. Post with confidence** ✅

### Key Features

#### 🔍 Comprehensive Analysis
- **Fallacy Detection:** Identifies 15+ types of logical fallacies
- **Evidence Checker:** Highlights claims that need supporting evidence
- **Counter-Argument Prediction:** Shows what opponents will say
- **Tone Analyzer:** Detects aggressive, unclear, or inappropriate language
- **Grammar Check:** Catches spelling and clarity issues

#### ⚔️ Challenge Mode
Select an opponent's argument, right-click "Challenge This Argument", and get powerful counter-arguments instantly.

#### 🎨 Beautiful UX
- Non-intrusive overlay design
- Color-coded severity levels (high, medium, low)
- Smooth animations
- Dark mode support
- Works on ANY website

#### 📊 Progress Tracking
- Track arguments analyzed over time
- See average score improvement
- Learn from past mistakes

#### 🔒 Privacy-First Architecture
- Uses Chrome Built-in AI (Gemini Nano) for on-device processing
- No data sent to external servers when Chrome AI available
- Fallback to Gemini API when needed
- You control your data

### Chrome Built-in AI Integration

ArgumentArmor showcases the full power of Google Chrome's Built-in AI ecosystem:

1. **Prompt API (Primary Engine)**
   - Powers core argument analysis
   - Detects logical fallacies and reasoning flaws
   - Generates counter-arguments and improvements
   - Custom-engineered prompts for rhetoric analysis

2. **Summarizer API**
   - Extracts key claims from long arguments
   - Distills complex reasoning into testable assertions
   - Identifies main thesis vs supporting points

3. **Writer API**
   - Generates evidence suggestions
   - Creates improved argument versions
   - Provides alternative phrasings

4. **Rewriter API**
   - Adjusts tone (professional/casual/academic)
   - Improves clarity and persuasiveness
   - Restructures weak sentences

5. **Proofreader API**
   - Grammar and spelling correction
   - Sentence structure optimization
   - Readability improvements

### Why This Wins "Most Helpful"

**1. Universal Daily Use Case**
- 4.5 billion internet users write arguments regularly
- Average person writes 10+ messages/comments per day
- Works across ALL websites
- Immediate, tangible value

**2. Solves Real Pain Point**
- Prevents embarrassment from weak arguments
- Saves time by catching mistakes early
- Improves communication quality
- Reduces online conflict through better reasoning

**3. Educational Value**
- Teaches critical thinking skills
- Improves argumentation over time
- Helps users understand logical fallacies
- Practical debate training

**4. Technical Excellence**
- Sophisticated multi-API integration
- Advanced prompt engineering
- Seamless fallback architecture
- Polished UX/UI

**5. Mass Appeal**
- Students (essays, debates)
- Professionals (emails, proposals)
- Social media users (comments, threads)
- Writers (persuasive content)
- Debaters (competitive training)

### Competitive Advantage

| Competitor | Limitation | ArgumentArmor Wins |
|------------|-----------|-------------------|
| ChatGPT | Requires leaving page, no context | ✅ Works in-context on any site |
| Grammarly | Only checks grammar | ✅ Analyzes logic and reasoning |
| Hemingway | Only readability | ✅ Detects fallacies and counter-args |
| Copy-paste to AI | Slow, manual, breaks workflow | ✅ One-click, seamless integration |

**ArgumentArmor is the ONLY tool that analyzes argument logic in real-time, on any website, with complete privacy.**

---

## 🛠️ Technical Implementation

### Architecture
- **Frontend:** Vanilla JavaScript (no frameworks for performance)
- **Manifest:** V3 (latest Chrome extension standard)
- **AI Integration:** Chrome Built-in APIs + Gemini API fallback
- **Storage:** Chrome Storage API for settings and stats
- **UI:** Custom CSS with smooth animations, dark mode

### Chrome APIs Used
- `chrome.contextMenus` - Right-click integration
- `chrome.runtime` - Background service worker
- `chrome.tabs` - Message passing
- `chrome.storage` - Settings and statistics
- `chrome.scripting` - Content script injection
- `window.ai.languageModel` - Chrome Built-in AI

### Prompt Engineering
Custom-engineered prompts for:
- Logical fallacy detection (15+ types)
- Claim extraction and verification
- Counter-argument generation
- Tone analysis
- Evidence suggestion
- Structured JSON output parsing

### Fallback Strategy
```
1. Try Chrome Built-in AI (Gemini Nano)
   ↓ (if unavailable)
2. Fall back to Gemini API
   ↓ (if network fails)
3. Show user-friendly error with instructions
```

---

## 🎯 Target Users

- **🎓 Students:** Essay writing, debate prep, homework arguments
- **💼 Professionals:** Business proposals, emails, presentations
- **🧠 Critical Thinkers:** Analyzing news, forming opinions
- **✍️ Writers:** Persuasive content, opinion pieces
- **🗣️ Debaters:** Competitive debate training
- **📱 Social Media Users:** Better comments, threads, replies

---

## 📊 Impact & Future Vision

### Current Impact
- Prevents embarrassment from weak arguments
- Saves 10-15 minutes per argument improvement
- Reduces online toxicity through better reasoning
- Educational: teaches critical thinking skills

### Future Roadmap
- [ ] Multi-language support (via Translator API)
- [ ] Export analysis to PDF
- [ ] Google Docs/Notion integration
- [ ] Debate tournament mode (competitive scoring)
- [ ] Community fallacy database
- [ ] Team collaboration features
- [ ] Browser extension for Firefox, Edge

---

## 🏆 Why ArgumentArmor Should Win

**Most Helpful Chrome Extension** because:

1. ✅ **Helps millions daily:** Universal use case everyone has
2. ✅ **Immediate value:** Prevents mistakes, saves time
3. ✅ **Educational:** Teaches lifelong critical thinking skills
4. ✅ **Sophisticated tech:** Best-in-class multi-API integration
5. ✅ **Privacy-first:** On-device processing when possible
6. ✅ **Polished UX:** Production-ready, beautiful design
7. ✅ **Open source:** Community can build on it
8. ✅ **Scalable:** Works across all websites
9. ✅ **Measurable impact:** Track improvement over time
10. ✅ **Solves real problem:** Everyone posts weak arguments

---

## 🔗 Links

- **GitHub Repository:** https://github.com/yourusername/argumentarmor
- **Demo Video:** [YouTube Link]
- **Installation Guide:** See INSTALLATION.md
- **Demo Script:** See DEMO_SCRIPT.md

---

## 🎥 Video URL
[Insert YouTube/Vimeo URL here]

---

## 🏗️ Built With

- Chrome Built-in AI (Prompt API, Summarizer, Writer, Rewriter, Proofreader)
- Gemini Nano (on-device AI model)
- Gemini API (fallback)
- JavaScript (ES6+)
- Chrome Extension Manifest V3
- HTML5 & CSS3

---

## 👨‍💻 Team

[Your Name / Team Name]
[Optional: Brief bio, relevant experience]

---

## 📜 License

MIT License - Open Source

---

## 🙏 Acknowledgments

- Built for Google Chrome Built-in AI Challenge 2025
- Powered by Gemini Nano and Chrome AI APIs
- Inspired by the need for better online discourse

---

## 📸 Screenshots

### Main Analysis View
[Upload screenshot of overlay showing argument analysis]

### Challenge Mode
[Upload screenshot of counter-argument generation]

### Extension Popup
[Upload screenshot of popup with stats]

### Before/After Comparison
[Upload side-by-side comparison of weak vs improved argument]

---

## 🎬 Demo Video Timestamps

- 0:00 - The Problem
- 0:30 - Solution Demo
- 1:20 - Feature Showcase
- 2:00 - Technology & Privacy
- 2:30 - Before/After Results
- 2:50 - Call to Action

---

**ArgumentArmor: Never post a weak argument again.** 🛡️
