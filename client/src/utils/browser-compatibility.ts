// Browser compatibility utilities for Samsung Internet, Chrome, and Edge

export interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  features: {
    serviceWorker: boolean;
    localStorage: boolean;
    indexedDB: boolean;
    webComponents: boolean;
    css3: boolean;
  };
}

export function detectBrowser(): BrowserInfo {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  let version = 'Unknown';

  // Samsung Internet detection
  if (userAgent.includes('SamsungBrowser')) {
    browserName = 'Samsung Internet';
    const versionMatch = userAgent.match(/SamsungBrowser\/([0-9.]+)/);
    version = versionMatch ? versionMatch[1] : 'Unknown';
  }
  // Chrome detection (must come after Samsung Internet since it includes Chrome)
  else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browserName = 'Chrome';
    const versionMatch = userAgent.match(/Chrome\/([0-9.]+)/);
    version = versionMatch ? versionMatch[1] : 'Unknown';
  }
  // Edge detection
  else if (userAgent.includes('Edg')) {
    browserName = 'Edge';
    const versionMatch = userAgent.match(/Edg\/([0-9.]+)/);
    version = versionMatch ? versionMatch[1] : 'Unknown';
  }

  const features = {
    serviceWorker: 'serviceWorker' in navigator,
    localStorage: (() => {
      try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
    indexedDB: 'indexedDB' in window,
    webComponents: 'customElements' in window,
    css3: CSS.supports('display', 'grid'),
  };

  const isSupported = features.serviceWorker && features.localStorage;

  return {
    name: browserName,
    version,
    isSupported,
    features,
  };
}

export function initializeCompatibilityFeatures(): void {
  const browser = detectBrowser();
  
  // Samsung Internet specific optimizations
  if (browser.name === 'Samsung Internet') {
    // Optimize touch events
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
    
    // Samsung Internet viewport handling
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, viewport-fit=cover'
      );
    }
  }

  // Edge specific optimizations
  if (browser.name === 'Edge') {
    // Edge-specific CSS fixes
    document.documentElement.style.setProperty('--edge-fix', '1');
  }

  // Chrome specific optimizations
  if (browser.name === 'Chrome') {
    // Chrome memory optimization
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
        console.warn('High memory usage detected');
      }
    }
  }

  // Universal compatibility fixes
  fixCommonIssues();
}

function fixCommonIssues(): void {
  // Fix 100vh issues on mobile browsers
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', setViewportHeight);

  // Prevent zoom on input focus
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (input instanceof HTMLElement) {
      input.style.fontSize = '16px';
    }
  });

  // Fix touch delay on older browsers
  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', () => {
      const fastClick = (element: Element) => {
        element.addEventListener('touchstart', () => {}, { passive: true });
      };

      document.querySelectorAll('button, [role="button"], a').forEach(fastClick);
    });
  }
}

export function showBrowserWarning(): void {
  const browser = detectBrowser();
  
  if (!browser.isSupported) {
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #f59e0b;
      color: white;
      padding: 10px;
      text-align: center;
      z-index: 9999;
      font-size: 14px;
    `;
    warning.textContent = `Your browser (${browser.name}) may not support all features. Please update or use Chrome, Edge, or Samsung Internet.`;
    
    document.body.insertBefore(warning, document.body.firstChild);
    
    setTimeout(() => {
      warning.remove();
    }, 10000);
  }
}