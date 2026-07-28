export const RETURN_POLICY = {
  windowDays: 30,
  conditions: [
    "Items must be unused",
    "Original packaging required",
  ],
  summary:
    "Our return policy allows returns within 30 days of purchase. Items must be unused and in their original packaging.",
  link: "#returns",
  linkLabel: "View Return Policy",
};

export const SHIPPING_INFO = {
  standard: {
    label: "Standard Shipping",
    days: "3–5 business days",
  },
  expedited: {
    label: "Expedited Shipping",
    days: "1–2 business days",
  },
  summary:
    "Standard shipping typically takes 3–5 business days. Expedited shipping takes 1–2 business days.",
};

export const PRODUCT_CATEGORIES = [
  {
    id: "hiking",
    label: "🥾 Hiking",
    description: "hiking apparel and trail gear",
    // Short noun phrase used when composing the final, condition-aware
    // recommendation (see responseGenerator.ts). Category-level only —
    // no specific products, prices, or brands.
    gearPhrase: "trail-ready hiking gear",
  },
  {
    id: "camping",
    label: "⛺ Camping",
    description: "camping equipment and outdoor essentials",
    gearPhrase: "durable camping equipment",
  },
  {
    id: "cold-weather",
    label: "🧤 Cold Weather",
    description: "insulated outdoor apparel and cold-weather gear",
    gearPhrase: "insulated cold-weather gear",
  },
  {
    id: "everyday",
    label: "🌲 Everyday Outdoor",
    description: "versatile outdoor apparel and everyday outdoor gear",
    gearPhrase: "versatile everyday outdoor gear",
  },
];

export const CONDITIONS = [
  {
    id: "warm",
    label: "☀️ Warm Weather",
    // Adjective phrase used to describe the condition when composing the
    // final recommendation. Category-level only, no invented specifics.
    adjective: "warm-weather",
  },
  { id: "cold", label: "❄️ Cold Weather", adjective: "cold-weather" },
  { id: "rainy", label: "🌧️ Rainy Conditions", adjective: "rain-ready" },
  { id: "mixed", label: "🌤️ Mixed Conditions", adjective: "all-condition" },
];

export const QUICK_EXAMPLES = [
  "Where is my order?",
  "Track my package",
  "How do I return something?",
  "How long does shipping take?",
  "Recommend camping gear",
  "I want to talk to a human",
];
