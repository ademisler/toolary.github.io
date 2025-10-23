import * as messageRouter from './core/messageRouter.js';
import * as toolRegistry from './core/toolRegistry.js';

const injectedTabs = new Set();

async function ensureContentScriptInjected(tabId) {
  if (injectedTabs.has(tabId)) {
    return true;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content/content.js']
    });
    injectedTabs.add(tabId);
    return true;
  } catch (error) {
    console.error('Toolary: failed to inject content script', error);
    return false;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

async function dispatchToolToActiveTab(toolId) {
  if (!toolId) {
    throw new Error('Missing tool identifier');
  }

  const tool = await toolRegistry.getToolById(toolId);
  if (!tool) {
    throw new Error(`Unknown tool id: ${toolId}`);
  }

  const tab = await getActiveTab();
  if (!tab?.id) {
    throw new Error('No active tab found');
  }

  const injected = await ensureContentScriptInjected(tab.id);
  if (!injected) {
    throw new Error('Unable to inject content script');
  }

  await delay(80);
  await messageRouter.sendTabMessage(tab.id, messageRouter.MESSAGE_TYPES.ACTIVATE_TOOL_ON_PAGE, { toolId });
  return true;
}

async function requestPageDimensions() {
  const tab = await getActiveTab();
  if (!tab?.id) {
    throw new Error('No active tab found');
  }

  const injected = await ensureContentScriptInjected(tab.id);
  if (!injected) {
    throw new Error('Unable to inject content script');
  }

  const dimensions = await messageRouter.sendTabMessage(tab.id, messageRouter.MESSAGE_TYPES.GET_PAGE_DIMENSIONS, {});
  return { success: true, dimensions };
}

const { addMessageListener, MESSAGE_TYPES } = messageRouter;

addMessageListener({
  [MESSAGE_TYPES.ACTIVATE_TOOL]: async (payload) => {
    const toolId = payload?.toolId || payload?.tool;
    if (!toolId) {
      throw new Error('Missing tool id');
    }
    await dispatchToolToActiveTab(toolId);
    return { success: true };
  },
  [MESSAGE_TYPES.CAPTURE_VISIBLE_TAB]: async () => {
    const dataUrl = await chrome.tabs.captureVisibleTab({ format: 'png', quality: 100 });
    if (chrome.runtime.lastError) {
      throw new Error(chrome.runtime.lastError.message);
    }
    if (!dataUrl) {
      throw new Error('No image data received.');
    }
    return { success: true, dataUrl };
  },
  [MESSAGE_TYPES.DOWNLOAD_MEDIA]: ({ url, filename }) => new Promise((resolve) => {
    console.log('Background: Download media request', { url, filename });
    
    if (!url) {
      console.error('Background: Missing media URL');
      resolve({ success: false, error: 'Missing media URL.' });
      return;
    }

    console.log('Background: Starting download', { url, filename });
    chrome.downloads.download({ url, filename }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Background: Download failed', chrome.runtime.lastError);
        resolve({ success: false, error: chrome.runtime.lastError.message });
        return;
      }
      console.log('Background: Download successful', { downloadId });
      resolve({ success: true, downloadId });
    });
  }),
  [MESSAGE_TYPES.PDF_GENERATE]: async ({ filename }) => {
    try {
      console.log('Toolary: Starting PDF generation for filename:', filename);
      
      // Get the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      
      if (!activeTab?.id) {
        throw new Error('No active tab found');
      }

      console.log('Toolary: Found active tab:', activeTab.id, activeTab.url);

      // Check if printToPDF is available (only on Chrome OS)
      if (chrome.tabs.printToPDF) {
        try {
          // Generate PDF using Chrome's native printToPDF API (Chrome OS only)
          console.log('Toolary: Using chrome.tabs.printToPDF (Chrome OS)...');
          const pdfData = await chrome.tabs.printToPDF({
            paperWidth: 8.27,  // A4 width in inches
            paperHeight: 11.69, // A4 height in inches
            marginTop: 0.4,
            marginBottom: 0.4,
            marginLeft: 0.4,
            marginRight: 0.4,
            printBackground: true,
            preferCSSPageSize: false
          });

          if (chrome.runtime.lastError) {
            console.error('Toolary: chrome.tabs.printToPDF error:', chrome.runtime.lastError);
            throw new Error(chrome.runtime.lastError.message);
          }

          console.log('Toolary: PDF generated successfully, size:', pdfData.byteLength);

          // Convert PDF data to Base64 for service worker compatibility
          const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
          
          // Convert blob to base64 using a service worker compatible approach
          const arrayBuffer = await pdfBlob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Manual base64 encoding for service worker compatibility
          let base64String = '';
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
          for (let i = 0; i < uint8Array.length; i += 3) {
            const a = uint8Array[i];
            const b = uint8Array[i + 1] || 0;
            const c = uint8Array[i + 2] || 0;
            const bitmap = (a << 16) | (b << 8) | c;
            base64String += chars.charAt((bitmap >> 18) & 63);
            base64String += chars.charAt((bitmap >> 12) & 63);
            base64String += i + 1 < uint8Array.length ? chars.charAt((bitmap >> 6) & 63) : '=';
            base64String += i + 2 < uint8Array.length ? chars.charAt(bitmap & 63) : '=';
          }
          const dataUrl = `data:application/pdf;base64,${base64String}`;

          console.log('Toolary: Starting download...');
          // Download the PDF using data URL
          chrome.downloads.download({
            url: dataUrl,
            filename: filename,
            saveAs: false
          }, (downloadId) => {
            if (chrome.runtime.lastError) {
              console.error('Toolary: PDF download failed', chrome.runtime.lastError);
            } else {
              console.log('Toolary: PDF download started, ID:', downloadId);
            }
          });

          return { success: true, downloadId: 'pdf-generated' };
        } catch (printToPDFError) {
          console.log('Toolary: printToPDF failed, falling back to window.print()', printToPDFError);
          // Fall through to window.print() approach
        }
      }

      // Fallback: Use window.print() approach (works on all platforms)
      console.log('Toolary: Using window.print() approach...');
      
      // Send message to content script to trigger print
      await messageRouter.sendTabMessage(activeTab.id, 'TRIGGER_PRINT', { filename });
      
      return { success: true, method: 'window.print' };
      
    } catch (error) {
      console.error('Toolary: PDF generation failed', error);
      return { success: false, error: error.message };
    }
  },
  [MESSAGE_TYPES.GET_PAGE_DIMENSIONS]: () => requestPageDimensions(),
  [MESSAGE_TYPES.VIDEO_RECORDER_GET_CONTEXT]: async () => {
    try {
      const tab = await getActiveTab();
      if (!tab?.id) {
        throw new Error('No active tab available for recording.');
      }

      return {
        success: true,
        tabId: tab.id,
        windowId: tab.windowId
      };
    } catch (error) {
      console.error('Toolary: failed to resolve active tab for recorder', error);
      return { success: false, error: error.message };
    }
  }
});


chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});
