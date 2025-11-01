// Promptly Background Service Worker

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Promptly installed successfully');
  console.log('Side panel mode enabled - click icon to open');
  console.log('Keyboard shortcuts enabled:');
  console.log('  Ctrl+Shift+A: Open Promptly Side Panel');
  console.log('  Ctrl+Shift+S: Summarize');
  console.log('  Ctrl+Shift+R: Generate replies');
});

// Handle toolbar icon click - open side panel
chrome.action.onClicked.addListener(async (tab) => {
  console.log('[Promptly] Opening side panel');
  await chrome.sidePanel.open({ windowId: tab.windowId });
});

// Handle keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
  console.log('[Promptly] Command received:', command);

  if (command === 'open-smart-reply') {
    // Open the side panel
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.sidePanel.open({ windowId: tab.windowId });
  } else if (command === 'summarize-content') {
    // Send message to side panel to trigger summarize
    chrome.runtime.sendMessage({ action: 'triggerSummarize' });
  } else if (command === 'generate-replies') {
    // Send message to side panel to trigger replies
    chrome.runtime.sendMessage({ action: 'triggerReplies' });
  }
});

// Handle messages from side panel or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabInfo') {
    // Return current tab information
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ tab: tabs[0] });
    });
    return true; // Keep channel open for async response
  }

  if (request.action === 'openPopupWithText') {
    // Content script wants to open side panel with selected text
    console.log('[Promptly] Opening side panel with selected text');

    // The text is already stored in chrome.storage by the content script
    // The side panel will automatically check for it when it opens

    // Open the side panel
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        await chrome.sidePanel.open({ windowId: tabs[0].windowId });
      }
    });

    sendResponse({ success: true });
    return true;
  }
});