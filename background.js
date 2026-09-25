chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({ url: ["http://*/*", "https://*/*"] });
  for (const tab of tabs) {
    const target = { tabId: tab.id };
    chrome.scripting.insertCSS({ target, files: ["style.css"] }).catch(() => {});
    chrome.scripting.executeScript({ target, files: ["content.js"] }).catch(() => {});
  }
});

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    const tabId = tabs[0].id;
    if (command === "backwardGesture") {
      chrome.tabs.goBack(tabId).catch(() => {});
    } else if (command === "forwardGesture") {
      chrome.tabs.goForward(tabId).catch(() => {});
    }
  });
});
