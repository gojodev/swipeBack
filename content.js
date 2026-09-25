const TRIGGER_AMOUNT = 150;
const GESTURE_GAP_MS = 150;
const MOMENTUM_SETTLE_MS = 400;
const MOMENTUM_WINDOW_MS = 1500;
const TEARDOWN_EVENT = "swipeback:teardown";

let swipeDirection = null;
let swipeProgress = 0;
let inactivityTimeout;
let animationsEnabled = true;
let armed = true;
let armTimeout;
let settledAt = 0;
let lastWheelTime = null;

const isExtension =
  typeof chrome !== "undefined" && Boolean(chrome.runtime && chrome.runtime.id);

function createDiv() {
  return document.createElement("div");
}

function createChevron(direction) {
  const chevron = createDiv();
  chevron.classList.add(direction === "left" ? "arrowLeft" : "arrowRight");
  return chevron;
}

function createArrow(direction) {
  const arrow = createDiv();
  arrow.id = `${direction}Arrow`;
  arrow.style.position = "fixed";
  arrow.style.top = "50%";
  arrow.style[direction] = "0px";

  const container = createDiv();
  container.classList.add("arrowContainer", `${direction}Pos`);
  arrow.appendChild(container);

  const slidingClass =
    direction === "left" ? "arrowSlidingLeft" : "arrowSlidingRight";
  ["", "delay1", "delay2", "delay3"].forEach((delay) => {
    const sliding = createDiv();
    sliding.classList.add(slidingClass);
    if (delay) sliding.classList.add(delay);
    sliding.appendChild(createChevron(direction));
    container.appendChild(sliding);
  });

  document.body.append(arrow);
}

function arrowFor(direction) {
  return document.getElementById(`${direction}Arrow`);
}

function setVisible(element, visible) {
  element.style.opacity = visible ? "1" : "0";
}

function resetSwipe() {
  setVisible(arrowFor("left"), false);
  setVisible(arrowFor("right"), false);
  swipeDirection = null;
  swipeProgress = 0;
}

function navigate(direction) {
  if (direction === "left") {
    history.back();
  } else {
    history.forward();
  }
}

function trackSwipe(direction, amount) {
  if (direction !== swipeDirection) {
    if (swipeDirection) setVisible(arrowFor(swipeDirection), false);
    swipeDirection = direction;
    swipeProgress = 0;
  }

  if (swipeProgress >= TRIGGER_AMOUNT) return;
  swipeProgress += amount;

  const arrow = arrowFor(direction);
  if (animationsEnabled) {
    setVisible(arrow, true);
    const offset = direction === "left" ? swipeProgress : -swipeProgress;
    arrow.style.transform = `translate(${offset}px)`;
  }

  if (swipeProgress >= TRIGGER_AMOUNT) {
    setVisible(arrow, false);
    navigate(direction);
  }
}

function hasScrollRoom(element, deltaX) {
  const maxScrollLeft = element.scrollWidth - element.clientWidth;
  if (maxScrollLeft <= 0) return false;
  return deltaX < 0 ? element.scrollLeft > 0 : element.scrollLeft < maxScrollLeft;
}

function isElementScrollable(element, deltaX) {
  const { overflowX } = window.getComputedStyle(element);
  const scrolls = overflowX === "auto" || overflowX === "scroll";
  return scrolls && hasScrollRoom(element, deltaX);
}

function isDocumentScrollable(deltaX) {
  const htmlOverflowX = window.getComputedStyle(document.documentElement).overflowX;
  const overflowX =
    htmlOverflowX === "visible"
      ? window.getComputedStyle(document.body).overflowX
      : htmlOverflowX;
  if (overflowX === "hidden" || overflowX === "clip") return false;
  return hasScrollRoom(document.scrollingElement, deltaX);
}

function findScrollTarget(element, deltaX) {
  let node = element;
  while (node && node !== document.body && node !== document.documentElement) {
    if (isElementScrollable(node, deltaX)) return node;
    node = node.parentElement;
  }
  return isDocumentScrollable(deltaX) ? document.scrollingElement : null;
}

function expectMomentumTail() {
  resetSwipe();
  armed = false;
  lastWheelTime = null;
  settledAt = performance.now() + MOMENTUM_SETTLE_MS;
  clearTimeout(armTimeout);
  armTimeout = setTimeout(() => {
    armed = true;
  }, MOMENTUM_WINDOW_MS);
}

function handleWheelEvent(e) {
  const now = performance.now();
  if (!armed) {
    const quietBefore =
      lastWheelTime === null
        ? now > settledAt
        : now - lastWheelTime > GESTURE_GAP_MS;
    if (quietBefore) armed = true;
  }
  lastWheelTime = now;
  if (!armed) return; // inertial tail carried over from the page we just left

  if (e.ctrlKey || window.visualViewport.scale > 1.01) return; // pinch-zooming, or already zoomed in

  const deltaX = e.deltaX;
  if (deltaX === 0) return;

  if (findScrollTarget(e.target, deltaX)) return;

  trackSwipe(deltaX < 0 ? "left" : "right", Math.abs(deltaX));

  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(resetSwipe, GESTURE_GAP_MS);
}

function connectToExtension() {
  chrome.storage.sync.get({ animationsEnabled: true }, (settings) => {
    animationsEnabled = settings.animationsEnabled;
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync" || !changes.animationsEnabled) return;
    animationsEnabled = changes.animationsEnabled.newValue;
    if (!animationsEnabled) resetSwipe();
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkStatus") sendResponse({ active: true });
  });
}

function teardown() {
  document.removeEventListener("wheel", handleWheelEvent);
  clearTimeout(inactivityTimeout);
  clearTimeout(armTimeout);
  document.querySelectorAll("#leftArrow, #rightArrow").forEach((el) => el.remove());
}

function init() {
  // retire any instance left behind by an extension update or re-injection
  document.dispatchEvent(new Event(TEARDOWN_EVENT));
  document.querySelectorAll("#leftArrow, #rightArrow").forEach((el) => el.remove());
  document.addEventListener(TEARDOWN_EVENT, teardown, { once: true });

  createArrow("left");
  createArrow("right");
  resetSwipe();
  document.addEventListener("wheel", handleWheelEvent);

  const [navigationEntry] = performance.getEntriesByType("navigation");
  if (navigationEntry && navigationEntry.type === "back_forward") {
    expectMomentumTail();
  }
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) expectMomentumTail();
  });

  if (!isExtension) return;

  try {
    connectToExtension();
  } catch {
    // extension context invalidated between the isExtension check and here
    // (e.g. this tab was open when the extension was updated or reloaded)
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
