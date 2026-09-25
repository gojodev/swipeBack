const inactiveIndicator = document.getElementById("status-inactive");
const statusMessage = document.getElementById("status-message");
const reloadButton = document.getElementById("reload-button");
const navButtons = document.getElementById("nav-buttons");
const backButton = document.getElementById("back-button");
const forwardButton = document.getElementById("forward-button");
const animationsToggle = document.getElementById("animations-toggle");

function showUnavailable(tab) {
  const reloadable = /^https?:/.test(tab.url || "");
  statusMessage.textContent = reloadable
    ? "Reload this page to activate SwipeBack"
    : "SwipeBack can't run on this page — use these buttons to navigate instead";
  reloadButton.classList.toggle("hidden", !reloadable);
  navButtons.classList.toggle("hidden", reloadable);
  inactiveIndicator.classList.remove("hidden");

  reloadButton.onclick = () => {
    chrome.tabs.reload(tab.id);
    window.close();
  };

  backButton.onclick = () => {
    chrome.tabs.goBack(tab.id).catch(() => {});
    window.close();
  };

  forwardButton.onclick = () => {
    chrome.tabs.goForward(tab.id).catch(() => {});
    window.close();
  };
}

function checkContentScriptStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    const tab = tabs[0];

    chrome.tabs.sendMessage(tab.id, { action: "checkStatus" }, (response) => {
      const available =
        !chrome.runtime.lastError && Boolean(response && response.active);
      if (available) {
        inactiveIndicator.classList.add("hidden");
        reloadButton.classList.add("hidden");
      } else {
        showUnavailable(tab);
      }
    });
  });
}

function loadSettings() {
  chrome.storage.sync.get({ animationsEnabled: true }, (settings) => {
    animationsToggle.checked = settings.animationsEnabled;
  });
}

animationsToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ animationsEnabled: animationsToggle.checked });
});

checkContentScriptStatus();
loadSettings();
