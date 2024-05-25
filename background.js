console.log('Background script running...');

chrome.runtime.onInstalled.addListener(function () {
  console.log("Gesture Tab Navigator extension installed.");

  chrome.commands.onCommand.addListener(function (command) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let tabId = tabs[0].id;

      if (command === "forwardGesture") {
        chrome.tabs.executeScript(tabId, { code: 'history.forward();' });
      } else if (command === "backwardGesture") {
        chrome.tabs.executeScript(tabId, { code: 'history.back();' });
      }
    });
  });
});