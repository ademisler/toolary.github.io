// Toolary GitHub Pages - Interactive Features
// Extension popup style with full page tools showcase

// Tool data from extension's tools-manifest.json
const toolsData = {
  "inspect": [
    {
      id: "color-picker",
      name: "Color Picker",
      description: "Extract colors from any webpage element with precision. Get hex, RGB, HSL values instantly.",
      icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      features: [
        "EyeDropper API integration",
        "Multiple color format support (HEX, RGB, HSL)",
        "One-click color copying",
        "Visual color preview",
        "Works on any website"
      ]
    },
    {
      id: "element-picker",
      name: "Element Picker",
      description: "Inspect DOM elements and their properties. Get CSS selectors, XPath, and element details.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      features: [
        "DOM element inspection",
        "CSS selector generation",
        "XPath extraction",
        "Element properties display",
        "HTML structure analysis"
      ]
    },
    {
      id: "link-picker",
      name: "Link Picker",
      description: "Validate and analyze links on web pages. Check for broken links and get link details.",
      icon: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
      features: [
        "Link validation",
        "Broken link detection",
        "Link analysis",
        "URL extraction",
        "Link status checking"
      ]
    },
    {
      id: "font-picker",
      name: "Font Finder",
      description: "Analyze fonts used on web pages. Get font family, size, weight, and style information.",
      icon: "M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z",
      features: [
        "Font family detection",
        "Font size analysis",
        "Font weight identification",
        "Font style detection",
        "Typography information"
      ]
    }
  ],
  "capture": [
    {
      id: "screenshot-picker",
      name: "Screenshot Picker",
      description: "Capture full page or selected area screenshots. Save and download with one click.",
      icon: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      features: [
        "Full page screenshots",
        "Visible area capture",
        "Selected area screenshots",
        "High-quality image output",
        "One-click download"
      ]
    },
    {
      id: "media-picker",
      name: "Media Download",
      description: "Extract and download images, videos, and other media from web pages.",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      features: [
        "Image extraction",
        "Video download",
        "Media file detection",
        "Bulk media download",
        "Format preservation"
      ]
    },
    {
      id: "text-picker",
      name: "Text Picker",
      description: "Extract and copy text content from web pages with formatting preservation.",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      features: [
        "Text extraction",
        "Formatting preservation",
        "Selective text picking",
        "One-click copying",
        "Clean text output"
      ]
    },
    {
      id: "pdf-generator",
      name: "PDF Generator",
      description: "Convert web pages to PDF documents with customizable options and high quality output.",
      icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
      features: [
        "Web page to PDF conversion",
        "High-quality output",
        "Customizable settings",
        "Full page capture",
        "Instant download"
      ]
    },
    {
      id: "qr-code-generator",
      name: "QR Code Generator",
      description: "Generate QR codes for URLs, text, or any content. Share links easily with mobile devices.",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z",
      features: [
        "URL QR code generation",
        "Text QR code creation",
        "Customizable QR codes",
        "High-resolution output",
        "Mobile-friendly sharing"
      ]
    },
    {
      id: "video-recorder",
      name: "Video Recorder",
      description: "Record screen activity and create video tutorials or demonstrations.",
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
      features: [
        "Screen recording",
        "Tab capture",
        "Audio recording",
        "Video format options",
        "Real-time preview"
      ]
    }
  ],
  "enhance": [
    {
      id: "sticky-notes-picker",
      name: "Sticky Notes",
      description: "Add persistent sticky notes to web pages. Your notes stay even after page refresh.",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      features: [
        "Persistent notes",
        "Per-site storage",
        "Drag and drop positioning",
        "Rich text formatting",
        "Note management"
      ]
    },
    {
      id: "reading-mode",
      name: "Reading Mode",
      description: "Clean, distraction-free reading experience. Remove ads and focus on content.",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      features: [
        "Distraction-free reading",
        "Ad removal",
        "Customizable typography",
        "Focus mode",
        "Content highlighting"
      ]
    },
    {
      id: "text-highlighter",
      name: "Text Highlighter",
      description: "Highlight important text on web pages with multiple colors and persistent storage.",
      icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
      features: [
        "Multi-color highlighting",
        "Persistent highlights",
        "Highlight management",
        "Export highlights",
        "Search within highlights"
      ]
    },
    {
      id: "bookmark-manager",
      name: "Bookmark Manager",
      description: "Advanced bookmark management with folders, tags, and search functionality.",
      icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
      features: [
        "Organized bookmarking",
        "Folder management",
        "Tag system",
        "Search functionality",
        "Import/export options"
      ]
    },
    {
      id: "dark-mode-toggle",
      name: "Dark Mode Toggle",
      description: "Toggle dark/light mode for any website. Customize the appearance to your preference.",
      icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
      features: [
        "Dark mode activation",
        "Light mode toggle",
        "Per-site preferences",
        "Smooth transitions",
        "Custom themes"
      ]
    }
  ],
  "utilities": [
    {
      id: "site-info-picker",
      name: "Site Info",
      description: "Comprehensive website analysis including tech stack, SEO, and performance metrics.",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      features: [
        "Tech stack analysis",
        "SEO metrics",
        "Performance data",
        "Accessibility scores",
        "Security information"
      ]
    },
    {
      id: "color-palette-generator",
      name: "Color Palette Generator",
      description: "Generate harmonious color palettes from images or create custom color schemes.",
      icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z",
      features: [
        "Image color extraction",
        "Harmony generation",
        "Accessibility checking",
        "Export options",
        "Color theory tools"
      ]
    },
    {
      id: "copy-history-manager",
      name: "Copy History Manager",
      description: "Track and manage clipboard history with tab-specific monitoring and quick access.",
      icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      features: [
        "Clipboard history tracking",
        "Tab-specific monitoring",
        "Quick access menu",
        "Search functionality",
        "Privacy controls"
      ]
    }
  ],
  "ai": [
    {
      id: "ai-text-summarizer",
      name: "AI Summarizer",
      description: "Intelligent text summarization with multiple length options and keyword extraction.",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      features: [
        "Intelligent summarization",
        "Multiple length options",
        "Keyword extraction",
        "Multi-language support",
        "Context-aware analysis"
      ]
    },
    {
      id: "ai-text-translator",
      name: "AI Translator",
      description: "Real-time translation with in-place page translation and 40+ language support.",
      icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
      features: [
        "Real-time translation",
        "In-place translation",
        "40+ language support",
        "Auto-detection",
        "Context preservation"
      ]
    },
    {
      id: "ai-content-detector",
      name: "AI Content Detector",
      description: "Detect AI-generated content with detailed analysis and confidence scoring.",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      features: [
        "AI content detection",
        "Confidence scoring",
        "Multi-metric analysis",
        "Inline highlighting",
        "Detailed reports"
      ]
    },
    {
      id: "ai-email-generator",
      name: "AI Email Generator",
      description: "Generate professional emails with customizable tone, type, and length options.",
      icon: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      features: [
        "Professional email generation",
        "Multiple tone options",
        "Email type templates",
        "Length customization",
        "Subject line generation"
      ]
    },
    {
      id: "ai-seo-analyzer",
      name: "AI SEO Analyzer",
      description: "Comprehensive SEO analysis with AI-powered scoring and optimization suggestions.",
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      features: [
        "SEO analysis",
        "AI-powered scoring",
        "Optimization suggestions",
        "Keyword analysis",
        "Performance metrics"
      ]
    },
    {
      id: "ai-chat",
      name: "AI Chat",
      description: "Intelligent conversational interface with persistent page context awareness.",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      features: [
        "Intelligent conversations",
        "Page context awareness",
        "Multi-turn dialogues",
        "Real-time responses",
        "Context preservation"
      ]
    }
  ]
};

// State management
let currentCategory = 'all';
let filteredTools = [];
let searchQuery = '';

// DOM elements
const toolsGrid = document.getElementById('tools-grid');
const searchInput = document.getElementById('tool-search');
const categoryMenuBtn = document.getElementById('category-menu-btn');
const categoryMenu = document.getElementById('category-menu');
const searchChips = document.getElementById('search-chips');
const searchResultCount = document.getElementById('search-result-count');
const toolModal = document.getElementById('tool-modal');
const toolModalTitle = document.getElementById('tool-modal-title');
const toolModalCategory = document.getElementById('tool-modal-category');
const toolModalDescription = document.getElementById('tool-modal-description');
const toolModalFeatures = document.getElementById('tool-modal-features');
const toolModalIcon = document.querySelector('.tool-modal-icon');
const toolModalClose = document.getElementById('tool-modal-close');
const toolModalCloseBtn = document.getElementById('tool-modal-close-btn');
const themeToggle = document.getElementById('theme-toggle');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeTools();
  initializeSearch();
  initializeCategoryMenu();
  initializeModal();
  initializeAnimations();
});

// Theme management
function initializeTheme() {
  const savedTheme = localStorage.getItem('toolary-theme') || 'system';
  applyTheme(savedTheme);
  
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('toolary-theme', newTheme);
  });
}

function applyTheme(theme) {
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark', prefersDark);
  } else {
    document.body.classList.toggle('dark', theme === 'dark');
  }
}

// Tools management
function initializeTools() {
  filteredTools = getAllTools();
  renderTools();
}

function getAllTools() {
  const allTools = [];
  Object.keys(toolsData).forEach(category => {
    toolsData[category].forEach(tool => {
      allTools.push({ ...tool, category });
    });
  });
  return allTools;
}

function filterTools() {
  let tools = getAllTools();
  
  // Filter by category
  if (currentCategory !== 'all') {
    tools = tools.filter(tool => tool.category === currentCategory);
  }
  
  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    tools = tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.features.some(feature => feature.toLowerCase().includes(query))
    );
  }
  
  filteredTools = tools;
  renderTools();
  updateSearchFeedback();
}

function renderTools() {
  toolsGrid.innerHTML = '';
  
  if (filteredTools.length === 0) {
    toolsGrid.innerHTML = `
      <div class="no-results">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <h3>No tools found</h3>
        <p>Try adjusting your search or category filter</p>
      </div>
    `;
    return;
  }
  
  filteredTools.forEach(tool => {
    const toolCard = createToolCard(tool);
    toolsGrid.appendChild(toolCard);
  });
  
  // Add animation classes
  setTimeout(() => {
    const cards = toolsGrid.querySelectorAll('.tool-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in', 'visible');
      }, index * 50);
    });
  }, 100);
}

function createToolCard(tool) {
  const card = document.createElement('div');
  card.className = 'tool-card';
  card.setAttribute('data-tool-id', tool.id);
  card.setAttribute('data-category', tool.category);
  
  card.innerHTML = `
    <div class="tool-card__icon">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="${tool.icon}"/>
      </svg>
    </div>
    <div class="tool-card__content">
      <h3 class="tool-card__title">${tool.name}</h3>
      <p class="tool-card__description">${tool.description}</p>
      <span class="tool-card__category">${tool.category}</span>
    </div>
  `;
  
  card.addEventListener('click', () => openToolModal(tool));
  
  return card;
}

// Search functionality
function initializeSearch() {
  searchInput.addEventListener('input', function() {
    searchQuery = this.value;
    filterTools();
  });
  
  // Clear search on escape
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      this.value = '';
      searchQuery = '';
      filterTools();
    }
  });
}

function updateSearchFeedback() {
  // Update search chips
  searchChips.innerHTML = '';
  
  if (currentCategory !== 'all') {
    const categoryChip = document.createElement('div');
    categoryChip.className = 'search-chip';
    categoryChip.innerHTML = `
      <span class="search-chip__label">Category:</span>
      <span class="search-chip__value">${currentCategory}</span>
    `;
    categoryChip.addEventListener('click', () => {
      currentCategory = 'all';
      categoryMenuBtn.querySelector('span').textContent = 'All Tools';
      filterTools();
    });
    searchChips.appendChild(categoryChip);
  }
  
  if (searchQuery.trim()) {
    const searchChip = document.createElement('div');
    searchChip.className = 'search-chip';
    searchChip.innerHTML = `
      <span class="search-chip__label">Search:</span>
      <span class="search-chip__value">${searchQuery}</span>
    `;
    searchChip.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      filterTools();
    });
    searchChips.appendChild(searchChip);
  }
  
  // Update result count
  searchResultCount.textContent = `${filteredTools.length} tool${filteredTools.length !== 1 ? 's' : ''} found`;
}

// Category menu
function initializeCategoryMenu() {
  categoryMenuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    categoryMenu.classList.toggle('show');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!categoryMenu.contains(e.target) && !categoryMenuBtn.contains(e.target)) {
      categoryMenu.classList.remove('show');
    }
  });
  
  // Handle category selection
  categoryMenu.addEventListener('click', function(e) {
    if (e.target.classList.contains('category-menu-item')) {
      const category = e.target.getAttribute('data-category');
      selectCategory(category);
      categoryMenu.classList.remove('show');
    }
  });
}

function selectCategory(category) {
  currentCategory = category;
  const categoryName = category === 'all' ? 'All Tools' : category.charAt(0).toUpperCase() + category.slice(1);
  categoryMenuBtn.querySelector('span').textContent = categoryName;
  filterTools();
}

// Modal functionality
function initializeModal() {
  toolModalClose.addEventListener('click', closeToolModal);
  toolModalCloseBtn.addEventListener('click', closeToolModal);
  
  // Close modal when clicking outside
  toolModal.addEventListener('click', function(e) {
    if (e.target === toolModal) {
      closeToolModal();
    }
  });
  
  // Close modal on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && toolModal.classList.contains('show')) {
      closeToolModal();
    }
  });
}

function openToolModal(tool) {
  toolModalTitle.textContent = tool.name;
  toolModalCategory.textContent = tool.category;
  toolModalDescription.textContent = tool.description;
  
  // Update icon
  toolModalIcon.innerHTML = `<path d="${tool.icon}"/>`;
  
  // Update features
  toolModalFeatures.innerHTML = '';
  tool.features.forEach(feature => {
    const li = document.createElement('li');
    li.textContent = feature;
    toolModalFeatures.appendChild(li);
  });
  
  toolModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeToolModal() {
  toolModal.classList.remove('show');
  document.body.style.overflow = '';
}

// Animations and scroll effects
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observe elements for scroll animations
  const animatedElements = document.querySelectorAll('.tool-card, .header, .search-bar');
  animatedElements.forEach(el => {
    observer.observe(el);
  });
  
  // Add hover effects to tool cards
  const toolCards = document.querySelectorAll('.tool-card');
  toolCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  // Focus management
  if (e.key === 'Tab') {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }
});

// Performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounce search input
searchInput.addEventListener('input', debounce(function() {
  searchQuery = this.value;
  filterTools();
}, 300));

// Add loading states
function showLoading() {
  toolsGrid.classList.add('loading');
}

function hideLoading() {
  toolsGrid.classList.remove('loading');
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('Toolary GitHub Pages Error:', e.error);
});

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed');
      });
  });
}
