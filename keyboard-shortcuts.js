// Keyboard Shortcuts for Smart Reply Assistant

// Shortcuts:
// Ctrl+Shift+A (or Cmd+Shift+A on Mac): Analyze page
// Ctrl+Shift+S: Summarize
// Ctrl+Shift+R: Generate replies
// Ctrl+Shift+1-4: Quick style selection
// Escape: Close popup/clear results

document.addEventListener('keydown', async (e) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifier = isMac ? e.metaKey : e.ctrlKey;

  // Check for Ctrl/Cmd + Shift combinations
  if (modifier && e.shiftKey) {
    switch(e.key.toUpperCase()) {
      case 'A':
        // Analyze page
        e.preventDefault();
        chrome.runtime.sendMessage({ action: 'openPopup' });
        showShortcutNotification('Opening Smart Reply...');
        break;

      case 'S':
        // Summarize (only works if content is already loaded)
        e.preventDefault();
        chrome.runtime.sendMessage({ action: 'triggerSummarize' });
        showShortcutNotification('Generating summary...');
        break;

      case 'R':
        // Generate replies
        e.preventDefault();
        chrome.runtime.sendMessage({ action: 'triggerReplies' });
        showShortcutNotification('Generating replies...');
        break;

      case '1':
        // Supportive reply
        e.preventDefault();
        chrome.runtime.sendMessage({ action: 'triggerStyle', style: 'supportive' });
        showShortcutNotification('Generating supportive reply...');
        break;

      case '2':
        // Questions reply
        e.preventDefault();
        chrome.runtime.sendMessage({ action: 'triggerStyle', style: 'questions' });
        showShortcutNotification('Generating questions reply...');
        break;

      case '3':
        // Counter reply
        e.preventDefault();
        chrome.runtime.sendMessage({ action: 'triggerStyle', style: 'counter' });
        showShortcutNotification('Generating counter reply...');
        break;

      case '4':
        // Professional reply
        e.preventDefault();
        chrome.runtime.sendMessage({ action: 'triggerStyle', style: 'professional' });
        showShortcutNotification('Generating professional reply...');
        break;
    }
  }
});

// Show keyboard shortcut notification
function showShortcutNotification(message) {
  // Remove existing notification if any
  const existing = document.getElementById('smart-reply-shortcut-notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'smart-reply-shortcut-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 600;
    animation: slideInFromTop 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  notification.innerHTML = `
    <span style="font-size: 16px;">⌨️</span>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  // Remove after 2 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutToTop 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes slideOutToTop {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

console.log('[Smart Reply] Keyboard shortcuts loaded');
console.log('[Smart Reply] Available shortcuts:');
console.log('  Ctrl+Shift+A: Open Smart Reply');
console.log('  Ctrl+Shift+S: Summarize');
console.log('  Ctrl+Shift+R: Generate replies');
console.log('  Ctrl+Shift+1-4: Quick style selection');