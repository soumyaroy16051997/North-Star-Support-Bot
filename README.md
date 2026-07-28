# 🧭 North Star Support Bot

> A fully functional, simulated customer-support chatbot for an outdoor apparel and camping gear e-commerce business.

---

## Project Overview

**North Star Support Bot** is a client-side customer-support chatbot built with React, Vite, and Tailwind CSS. It simulates a real customer-support assistant for a fictional outdoor apparel and camping gear e-commerce company.

The chatbot uses deterministic, local intent recognition (keyword + phrase matching) — **no paid APIs, no API keys, no external services required**. Everything runs entirely in the browser.

---

## Features

| Feature | Description |
|---|---|
| 📦 **Order Tracking** | Look up mock orders #111, #222, #333 or detect invalid numbers |
| 🔄 **Returns & Exchanges** | Provide accurate 30-day return policy details with a simulated returns link |
| 🎒 **Product Recommendations** | 2-question guided flow → category-level recommendation |
| 🚚 **Shipping Information** | Standard and expedited shipping times |
| 👤 **Human Handoff** | Simulated live agent state with visible indicator |
| 🔀 **Intent Recognition** | Keyword + phrase matching for multiple phrasings |
| 💬 **Multiple Phrasing Support** | Many variations per intent (e.g. "where is my package?", "track my order") |
| 🔙 **Fallback Handling** | "I didn't understand" with full options including escalation |
| 🏠 **Main Menu Navigation** | Always-accessible return to main menu |
| 💡 **Try These Examples** | Collapsible suggestion panel for evaluators |

---

## Mock Order Data

Use these order numbers when testing the chatbot:

| Order | Status |
|---|---|
| **#111** | Shipped, arriving tomorrow |
| **#222** | Processing, ships in 24 hours |
| **#333** | Delivered |
| **Any other** | Invalid order (graceful error message) |

---

## Return Policy

- **30-day return window** from date of purchase
- Items must be **unused**
- **Original packaging** required
- Simulated returns link: `#returns`

---

## Shipping Information

| Method | Estimated Time |
|---|---|
| **Standard Shipping** | 3–5 business days |
| **Expedited Shipping** | 1–2 business days |

---

## Conversation States

The chatbot manages these conversation states:

```
MAIN_MENU
WAITING_FOR_ORDER_NUMBER
ORDER_RESULT
RETURNS
PRODUCT_RECOMMENDATION_Q1
PRODUCT_RECOMMENDATION_Q2
PRODUCT_RECOMMENDATION_RESULT
SHIPPING
LIVE_AGENT
FALLBACK
```

---

## How to Run

**Prerequisites:** Node.js 18+ and npm

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open your browser to `http://localhost:5173`

---

## Build

```bash
npm run build
```

The production build will be in the `dist/` directory.

---

## How to Test

### Full Test Checklist

1. **Order #111** — Type "Where is my order?" → Enter `111` → Should show "Shipped, arriving tomorrow"
2. **Order #222** — Type "Track my package" → Enter `222` → Should show "Processing, ships in 24 hours"
3. **Order #333** — Type "Track my order" → Enter `333` → Should show "Delivered" with helpful follow-up
4. **Invalid order** — Type "Check my shipment" → Enter `999` → Should show invalid order message
5. **Return policy** — Type "What is your return policy?" → Should show 30-day policy, unused items, original packaging, + View Return Policy link
6. **Shipping** — Type "How long does shipping take?" → Should show standard 3–5 days, expedited 1–2 days
7. **Product recommendation** — Type "Recommend camping gear" → Answer 2 questions → Get category recommendation
8. **Human handoff** — Type "I want to talk to a human" → Should show Live Agent Mode indicator
9. **Return to main menu after handoff** — Click "Return to Main Menu" → Main menu should appear and work
10. **Continue with chatbot after handoff** — Click "Continue with Chatbot" → Should return to normal chatbot flow
11. **Fallback** — Type "What is the meaning of life?" → Should show "I didn't understand" with options
12. **Multiple phrasings** — Try: "Where's my package?", "Can I exchange this?", "I need a human", "Go home", "Can I return my jacket?"

### Quick-Start Examples Panel

The sidebar contains a **"Try These Examples"** panel with clickable example phrases for easy testing.

---

## Intent Phrase Examples

### Order Tracking
- "Where is my order?"
- "Track my package"
- "What's the status of my order?"
- "I want to track an order"
- "Check my shipment"

### Returns & Exchanges
- "I want to return something"
- "How do I return an item?"
- "Can I exchange this?"
- "What's your return policy?"
- "I need to send something back"

### Product Recommendations
- "What should I buy?"
- "Help me choose gear"
- "Recommend something for hiking"
- "I need camping gear"

### Shipping
- "How long does shipping take?"
- "Shipping times"
- "When will my order arrive?"
- "Do you have expedited shipping?"

### Human Handoff
- "I want a human"
- "Talk to an agent"
- "Connect me to support"
- "I need a live agent"
- "Can I speak to someone?"

### Main Menu
- "Main menu"
- "Start over"
- "Go back"
- "Home"

---

## Project Structure

```
src/
  components/
    ChatWindow.tsx        # Main chat UI container with state management
    ChatMessage.tsx       # Individual message bubbles (bot + user)
    ChatHeader.tsx        # Header with brand, status, reset button
    ChatInput.tsx         # Text input + send button
    QuickActions.tsx      # Persistent quick-action buttons
    TypingIndicator.tsx   # Animated typing dots
    ExamplesPanel.tsx     # Collapsible "Try These Examples" panel

  data/
    orders.ts             # Mock order data (#111, #222, #333)
    supportInfo.ts        # Return policy, shipping info, product categories

  chatbot/
    intents.ts            # Intent recognition (keyword + phrase matching)
    conversationEngine.ts # Conversation state types and transitions
    responseGenerator.ts  # Core chatbot logic and response generation

  App.tsx                 # Root application component
  main.tsx                # React entry point
  index.css               # Global styles + animations

public/
README.md
package.json
index.html
```

---

## Deployment

### Netlify (recommended)
```bash
npm run build
# Drag the dist/ folder to netlify.com/drop
# OR connect your GitHub repository to Netlify
```

### Vercel
```bash
npm install -g vercel
vercel
```

### GitHub Pages
```bash
npm run build
# Push the dist/ folder contents to your gh-pages branch
```

**No API keys, environment variables, or external services are required for any deployment.**

---

## Technology Stack

| Tech | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Local state | Conversation management |
| Client-side logic | Intent recognition + response generation |

---

## Important Notes

- ✅ **100% free to run** — no paid services
- ✅ **No API keys required**
- ✅ **No environment variables**
- ✅ **No database**
- ✅ **No authentication**
- ✅ **Works offline** (after initial page load)
- ✅ **Fully responsive** (desktop, tablet, mobile)

---

## Suggested Video Demo Script (2–3 minutes)

**0:00–0:15** — Show the chatbot homepage and main menu. Point out the sidebar with test order numbers and example phrases.

**0:15–0:45** — Order Tracking:
- Type "Where is my order?"
- Enter order `111` → Show "Shipped, arriving tomorrow"
- Return to main menu, try `333` → Show "Delivered" with follow-up

**0:45–1:05** — Returns & Exchanges:
- Type "What is your return policy?"
- Show 30-day policy details
- Click "View Return Policy" simulated link

**1:05–1:30** — Product Recommendation:
- Type "Recommend camping gear"
- Answer Question 1: Choose "Camping"
- Answer Question 2: Choose "Rainy Conditions"
- Show category recommendation

**1:30–1:50** — Human Handoff:
- Type "I want to talk to a human"
- Show "Live Agent Mode" indicator
- Click "Return to Main Menu" → main menu works
- OR click "Continue with Chatbot" → back to normal flow

**1:50–2:10** — Fallback:
- Type "What is the meaning of life?"
- Show "Sorry, I didn't quite understand that" fallback
- Show all available options including live agent escalation
- Click any option to show it works

**2:10–2:30** — Wrap-up:
- Show GitHub repository structure
- Show README
- Confirm no API keys needed

---

*Built for evaluators: open the app and immediately start testing — no setup required beyond `npm install && npm run dev`.*
