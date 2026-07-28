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
  { id: "hiking", label: "🥾 Hiking", description: "hiking apparel and trail gear" },
  { id: "camping", label: "⛺ Camping", description: "camping equipment and outdoor essentials" },
  { id: "cold-weather", label: "🧤 Cold Weather", description: "insulated outdoor apparel and cold-weather gear" },
  { id: "everyday", label: "🌲 Everyday Outdoor", description: "versatile outdoor apparel and everyday outdoor gear" },
];

export const CONDITIONS = [
  { id: "warm", label: "☀️ Warm Weather" },
  { id: "cold", label: "❄️ Cold Weather" },
  { id: "rainy", label: "🌧️ Rainy Conditions" },
  { id: "mixed", label: "🌤️ Mixed Conditions" },
];

export const QUICK_EXAMPLES = [
  "Where is my order?",
  "Track my package",
  "How do I return something?",
  "How long does shipping take?",
  "Recommend camping gear",
  "I want to talk to a human",
];
