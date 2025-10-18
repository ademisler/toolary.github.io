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
    if (!url) {
      resolve({ success: false, error: 'Missing media URL.' });
      return;
    }

    chrome.downloads.download({ url, filename }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Toolary: download failed', chrome.runtime.lastError);
        resolve({ success: false, error: chrome.runtime.lastError.message });
        return;
      }
      resolve({ success: true, downloadId });
    });
  }),
  [MESSAGE_TYPES.GET_PAGE_DIMENSIONS]: () => requestPageDimensions()
});

const COMMAND_TOOL_MAP = {
  'activate-color-picker': 'color-picker',
  'activate-element-picker': 'element-picker',
  'activate-screenshot-picker': 'screenshot-picker'
};

chrome.commands.onCommand.addListener(async (command) => {
  if (COMMAND_TOOL_MAP[command]) {
    try {
      await dispatchToolToActiveTab(COMMAND_TOOL_MAP[command]);
    } catch (error) {
      console.error(`Toolary: failed to run command ${command}`, error);
    }
    return;
  }

  if (command === 'open-popup' || command === 'toggle-popup') {
    try {
      await chrome.action.openPopup();
    } catch (error) {
      console.log('Toolary: popup open failed, falling back to in-page overlay', error);
      try {
        const tab = await getActiveTab();
        if (tab?.id) {
          const injected = await ensureContentScriptInjected(tab.id);
          if (injected) {
            await delay(100);
            await messageRouter.sendTabMessage(tab.id, messageRouter.MESSAGE_TYPES.SHOW_POPUP, {});
          }
        }
      } catch (fallbackError) {
        console.error('Toolary: fallback popup method failed', fallbackError);
      }
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});
