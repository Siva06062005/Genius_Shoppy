# 🇮🇳 Genius Shoppy India — Complete Running & Vercel Hosting Guide

Welcome to **Genius Shoppy India** (AI Smart Shopping, Flipkart & Amazon Price Comparison & Retail Analytics).

Everything is pre-configured with [`vercel.json`](file:///c:/Users/sivas/Downloads/Genious%20Shoppy/vercel.json) for instant, zero-config hosting on Vercel.

---

## 🚀 1. How to Host on Vercel (1-Click or Command Line)

### Option A: Deploy via Terminal with Vercel CLI (Fastest)

1. Open PowerShell or Command Prompt in this folder:
   ```bash
   cd "c:\Users\sivas\Downloads\Genious Shoppy"
   ```

2. Run the deployment command:
   ```bash
   npx vercel
   ```
   - If logging in for the first time, follow the browser login prompt.
   - For **"Set up and deploy?"**, press `Y`.
   - Keep default project name `genius-shoppy` (press `Enter`).
   - Root directory: `./` (press `Enter`).
   - Modify settings: `N` (press `Enter`).

3. Publish to Production:
   ```bash
   npx vercel --prod
   ```
4. **Done!** You will immediately get a live link like `https://genius-shoppy.vercel.app` which you can open on any phone or laptop.

---

### Option B: Deploy via GitHub

1. Upload this project to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: Genius Shoppy India release"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/genius-shoppy.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **"Add New Project"** ➔ Import your GitHub repository.
4. Click **"Deploy"** (Keep default settings).
5. Your website will be live in 20 seconds.

---

## 💻 2. How to Run Locally on Your Computer

Open your terminal in `c:\Users\sivas\Downloads\Genious Shoppy` and run:

```bash
python -m http.server 3000
```
Then open your browser and visit:
👉 **`http://localhost:3000`**

---

## 🛒 3. How to Use the Chrome Extension

1. Open **Google Chrome**.
2. Type in the address bar: `chrome://extensions/`
3. Turn ON **"Developer mode"** (toggle in the top-right corner).
4. Click **"Load unpacked"** (top-left button).
5. Select this folder:
   ```
   c:\Users\sivas\Downloads\Genious Shoppy\CRM-based-ecom-Extension\frontend
   ```
6. The **SmartShopper** icon will appear in your Chrome toolbar!
7. Open any product on [Flipkart.com](https://www.flipkart.com) or [Amazon.in](https://www.amazon.in), click the extension, and click **"Analyze Deals on This Page"** to see instant savings and bank offers.

---

## ⚡ Key Features Included:
- **Price Comparison across Top Indian Stores:** Flipkart, Amazon India, Croma, Reliance Digital & Myntra.
- **Indian Bank & Card Discounts:** Verified offers for HDFC Bank, SBI Card, ICICI Bank, Axis Bank & UPI.
- **90-Day Price Tracker:** Interactive price history chart showing when prices drop to festive lows.
- **Live Extension Simulator:** Test how the browser extension works directly on the website without installing.
- **Customer Intelligence & CRM:** Segment shoppers by Recency, Frequency, and Monetary spend in Indian Rupees (₹).
