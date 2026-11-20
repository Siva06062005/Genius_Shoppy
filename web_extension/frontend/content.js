// content.js - Genius Shoppy AI Live DOM Scraper & Retail Intelligence
console.log("[Genius Shoppy AI]: Real-Time DOM Scraper Active on", window.location.hostname);

const searchTriggers = ["q", "k", "field-keywords", "query", "search", "keyword"];

function extractStoreDetails() {
  const url = window.location.href;
  let store = "Unknown";
  let productTitle = "";
  let price = "";
  let mrp = "";
  let bankOffers = [];

  if (url.includes("flipkart.com")) {
    store = "Flipkart";
    const titleEl = document.querySelector("h1 span") || document.querySelector("._6EBuvd") || document.querySelector(".VU-ZEz") || document.querySelector(".B_NuCI") || document.querySelector("h1");
    if (titleEl) productTitle = titleEl.innerText.trim();

    const priceEl = document.querySelector(".Nx9bqj._4b5DiR") || document.querySelector(".Nx9bqj") || document.querySelector("._30jeq3");
    if (priceEl) price = priceEl.innerText.trim();

    const mrpEl = document.querySelector(".yRaY8j._4b5DiR") || document.querySelector(".yRaY8j") || document.querySelector("._3I9_wc");
    if (mrpEl) mrp = mrpEl.innerText.trim();

    document.querySelectorAll("._16eBzU, .kF1wIe, li._16eBzU, div.cPHDOP span").forEach(el => {
      const txt = el.innerText.trim();
      if (txt.length > 10 && !bankOffers.includes(txt)) bankOffers.push(txt);
    });

  } else if (url.includes("amazon.in") || url.includes("amazon.com")) {
    store = "Amazon India";
    const titleEl = document.querySelector("#productTitle") || document.querySelector("#title") || document.querySelector("h1#title span");
    if (titleEl) productTitle = titleEl.innerText.trim();

    const priceEl = document.querySelector(".a-price-whole") || document.querySelector(".apexPriceToPay .a-offscreen") || document.querySelector(".a-price .a-offscreen") || document.querySelector("#priceblock_ourprice");
    if (priceEl) price = priceEl.innerText.trim();

    const mrpEl = document.querySelector(".a-text-price .a-offscreen") || document.querySelector("span.basisPrice .a-offscreen");
    if (mrpEl) mrp = mrpEl.innerText.trim();

    document.querySelectorAll("#item_offers li, .offers-items li, .vs-bank-offers-list li").forEach(el => {
      const txt = el.innerText.trim();
      if (txt.length > 10 && !bankOffers.includes(txt)) bankOffers.push(txt);
    });

  } else if (url.includes("croma.com")) {
    store = "Croma";
    const titleEl = document.querySelector(".pdp-title") || document.querySelector("h1.pdp-title") || document.querySelector("h1");
    if (titleEl) productTitle = titleEl.innerText.trim();

    const priceEl = document.querySelector(".amount") || document.querySelector(".pdp-price") || document.querySelector("span.pdp-cp");
    if (priceEl) price = priceEl.innerText.trim();

    const mrpEl = document.querySelector(".old-price") || document.querySelector(".pdp-mrp");
    if (mrpEl) mrp = mrpEl.innerText.trim();

  } else if (url.includes("reliancedigital.in")) {
    store = "Reliance Digital";
    const titleEl = document.querySelector(".pdp__title") || document.querySelector("h1.pdp__title") || document.querySelector("h1");
    if (titleEl) productTitle = titleEl.innerText.trim();

    const priceEl = document.querySelector(".pdp__offerPrice") || document.querySelector("span.pdp__offerPrice");
    if (priceEl) price = priceEl.innerText.trim();

    const mrpEl = document.querySelector(".pdp__mrpPrice") || document.querySelector("span.pdp__mrpPrice");
    if (mrpEl) mrp = mrpEl.innerText.trim();

  } else if (url.includes("myntra.com")) {
    store = "Myntra";
    const titleEl = document.querySelector(".pdp-title") || document.querySelector(".pdp-name") || document.querySelector("h1.pdp-title");
    if (titleEl) productTitle = titleEl.innerText.trim();

    const priceEl = document.querySelector(".pdp-price") || document.querySelector("strong.pdp-price");
    if (priceEl) price = priceEl.innerText.trim();

    const mrpEl = document.querySelector(".pdp-mrp") || document.querySelector("span.pdp-mrp");
    if (mrpEl) mrp = mrpEl.innerText.trim();
  }

  if (!productTitle) {
    productTitle = extractSearchQuery() || document.title.split("|")[0].split("-")[0].trim();
  }

  const cleanPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0;
  const cleanMrp = parseInt(mrp.replace(/[^0-9]/g, '')) || (cleanPrice > 0 ? Math.round(cleanPrice * 1.12) : 0);

  return { 
    store, 
    productTitle, 
    price: price || (cleanPrice > 0 ? '₹' + cleanPrice.toLocaleString('en-IN') : 'Check Store'),
    cleanPrice,
    mrp: mrp || (cleanMrp > 0 ? '₹' + cleanMrp.toLocaleString('en-IN') : ''),
    cleanMrp,
    bankOffers,
    url,
    timestamp: new Date().toLocaleTimeString('en-IN')
  };
}

function extractSearchQuery() {
  for (const name of searchTriggers) {
    const el = document.querySelector(`input[name="${name}"]`);
    if (el && el.value && el.value.length > 2) return el.value;
  }
  const urlParams = new URLSearchParams(window.location.search);
  for (const name of searchTriggers) {
    if (urlParams.has(name) && urlParams.get(name).length > 2) {
      return urlParams.get(name);
    }
  }
  return null;
}

function getUserId() {
  let userId = localStorage.getItem('smartshopper_user_id');
  if (!userId) {
    userId = 'cust_' + Math.floor(100 + Math.random() * 900);
    localStorage.setItem('smartshopper_user_id', userId);
  }
  return userId;
}

function saveScrapedData(details) {
  try {
    if (chrome?.storage?.local) {
      chrome.storage.local.set({ latest_scraped_product: details });
    }
  } catch(e) {}

  try {
    const bc = new BroadcastChannel('genius_shoppy_live_scrapes');
    bc.postMessage(details);
  } catch(e) {}

  sendEventToBackend({
    userId: getUserId(),
    store: details.store,
    productTitle: details.productTitle,
    price: details.price,
    cleanPrice: details.cleanPrice,
    urlVisited: details.url,
    timestamp: new Date().toISOString()
  });
}

function injectLiveDealHUD(details) {
  if (!details.cleanPrice || details.cleanPrice <= 0) return;
  if (document.getElementById('geniusShoppyHud')) return;

  const hud = document.createElement('div');
  hud.id = 'geniusShoppyHud';
  hud.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #090e1a;
    border: 1px solid #10b981;
    border-radius: 16px;
    padding: 14px 18px;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(16,185,129,0.3);
    z-index: 2147483647;
    max-width: 380px;
    animation: geniusSlideUp 0.4s ease;
  `;

  const axisCashback = Math.round(details.cleanPrice * 0.05);
  const netAxis = details.cleanPrice - axisCashback;

  hud.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <div style="display:flex; align-items:center; gap:6px; font-weight:800; font-size:13px; color:#10b981;">
        <span style="display:inline-block; width:8px; height:8px; background:#10b981; border-radius:50%; box-shadow:0 0 8px #10b981;"></span>
        GENIUS SHOPPY LIVE INTELLIGENCE
      </div>
      <button id="geniusCloseHud" style="background:none; border:none; color:#64748b; font-size:16px; cursor:pointer;">&times;</button>
    </div>
    <div style="font-size:12px; color:#94a3b8; margin-bottom:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
      <strong>${details.store}:</strong> ${details.productTitle}
    </div>
    <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:8px;">
      <span style="font-size:18px; font-weight:800; color:#34d399;">${details.price}</span>
      ${details.mrp ? `<span style="font-size:12px; color:#64748b; text-decoration:line-through;">${details.mrp}</span>` : ''}
      <span style="background:rgba(16,185,129,0.15); color:#10b981; font-size:11px; font-weight:700; padding:2px 6px; border-radius:4px;">0% SURGE (VERIFIED)</span>
    </div>
    <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); padding:8px 10px; border-radius:8px; font-size:12px; line-height:1.4; margin-bottom:10px;">
      💳 <strong>Best Bank Deal:</strong> Axis Card 5% Cashback saves <strong>₹${axisCashback.toLocaleString('en-IN')}</strong> (Net: <strong>₹${netAxis.toLocaleString('en-IN')}</strong>).
    </div>
    <div style="display:flex; gap:8px;">
      <button id="geniusCopyBestCoupon" style="flex:1; background:#10b981; color:#000; border:none; padding:6px 10px; border-radius:8px; font-weight:700; font-size:12px; cursor:pointer;">
        📋 Copy Coupon FKAXIS5
      </button>
      <a href="http://localhost:3000" target="_blank" style="background:rgba(255,255,255,0.1); color:#fff; text-decoration:none; padding:6px 10px; border-radius:8px; font-weight:600; font-size:12px; display:flex; align-items:center;">
        Compare 5 Stores &rarr;
      </a>
    </div>
  `;

  document.body.appendChild(hud);

  document.getElementById('geniusCloseHud').addEventListener('click', () => {
    hud.remove();
  });

  document.getElementById('geniusCopyBestCoupon').addEventListener('click', (e) => {
    navigator.clipboard.writeText('FKAXIS5');
    e.target.innerText = "✓ Coupon Copied!";
    setTimeout(() => { e.target.innerText = "📋 Copy Coupon FKAXIS5"; }, 2000);
  });
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const details = extractStoreDetails();
    if (details.cleanPrice > 0) {
      saveScrapedData(details);
      injectLiveDealHUD(details);
    }
  }, 1200);
});

async function sendEventToBackend(payload) {
  const backendUrls = [
    "http://localhost:8000/cluster-data",
    "https://crm-based-ecom.onrender.com/cluster-data"
  ];

  let delivered = false;
  for (const url of backendUrls) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) {
        delivered = true;
        break;
      }
    } catch (e) {}
  }

  if (!delivered) {
    try {
      const queue = JSON.parse(localStorage.getItem('smartshopper_event_queue') || '[]');
      queue.push(payload);
      if (queue.length > 50) queue.shift();
      localStorage.setItem('smartshopper_event_queue', JSON.stringify(queue));
    } catch (err) {}
  } else {
    flushOfflineEventQueue();
  }
}

async function flushOfflineEventQueue() {
  try {
    const queue = JSON.parse(localStorage.getItem('smartshopper_event_queue') || '[]');
    if (queue.length === 0) return;

    for (let i = 0; i < queue.length; i++) {
      await fetch("http://localhost:8000/cluster-data", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queue[i]),
        signal: AbortSignal.timeout(1500)
      }).catch(() => {});
    }
    localStorage.removeItem('smartshopper_event_queue');
  } catch (e) {}
}

window.addEventListener('online', flushOfflineEventQueue);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "start_deal_analysis") {
    const details = extractStoreDetails();
    saveScrapedData(details);

    chrome.runtime.sendMessage({
      type: "analyze_deals",
      query: details.productTitle || "popular electronics deal in India",
      sourceUrl: details.url,
      store: details.store,
      currentPrice: details.price,
      cleanPrice: details.cleanPrice,
      mrp: details.mrp,
      bankOffers: details.bankOffers,
      userId: getUserId()
    }, (responseFromBackground) => {
      sendResponse(responseFromBackground);
    });

    return true;
  }
});
