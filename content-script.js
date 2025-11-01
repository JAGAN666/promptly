// Promptly - Content Script for Text Selection

let floatingButton = null;
let selectedText = '';
let buttonTimeout = null;

// Create the floating button
function createFloatingButton() {
  const button = document.createElement('div');
  button.id = 'smart-reply-floating-btn';
  button.innerHTML = '💬';
  button.title = 'Analyze with Promptly';
  button.style.cssText = `
    position: absolute;
    display: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 20px;
    cursor: pointer;
    z-index: 999999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    align-items: center;
    justify-content: center;
    user-select: none;
    animation: fadeIn 0.3s ease;
  `;

  // Add hover effect
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  });

  // Handle click
  button.addEventListener('click', handleButtonClick);

  document.body.appendChild(button);
  return button;
}

// Handle floating button click
async function handleButtonClick(e) {
  e.preventDefault();
  e.stopPropagation();

  if (!selectedText) return;

  console.log('[Promptly] Storing selected text:', selectedText.substring(0, 50) + '...');

  // Store the selected text in Chrome storage
  chrome.storage.local.set({
    selectedText: selectedText,
    timestamp: Date.now()
  }, () => {
    console.log('[Promptly] Text stored successfully');

    // Show a notification to user
    showNotification('Text saved! Click the Promptly extension icon to analyze.');

    // Send message to background
    chrome.runtime.sendMessage({
      action: 'openPopupWithText',
      text: selectedText
    });
  });

  // Hide the button after click
  hideFloatingButton();
}

// Show a temporary notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Position the floating button near the selection
function positionFloatingButton(selection) {
  if (!floatingButton) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Position the button above and to the right of the selection
  const buttonSize = 36;
  const offset = 10;

  let top = window.scrollY + rect.top - buttonSize - offset;
  let left = window.scrollX + rect.right - buttonSize / 2;

  // Ensure button stays within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Adjust if too close to the right edge
  if (left + buttonSize > viewportWidth - 10) {
    left = viewportWidth - buttonSize - 10;
  }

  // If too close to the top, show below the selection
  if (top < window.scrollY + 10) {
    top = window.scrollY + rect.bottom + offset;
  }

  floatingButton.style.top = `${top}px`;
  floatingButton.style.left = `${left}px`;
  floatingButton.style.display = 'flex';
}

// Show the floating button
function showFloatingButton() {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  // Only show if text is selected and is meaningful (min 10 characters)
  if (text.length < 10) {
    hideFloatingButton();
    return;
  }

  selectedText = text;

  if (!floatingButton) {
    floatingButton = createFloatingButton();
  }

  // Clear any existing timeout
  if (buttonTimeout) {
    clearTimeout(buttonTimeout);
  }

  // Small delay to avoid flickering
  buttonTimeout = setTimeout(() => {
    positionFloatingButton(selection);
  }, 200);
}

// Hide the floating button
function hideFloatingButton() {
  if (floatingButton) {
    floatingButton.style.display = 'none';
  }
  if (buttonTimeout) {
    clearTimeout(buttonTimeout);
    buttonTimeout = null;
  }
}

// Handle text selection events
document.addEventListener('mouseup', (e) => {
  // Don't show button if clicking on the button itself
  if (e.target && e.target.id === 'smart-reply-floating-btn') {
    return;
  }

  // Small delay to let selection complete
  setTimeout(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      showFloatingButton();
    } else {
      hideFloatingButton();
    }
  }, 10);
});

// Hide button when selection is cleared
document.addEventListener('mousedown', (e) => {
  // Don't hide if clicking on the button
  if (e.target && e.target.id === 'smart-reply-floating-btn') {
    return;
  }
  hideFloatingButton();
});

// Handle keyboard events (Escape to hide)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideFloatingButton();
  }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  #smart-reply-floating-btn {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }
`;
document.head.appendChild(style);

console.log('[Promptly] Content script loaded and ready for text selection');