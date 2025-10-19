// Test file for all picker modules
import { activate as activateColorPicker } from '../extension/tools/inspect/colorPicker.js';
import { activate as activateElementPicker } from '../extension/tools/inspect/elementPicker.js';
import { activate as activateScreenshotPicker } from '../extension/tools/capture/screenshotPicker.js';
import { activate as activateTextPicker } from '../extension/tools/capture/textPicker.js';
import { activate as activateLinkPicker } from '../extension/tools/inspect/linkPicker.js';
import { activate as activateFontPicker } from '../extension/tools/inspect/fontPicker.js';
import { activate as activateMediaPicker } from '../extension/tools/capture/mediaPicker.js';
import { activate as activateSiteInfoPicker } from '../extension/tools/utilities/siteInfoPicker.js';
import { activate as activateStickyNotesPicker } from '../extension/tools/enhance/stickyNotesPicker.js';
import { activate as activateColorPaletteGenerator, metadata as colorPaletteMetadata } from '../extension/tools/utilities/colorPaletteGenerator.js';
import { activate as activatePdfGenerator, metadata as pdfGeneratorMetadata } from '../extension/tools/capture/pdfGenerator.js';

describe('Picker Modules', () => {
  
  describe('Color Picker', () => {
    test('should activate color picker', () => {
      const mockDeactivate = jest.fn();
      activateColorPicker(mockDeactivate);
      
      // Should not throw errors
      expect(() => activateColorPicker(mockDeactivate)).not.toThrow();
    });
  });

  describe('Element Picker', () => {
    test('should activate element picker', () => {
      const mockDeactivate = jest.fn();
      activateElementPicker(mockDeactivate);
      
      // Should not throw errors
      expect(() => activateElementPicker(mockDeactivate)).not.toThrow();
    });
  });

  describe('Screenshot Picker', () => {
    test('should activate screenshot picker', () => {
      const mockDeactivate = jest.fn();
      activateScreenshotPicker(mockDeactivate);
      
      // Should not throw errors
      expect(() => activateScreenshotPicker(mockDeactivate)).not.toThrow();
    });
  });

  describe('Text Picker', () => {
    test('should activate text picker', () => {
      const mockDeactivate = jest.fn();
      activateTextPicker(mockDeactivate);
      
      // Should not throw errors
      expect(() => activateTextPicker(mockDeactivate)).not.toThrow();
    });
  });

  describe('Link Picker', () => {
    test('should activate link picker', () => {
      const mockDeactivate = jest.fn();
      activateLinkPicker(mockDeactivate);
      
      // Should not throw errors
      expect(() => activateLinkPicker(mockDeactivate)).not.toThrow();
    });
  });

  describe('Font Picker', () => {
    test('should activate font picker', () => {
      const mockDeactivate = jest.fn();
      activateFontPicker(mockDeactivate);
      
      // Should not throw errors
      expect(() => activateFontPicker(mockDeactivate)).not.toThrow();
    });
  });

  describe('Media Picker', () => {
    test('should activate media picker', () => {
      const mockDeactivate = jest.fn();
      activateMediaPicker(mockDeactivate);
      
      // Should not throw errors
      expect(() => activateMediaPicker(mockDeactivate)).not.toThrow();
    });
  });

  describe('Site Info Picker', () => {
    test('should activate site info picker', () => {
      const mockDeactivate = jest.fn();
      activateSiteInfoPicker(mockDeactivate);
      
      // Should not throw errors
      expect(() => activateSiteInfoPicker(mockDeactivate)).not.toThrow();
    });
  });

  describe('Sticky Notes Picker', () => {
    test('should activate sticky notes picker', () => {
      const mockDeactivate = jest.fn();
      activateStickyNotesPicker(mockDeactivate);
      
      // Should not throw errors
      expect(() => activateStickyNotesPicker(mockDeactivate)).not.toThrow();
    });
  });

  describe('Color Palette Generator', () => {
    test('should activate color palette generator', () => {
      const mockDeactivate = jest.fn();
      activateColorPaletteGenerator(mockDeactivate);
      
      // Should not throw errors
      expect(() => activateColorPaletteGenerator(mockDeactivate)).not.toThrow();
    });
    
    test('should export metadata', () => {
      expect(colorPaletteMetadata).toBeDefined();
      expect(colorPaletteMetadata.id).toBe('color-palette-generator');
      expect(colorPaletteMetadata.category).toBe('utilities');
    });
  });

  describe('PDF Generator', () => {
    test('should activate pdf generator', () => {
      const mockDeactivate = jest.fn();
      activatePdfGenerator(mockDeactivate);
      
      // Should not throw errors
      expect(() => activatePdfGenerator(mockDeactivate)).not.toThrow();
    });
    
    test('should export metadata', () => {
      expect(pdfGeneratorMetadata).toBeDefined();
      expect(pdfGeneratorMetadata.id).toBe('pdf-generator');
      expect(pdfGeneratorMetadata.category).toBe('capture');
    });
  });

});
