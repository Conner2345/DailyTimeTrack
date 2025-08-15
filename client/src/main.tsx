import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeCompatibilityFeatures, showBrowserWarning } from "./utils/browser-compatibility";

// Register service worker with browser compatibility checks
if ('serviceWorker' in navigator && 'localStorage' in window) {
  window.addEventListener('load', () => {
    // Check for Samsung Internet, Chrome, Edge compatibility
    const isCompatible = (
      'Promise' in window &&
      'fetch' in window &&
      'localStorage' in window
    );

    if (isCompatible) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Handle updates gracefully
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available, refresh the page
                  window.location.reload();
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    } else {
      console.warn('Browser not fully compatible with advanced features');
    }
  });

  // Handle service worker messages
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      window.location.reload();
    }
  });
}

// Initialize browser compatibility features
initializeCompatibilityFeatures();
showBrowserWarning();

// Browser compatibility: Check for React 18 createRoot support
const container = document.getElementById("root");
if (container) {
  try {
    createRoot(container).render(<App />);
  } catch (error) {
    console.error('Failed to render app:', error);
    // Fallback for older browsers
    container.innerHTML = '<div style="padding: 20px; text-align: center;">Please update your browser to use this app.</div>';
  }
} else {
  console.error('Root element not found');
}
