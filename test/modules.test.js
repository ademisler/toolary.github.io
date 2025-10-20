// Test file for all picker modules
describe('Picker Modules', () => {
  
  describe('Color Picker', () => {
    test('should activate color picker', async () => {
      const { activate } = await import('../extension/tools/inspect/colorPicker.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });
  });

  describe('Element Picker', () => {
    test('should activate element picker', async () => {
      const { activate } = await import('../extension/tools/inspect/elementPicker.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });
  });

  describe('Screenshot Picker', () => {
    test('should activate screenshot picker', async () => {
      const { activate } = await import('../extension/tools/capture/screenshotPicker.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });
  });

  describe('Text Picker', () => {
    test('should activate text picker', async () => {
      const { activate } = await import('../extension/tools/capture/textPicker.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });
  });

  describe('Link Picker', () => {
    test('should activate link picker', async () => {
      const { activate } = await import('../extension/tools/inspect/linkPicker.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });
  });

  describe('Font Picker', () => {
    test('should activate font picker', async () => {
      const { activate } = await import('../extension/tools/inspect/fontPicker.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });
  });

  describe('Media Picker', () => {
    test('should activate media picker', async () => {
      const { activate } = await import('../extension/tools/capture/mediaPicker.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });
  });

  describe('Site Info Picker', () => {
    test('should activate site info picker', async () => {
      const { activate } = await import('../extension/tools/utilities/siteInfoPicker.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });
  });

  describe('Sticky Notes Picker', () => {
    test('should activate sticky notes picker', async () => {
      const { activate } = await import('../extension/tools/enhance/stickyNotesPicker.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });
  });

  describe('Color Palette Generator', () => {
    test('should activate color palette generator', async () => {
      const { activate } = await import('../extension/tools/utilities/colorPaletteGenerator.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });

    test('should have correct metadata', async () => {
      const { metadata } = await import('../extension/tools/utilities/colorPaletteGenerator.js');
      
      expect(metadata).toBeDefined();
      expect(metadata.id).toBe('color-palette-generator');
      expect(metadata.name).toBe('Color Palette Generator');
      expect(metadata.category).toBe('utilities');
    });
  });

  describe('PDF Generator', () => {
    test('should activate PDF generator', async () => {
      const { activate } = await import('../extension/tools/capture/pdfGenerator.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });

    test('should have correct metadata', async () => {
      const { metadata } = await import('../extension/tools/capture/pdfGenerator.js');
      
      expect(metadata).toBeDefined();
      expect(metadata.id).toBe('pdf-generator');
      expect(metadata.name).toBe('PDF Generator');
      expect(metadata.category).toBe('capture');
    });
  });

  describe('Text Highlighter', () => {
    test('should activate text highlighter', async () => {
      const { activate } = await import('../extension/tools/enhance/textHighlighter.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });

    test('should have correct metadata', async () => {
      const { metadata } = await import('../extension/tools/enhance/textHighlighter.js');
      
      expect(metadata).toBeDefined();
      expect(metadata.id).toBe('text-highlighter');
      expect(metadata.name).toBe('Text Highlighter');
      expect(metadata.category).toBe('enhance');
    });
  });

  describe('QR Code Generator', () => {
    test('should activate QR code generator', async () => {
      const { activate } = await import('../extension/tools/capture/qrCodeGenerator.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });

    test('should have correct metadata', async () => {
      const { metadata } = await import('../extension/tools/capture/qrCodeGenerator.js');
      
      expect(metadata).toBeDefined();
      expect(metadata.id).toBe('qr-code-generator');
      expect(metadata.name).toBe('QR Code Generator');
      expect(metadata.category).toBe('capture');
    });
  });

  describe('Bookmark Manager', () => {
    test('should activate bookmark manager', async () => {
      const { activate } = await import('../extension/tools/enhance/bookmarkManager.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });

    test('should have correct metadata', async () => {
      const { metadata } = await import('../extension/tools/enhance/bookmarkManager.js');
      
      expect(metadata).toBeDefined();
      expect(metadata.id).toBe('bookmark-manager');
      expect(metadata.name).toBe('Bookmark Manager');
      expect(metadata.category).toBe('enhance');
    });
  });

  describe('Video Recorder', () => {
    test('should activate video recorder', async () => {
      const { activate } = await import('../extension/tools/capture/videoRecorder.js');
      const mockDeactivate = jest.fn();
      
      expect(() => activate(mockDeactivate)).not.toThrow();
    });

    test('should have correct metadata', async () => {
      const { metadata } = await import('../extension/tools/capture/videoRecorder.js');
      
      expect(metadata).toBeDefined();
      expect(metadata.id).toBe('video-recorder');
      expect(metadata.name).toBe('Video Recorder');
      expect(metadata.category).toBe('capture');
    });
  });

  describe('Dark Mode Toggle', () => {
    let darkModeModule;

    beforeAll(async () => {
      darkModeModule = await import('../extension/tools/enhance/darkModeToggle.js');
    });

    test('should activate dark mode toggle', () => {
      const mockDeactivate = jest.fn();
      
      expect(() => darkModeModule.activate(mockDeactivate)).not.toThrow();
    });

    test('should have correct metadata', () => {
      expect(darkModeModule.metadata).toBeDefined();
      expect(darkModeModule.metadata.id).toBe('dark-mode-toggle');
      expect(darkModeModule.metadata.name).toBe('Dark Mode Toggle');
      expect(darkModeModule.metadata.category).toBe('enhance');
    });
  });

  describe('AI Text Summarizer', () => {
    let textSummarizerModule;

    beforeAll(async () => {
      textSummarizerModule = await import('../extension/tools/ai/textSummarizer.js');
    });

    test('should activate AI text summarizer', async () => {
      const mockDeactivate = jest.fn();
      
      expect(() => textSummarizerModule.activate(mockDeactivate)).not.toThrow();
    });

    test('should have correct metadata', () => {
      expect(textSummarizerModule.metadata).toBeDefined();
      expect(textSummarizerModule.metadata.id).toBe('ai-text-summarizer');
      expect(textSummarizerModule.metadata.name).toBe('AI Summarizer');
      expect(textSummarizerModule.metadata.category).toBe('ai');
      expect(textSummarizerModule.metadata.icon).toBe('brain');
    });
  });

  describe('AI Text Translator', () => {
    let textTranslatorModule;

    beforeAll(async () => {
      textTranslatorModule = await import('../extension/tools/ai/textTranslator.js');
    });

    test('should activate AI text translator', async () => {
      const mockDeactivate = jest.fn();
      
      expect(() => textTranslatorModule.activate(mockDeactivate)).not.toThrow();
    });

    test('should have correct metadata', () => {
      expect(textTranslatorModule.metadata).toBeDefined();
      expect(textTranslatorModule.metadata.id).toBe('ai-text-translator');
      expect(textTranslatorModule.metadata.name).toBe('AI Translator');
      expect(textTranslatorModule.metadata.category).toBe('ai');
      expect(textTranslatorModule.metadata.icon).toBe('languages');
    });

    test('should deactivate without errors', () => {
      expect(() => textTranslatorModule.deactivate()).not.toThrow();
    });
  });

  describe('AI Content Detector', () => {
    let contentDetectorModule;

    beforeAll(async () => {
      contentDetectorModule = await import('../extension/tools/ai/contentDetector.js');
    });

    test('should have correct metadata', () => {
      expect(contentDetectorModule.metadata).toBeDefined();
      expect(contentDetectorModule.metadata.id).toBe('ai-content-detector');
      expect(contentDetectorModule.metadata.name).toBe('AI Content Detector');
      expect(contentDetectorModule.metadata.category).toBe('ai');
      expect(contentDetectorModule.metadata.icon).toBe('sparkles');
    });

    test('should deactivate without errors', () => {
      expect(() => contentDetectorModule.deactivate()).not.toThrow();
    });
  });

  describe('AI Email Generator', () => {
    let emailGeneratorModule;

    beforeAll(async () => {
      emailGeneratorModule = await import('../extension/tools/ai/emailGenerator.js');
    });

    test('should have correct metadata', () => {
      expect(emailGeneratorModule.metadata).toBeDefined();
      expect(emailGeneratorModule.metadata.id).toBe('ai-email-generator');
      expect(emailGeneratorModule.metadata.name).toBe('AI Email Generator');
      expect(emailGeneratorModule.metadata.category).toBe('ai');
      expect(emailGeneratorModule.metadata.icon).toBe('email');
    });

    test('should deactivate without errors', () => {
      expect(() => emailGeneratorModule.deactivate()).not.toThrow();
    });
  });

  describe('AI SEO Analyzer', () => {
    let seoAnalyzerModule;

    beforeAll(async () => {
      seoAnalyzerModule = await import('../extension/tools/ai/seoAnalyzer.js');
    });

    test('should have correct metadata', () => {
      expect(seoAnalyzerModule.metadata).toBeDefined();
      expect(seoAnalyzerModule.metadata.id).toBe('ai-seo-analyzer');
      expect(seoAnalyzerModule.metadata.name).toBe('AI SEO Analyzer');
      expect(seoAnalyzerModule.metadata.category).toBe('ai');
      expect(seoAnalyzerModule.metadata.icon).toBe('search-check');
    });

    test('should deactivate without errors', () => {
      expect(() => seoAnalyzerModule.deactivate()).not.toThrow();
    });
  });

  describe('AI Chat', () => {
    let aiChatModule;

    beforeAll(async () => {
      aiChatModule = await import('../extension/tools/ai/aiChat.js');
    });

    test('should have correct metadata', () => {
      expect(aiChatModule.metadata).toBeDefined();
      expect(aiChatModule.metadata.id).toBe('ai-chat');
      expect(aiChatModule.metadata.name).toBe('AI Chat');
      expect(aiChatModule.metadata.category).toBe('ai');
      expect(aiChatModule.metadata.icon).toBe('message');
    });

    test('should deactivate without errors', () => {
      expect(() => aiChatModule.deactivate()).not.toThrow();
    });
  });

  describe('Copy History Manager', () => {
    let copyHistoryManagerModule;

    beforeAll(async () => {
      copyHistoryManagerModule = await import('../extension/tools/utilities/copyHistoryManager.js');
    });

    test('should activate copy history manager', async () => {
      const mockDeactivate = jest.fn();
      
      expect(() => copyHistoryManagerModule.activate(mockDeactivate)).not.toThrow();
    });

    test('should have correct metadata', () => {
      expect(copyHistoryManagerModule.metadata).toBeDefined();
      expect(copyHistoryManagerModule.metadata.id).toBe('copy-history-manager');
      expect(copyHistoryManagerModule.metadata.name).toBe('Copy History Manager');
      expect(copyHistoryManagerModule.metadata.category).toBe('utilities');
      expect(copyHistoryManagerModule.metadata.icon).toBe('clipboard-list');
    });

    test('should deactivate without errors', () => {
      expect(() => copyHistoryManagerModule.deactivate()).not.toThrow();
    });
  });
});