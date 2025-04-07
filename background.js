console.log("Background script running...");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Gesture Tab Navigator extension installed.");
});

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command received: ${command}`);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;

    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, { action: command }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error sending message to content script:",
          chrome.runtime.lastError
        );
      } else {
        console.log("Message sent to content script:", response);
      }
    });
  });
});
