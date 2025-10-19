# 🛠️ Toolary - New Tools Roadmap

> Planning and tracking document for new tools to be added to the Toolary Chrome extension.

## 📊 General Status

- **Current Tools:** 12
- **Planned Tools:** 7
- **Total Target:** 19+ tools
- **Last Updated:** 2025-01-27

---

## Upcoming Tools


#### 1. **AI Text Summarizer** 🤖
- **Category:** AI
- **Status:** Planning
- **Description:** Summarizes page content using AI, offers different length options
- **Features:**
  - Short/medium/long summary options
  - Extracts keywords
  - Multi-language support
  - Export options (text, PDF)
- **Technical Requirements:** Gemini AI API

#### 2. **Reading Mode** ✨
- **Category:** Enhance
- **Status:** Planning
- **Description:** Cleans page content, improves reading experience
- **Features:**
  - Hides distracting elements
  - Adjusts font size and type
  - Dark/Light mode toggle
  - Customizable theme
- **Technical Requirements:** CSS manipulation, DOM filtering

#### 3. **Color Palette Generator** 🎨
- **Category:** Utilities
- **Status:** Completed
- **Description:** Automatically generates color palettes from page colors
- **Features:**
  - Analyzes page colors
  - Harmonic color combinations
  - Export options (CSS, JSON)
  - Color contrast checking
  - WCAG accessibility scores
- **Technical Requirements:** Canvas API, color analysis algorithms
- **Completed:** 2025-01-27

#### 4. **PDF Generator** 📄
- **Category:** Capture
- **Status:** Completed
- **Description:** Saves page as PDF
- **Features:**
  - Full-page capture with automatic scrolling
  - A4 paper size (210mm x 297mm) with standard margins
  - Automatic page splitting for long content
  - Metadata: URL, title, timestamp as PDF properties
  - Progress indicator during capture
  - Medium quality (balance between file size 1-2MB and clarity)
  - Filename: `toolary-pdf-{domain}-{timestamp}.pdf`
- **Technical Requirements:** Chrome tabs.printToPDF API, full-page screenshot capture
- **Completed:** 2025-01-27

#### 5. **Text Highlighter** 🖍️
- **Category:** Enhance
- **Status:** Completed
- **Description:** Highlights text with colors and persistent storage
- **Features:**
  - 5-color palette (Yellow, Green, Blue, Pink, Orange)
  - Site-based persistent storage
  - Right-click context menu for removal
  - Works with all HTML elements (headings, lists, tables, etc.)
  - React/Next.js compatibility with DOM watching
  - Keyboard shortcut (Alt+Shift+7)
- **Technical Requirements:** Range API, XPath serialization, MutationObserver, chrome.storage.local
- **Completed:** 2025-01-27

#### 6. **AI Code Explainer** 💻
- **Category:** AI
- **Status:** Planning
- **Description:** Explains and optimizes code on the page
- **Features:**
  - JavaScript/CSS code analysis
  - Code optimization suggestions
  - Error detection
  - Documentation generation
- **Technical Requirements:** Code parsing, Gemini AI API

#### 7. **AI SEO Optimizer** 🔍
- **Category:** AI
- **Status:** Planning
- **Description:** Analyzes and improves page SEO score
- **Features:**
  - Meta tag analysis
  - Keyword optimization
  - Content improvement suggestions
  - SEO score report
- **Technical Requirements:** SEO analysis algorithms, Gemini AI API
- **Estimated Time:** 4-5 weeks

#### 8. **Video Recorder** 🎥
- **Category:** Capture
- **Status:** Planning
- **Description:** Records page interactions
- **Features:**
  - Screen recording with WebRTC
  - Annotation and marking
  - Audio recording support
  - Export options
- **Technical Requirements:** MediaRecorder API, WebRTC

#### 9. **QR Code Generator** 📱
- **Category:** Capture
- **Status:** Planning
- **Description:** Converts page URL to QR code
- **Features:**
  - Customizable QR code design
  - Batch QR code generation
  - Logo addition
  - Different formats (PNG, SVG, PDF)
- **Technical Requirements:** QR code library, Canvas API

#### 10. **Bookmark Manager** 🔖
- **Category:** Enhance
- **Status:** Planning
- **Description:** Advanced bookmark management
- **Features:**
  - Tag system
  - Search and filtering
  - Categories
  - Import/export
- **Technical Requirements:** Chrome bookmarks API, storage

---

## 📋 Implementation Checklist

### For Each Tool:
- [ ] Create tool module (`tools/<category>/<toolName>.js`)
- [ ] Add to `tools-manifest.json`
- [ ] Create icon (`icons/tools/<toolName>.svg`)
- [ ] Add i18n strings (`_locales/*/messages.json`)
- [ ] Add keyboard shortcut (optional)
- [ ] Write tests (`test/modules.test.js`)
- [ ] Update documentation

### Category Updates:
- [ ] Add AI category to `core/constants.js`
- [ ] Add AI category button to `popup/popup.html`
- [ ] Create icon for AI category

---

## 🎨 AI Category Details

### Category Information:
```json
{
  "id": "ai",
  "name": "AI",
  "description": "Artificial intelligence powered tools for content analysis and generation.",
  "order": 5,
  "icon": "ai"
}
```

---

## 📊 Progress Tracking

| Tool | Status | Start | End | Developer | Notes |
|------|--------|-------|-----|-----------|-------|
| AI Text Summarizer | Planning | - | - | - | - |
| Reading Mode | Planning | - | - | - | - |
| Color Palette Generator | Completed | 2025-01-27 | 2025-01-27 | AI Assistant | Full implementation with WCAG scores |
| PDF Generator | Completed | 2025-01-27 | 2025-01-27 | AI Assistant | Full-page PDF with metadata |
| Text Highlighter | Completed | 2025-01-27 | 2025-01-27 | AI Assistant | All HTML elements, React/Next.js compatible |
| AI Code Explainer | Planning | - | - | - | - |
| AI SEO Optimizer | Planning | - | - | - | - |
| Video Recorder | Planning | - | - | - | - |
| QR Code Generator | Planning | - | - | - | - |
| Bookmark Manager | Planning | - | - | - | - |

---

*This file was created to track the development process of the Toolary extension. New tool ideas and updates can be added here.*
