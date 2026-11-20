// popup.js - SmartShopper AI India
document.addEventListener("DOMContentLoaded", () => {
  const analyzeButton = document.getElementById("analyzeDeals");
  const resultDiv = document.getElementById("result");
  const loadingDiv = document.getElementById("loading");
  const activeStoreLabel = document.getElementById("activeStoreLabel");

  // Detect active tab and set label
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].url) {
      const url = tabs[0].url;
      if (url.includes("flipkart.com")) {
        activeStoreLabel.innerHTML = "<strong>Flipkart Detected:</strong> Ready to scan deals";
      } else if (url.includes("amazon.in") || url.includes("amazon.com")) {
        activeStoreLabel.innerHTML = "<strong>Amazon India Detected:</strong> Ready to scan deals";
      } else if (url.includes("croma.com")) {
        activeStoreLabel.innerHTML = "<strong>Croma Detected:</strong> Ready to scan deals";
      } else if (url.includes("myntra.com")) {
        activeStoreLabel.innerHTML = "<strong>Myntra Detected:</strong> Ready to scan deals";
      } else {
        activeStoreLabel.innerText = "Browse Flipkart or Amazon.in to see live deals";
      }
    }
  });

  // Load last saved AI response
  chrome.storage.local.get("last_ai_response", (data) => {
    if (data.last_ai_response) {
      resultDiv.innerHTML = data.last_ai_response;
    }
  });

  analyzeButton.addEventListener("click", async () => {
    resultDiv.innerHTML = "";
    loadingDiv.style.display = "block";
    analyzeButton.disabled = true;

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || tabs.length === 0) {
        resultDiv.innerText = "No active tab found. Please open Flipkart or Amazon.in.";
        loadingDiv.style.display = "none";
        analyzeButton.disabled = false;
        return;
      }

      const activeTab = tabs[0];
      try {
        // Send message to content script
        chrome.tabs.sendMessage(activeTab.id, { type: "start_deal_analysis" }, (response) => {
          loadingDiv.style.display = "none";
          analyzeButton.disabled = false;

          if (chrome.runtime.lastError) {
            // Content script wasn't injected yet, query background directly
            chrome.runtime.sendMessage({
              type: "analyze_deals",
              query: activeTab.title || "popular electronics deal",
              sourceUrl: activeTab.url
            }, (bgResponse) => {
              handleResponse(bgResponse);
            });
            return;
          }

          handleResponse(response);
        });
      } catch (err) {
        loadingDiv.style.display = "none";
        analyzeButton.disabled = false;
        resultDiv.innerText = "Could not connect to page script. Please refresh the shopping page and try again.";
      }
    });
  });

  function handleResponse(response) {
    if (response && response.success) {
      let formatted = response.result
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n- /g, '<br>• ');

      resultDiv.innerHTML = formatted;
      chrome.storage.local.set({ "last_ai_response": formatted });
    } else {
      const err = (response && response.error) || "Unable to extract deals from this page.";
      resultDiv.innerHTML = `<span style="color:#f87171;">⚠️ ${err}</span>`;
    }
  }
});
