function checkContentScriptStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0) return;

    const tabId = tabs[0].id;
    const inactiveIndicator = document.getElementById("status-inactive");
    inactiveIndicator.classList.add("hidden");

    const timeout = setTimeout(() => {
      chrome.runtime.sendMessage(
        { action: "checkInjectable", tabId: tabId },
        function (injectable) {
          if (!injectable) {
            inactiveIndicator.classList.remove("hidden");
          } else {
            inactiveIndicator.classList.remove("hidden");
          }
        }
      );
    }, 2000);

    chrome.tabs.sendMessage(
      tabId,
      { action: "checkStatus" },
      function (response) {
        clearTimeout(timeout);

        if (chrome.runtime.lastError || !response) {
          inactiveIndicator.classList.remove("hidden");
        } else {
          activeIndicator.classList.remove("hidden");
          inactiveIndicator.classList.add("hidden");
        }
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", checkContentScriptStatus);
