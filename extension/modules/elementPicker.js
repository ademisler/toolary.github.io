import { createOverlay, removeOverlay, createTooltip, removeTooltip, copyText, getCssSelector, getXPath, showModal, showError, showSuccess, showInfo, throttle, getCachedComputedStyle, handleError, safeExecute, addEventListenerWithCleanup } from './helpers.js';

let overlay, tooltip, deactivateCb;
let currentElement = null;
let cleanupFunctions = [];

// Performance optimized move handler with enhanced error handling
const throttledOnMove = throttle((e) => {
  try {
    const pointerElement = e.target instanceof Element
      ? e.target
      : (typeof document.elementFromPoint === 'function'
        ? document.elementFromPoint(e.clientX ?? 0, e.clientY ?? 0)
        : null);

    if (!(pointerElement instanceof Element)) {
      return;
    }

    if (pointerElement === overlay || pointerElement === tooltip) return;
    if (overlay?.contains(pointerElement) || tooltip?.contains?.(pointerElement)) return;

    currentElement = pointerElement;
    const rect = pointerElement.getBoundingClientRect();
    
    // Update overlay position
    overlay.style.top = rect.top + window.scrollY + 'px';
    overlay.style.left = rect.left + window.scrollX + 'px';
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
    
    // Update tooltip with enhanced info
    const tagName = pointerElement.tagName.toLowerCase();
    const id = pointerElement.id ? `#${pointerElement.id}` : '';
    const classes = pointerElement.classList && pointerElement.classList.length > 0 ? `.${Array.from(pointerElement.classList).join('.')}` : '';
    const contentText = pointerElement.textContent || '';
    const textContent = contentText.trim().substring(0, 30);
    const textSuffix = contentText.trim().length > 30 ? '...' : '';
    
    tooltip.style.top = rect.bottom + window.scrollY + 5 + 'px';
    tooltip.style.left = rect.left + window.scrollX + 'px';
    tooltip.innerHTML = `
      <div style="font-weight: bold;">${tagName}${id}${classes}</div>
      <div style="font-size: 11px; opacity: 0.8;">${textContent}${textSuffix}</div>
      <div style="font-size: 10px; opacity: 0.6;">Click to select • Arrow keys to navigate</div>
    `;
  } catch (error) {
    console.debug('Element picker move handler error:', error);
  }
}, 16); // 60fps

// Enhanced click handler with comprehensive error handling
function onClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  if (!(currentElement instanceof Element)) return;

  try {
    const el = currentElement;
    const computedStyle = getCachedComputedStyle(el);
    
    if (!computedStyle) {
      throw new Error('Failed to get computed styles');
    }
    
    // Enhanced element information
    const info = {
      // Basic info
      tagName: el.tagName.toLowerCase(),
      id: el.id || null,
      className: el.className || null,
      textContent: el.textContent.trim(),
      
      // Attributes
      attributes: Array.from(el.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {}),
      
      // Position and size
      position: {
        x: el.offsetLeft,
        y: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY
      },
      
      // Computed styles
      styles: {
        display: computedStyle.display,
        position: computedStyle.position,
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        fontSize: computedStyle.fontSize,
        fontFamily: computedStyle.fontFamily,
        margin: computedStyle.margin,
        padding: computedStyle.padding,
        border: computedStyle.border,
        borderRadius: computedStyle.borderRadius,
        boxShadow: computedStyle.boxShadow,
        zIndex: computedStyle.zIndex
      },
      
      // Selectors
      selectors: {
        css: safeExecute(() => getCssSelector(el), 'getCssSelector') || 'Failed to generate',
        xpath: safeExecute(() => getXPath(el), 'getXPath') || 'Failed to generate',
        tag: el.tagName.toLowerCase(),
        id: el.id ? `#${el.id}` : null,
        classes: el.classList && el.classList.length > 0 ? `.${Array.from(el.classList).join('.')}` : null
      },
      
      // Content
      innerHTML: el.innerHTML,
      outerHTML: el.outerHTML,
      
      // Accessibility
      accessibility: {
        role: el.getAttribute('role') || el.tagName.toLowerCase(),
        ariaLabel: el.getAttribute('aria-label'),
        ariaDescribedBy: el.getAttribute('aria-describedby'),
        tabIndex: el.getAttribute('tabindex'),
        alt: el.getAttribute('alt'),
        title: el.getAttribute('title')
      }
    };
    
    const text = JSON.stringify(info, null, 2);
    copyText(text);
    
    showSuccess(`Element ${el.tagName.toLowerCase()} selected and copied!`);
    
    const title = chrome.i18n ? chrome.i18n.getMessage('elementInfo') : 'Element Information';
    showModal(title, text, 'element', 'element');
    deactivateCb();
    
  } catch (error) {
    handleError(error, 'elementPicker');
    showError('Failed to extract element information. Please try again.');
  }
}

// XPath generator - moved to helpers.js to avoid duplication

// Keyboard navigation
function onKeyDown(e) {
  if (!overlay || !currentElement) return;
  
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      navigateElement(-1);
      break;
    case 'ArrowDown':
      e.preventDefault();
      navigateElement(1);
      break;
    case 'Enter':
      e.preventDefault();
      onClick({ target: currentElement, preventDefault: () => {}, stopPropagation: () => {} });
      break;
    case 'Escape':
      e.preventDefault();
      deactivateCb();
      break;
  }
}

function navigateElement(direction) {
  try {
    const allElements = Array.from(document.querySelectorAll('*'))
      .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
    
    const currentIndex = allElements.indexOf(currentElement);
    const newIndex = Math.max(0, Math.min(allElements.length - 1, currentIndex + direction));
    
    if (allElements[newIndex]) {
      currentElement = allElements[newIndex];
      const rect = currentElement.getBoundingClientRect();
      
      // Update overlay
      overlay.style.top = rect.top + window.scrollY + 'px';
      overlay.style.left = rect.left + window.scrollX + 'px';
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';
      
      // Update tooltip
      const tagName = currentElement.tagName.toLowerCase();
      const id = currentElement.id ? `#${currentElement.id}` : '';
      const classes = currentElement.classList && currentElement.classList.length > 0 ? `.${Array.from(currentElement.classList).join('.')}` : '';
      
      tooltip.style.top = rect.bottom + window.scrollY + 5 + 'px';
      tooltip.style.left = rect.left + window.scrollX + 'px';
      tooltip.innerHTML = `
        <div style="font-weight: bold;">${tagName}${id}${classes}</div>
        <div style="font-size: 10px; opacity: 0.6;">Arrow keys to navigate • Enter to select • Esc to cancel</div>
      `;
      
      // Scroll element into view
      currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } catch (error) {
    handleError(error, 'navigateElement');
  }
}

export function activate(deactivate) {
  deactivateCb = deactivate;
  
  try {
    overlay = createOverlay();
    tooltip = createTooltip();
    
    if (!overlay || !tooltip) {
      throw new Error('Failed to create overlay or tooltip');
    }
    
    // Enhanced tooltip styling
    tooltip.style.cssText = `
      position: absolute;
      background: var(--pickachu-button-bg, rgba(0,0,0,0.9));
      color: var(--pickachu-text, #fff);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      padding: 8px 12px;
      border-radius: 6px;
      z-index: 2147483647;
      pointer-events: none;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      max-width: 300px;
      line-height: 1.4;
    `;
    
    document.body.style.cursor = 'crosshair';
    
    // Add event listeners with cleanup tracking
    const cleanupMove = addEventListenerWithCleanup(document, 'mousemove', throttledOnMove, true);
    const cleanupClick = addEventListenerWithCleanup(document, 'click', onClick, true);
    const cleanupKeydown = addEventListenerWithCleanup(document, 'keydown', onKeyDown, true);
    
    cleanupFunctions.push(cleanupMove, cleanupClick, cleanupKeydown);
    
    showInfo('Hover over elements to inspect • Click to select • Use arrow keys to navigate', 3000);
    
  } catch (error) {
    handleError(error, 'elementPicker activation');
    showError('Failed to activate element picker. Please try again.');
    deactivate();
  }
}

export function deactivate() {
  try {
    // Cleanup all event listeners
    cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        handleError(error, 'event listener cleanup');
      }
    });
    cleanupFunctions.length = 0;
    
    removeOverlay(overlay); 
    overlay = null;
    removeTooltip(tooltip); 
    tooltip = null;
    
    currentElement = null;
    
    document.body.style.cursor = '';
    
  } catch (error) {
    handleError(error, 'elementPicker deactivation');
  }
}
