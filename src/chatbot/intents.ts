export type Intent =
  | "ORDER_TRACKING"
  | "RETURNS"
  | "PRODUCT_RECOMMENDATION"
  | "SHIPPING"
  | "HUMAN_HANDOFF"
  | "MAIN_MENU"
  | "AFFIRMATIVE"
  | "NEGATIVE"
  | "UNKNOWN";

interface IntentRule {
  intent: Intent;
  keywords: string[];
  phrases: string[];
}

const INTENT_RULES: IntentRule[] = [
  {
    intent: "ORDER_TRACKING",
    // NOTE: "where" was intentionally removed from this list. It is a generic
    // question word that also appears in unrelated queries (e.g. "Where is my
    // banana?"), which previously caused any "where is my X" message to be
    // scored as ORDER_TRACKING regardless of what X was. Keywords here are
    // now specific to order/package/shipment context so arbitrary nouns no
    // longer qualify as a tracking request.
    keywords: ["track", "order", "package", "shipment", "parcel", "status"],
    phrases: [
      "where is my order",
      "track my order",
      "track my package",
      "where's my package",
      "wheres my package",
      "check my shipment",
      "order status",
      "status of my order",
      "i want to track",
      "where is my package",
      "can you tell me where my package is",
      "where is my shipment",
      "where is my delivery",
      "where's my delivery",
      "wheres my delivery",
      "track an order",
      "find my order",
      "my order",
    ],
  },
  {
    intent: "RETURNS",
    keywords: ["return", "exchange", "refund", "send back", "policy", "bring back"],
    phrases: [
      "i want to return",
      "how do i return",
      "can i exchange",
      "return policy",
      "return an item",
      "need to return",
      "send something back",
      "can i return",
      "how long do i have to return",
      "returns and exchanges",
      "returns & exchanges",
      "exchange this",
      "return my",
      "refund",
      "send back",
    ],
  },
  {
    intent: "PRODUCT_RECOMMENDATION",
    keywords: ["recommend", "suggestion", "gear", "find", "buy", "choose", "help me find", "what should", "product", "looking for"],
    phrases: [
      "what should i buy",
      "help me choose",
      "recommend something",
      "what do you recommend",
      "i need camping gear",
      "i need something for",
      "find a product",
      "help me find",
      "looking for gear",
      "product recommendation",
      "recommend camping",
      "recommend hiking",
      "suggest gear",
      "what gear",
      "camping gear",
      "hiking gear",
    ],
  },
  {
    intent: "SHIPPING",
    keywords: ["shipping", "delivery", "deliver", "arrive", "arrival", "ship", "expedited", "standard"],
    phrases: [
      "how long does shipping take",
      "shipping times",
      "when will my order arrive",
      "expedited shipping",
      "standard shipping",
      "how fast is shipping",
      "shipping information",
      "shipping info",
      "how long to deliver",
      "delivery time",
      "when will it arrive",
    ],
  },
  {
    intent: "HUMAN_HANDOFF",
    keywords: ["human", "agent", "person", "live", "support", "representative", "staff", "talk to", "speak to", "connect"],
    phrases: [
      "i want a human",
      "talk to an agent",
      "connect me to support",
      "i need a live agent",
      "can i speak to someone",
      "human please",
      "talk to a human",
      "live agent",
      "real person",
      "speak to an agent",
      "speak to someone",
      "connect me with someone",
      "talk to someone",
      "i need help from a person",
    ],
  },
  {
    intent: "MAIN_MENU",
    keywords: ["menu", "home", "start", "back", "restart", "beginning", "reset", "main"],
    phrases: [
      "main menu",
      "start over",
      "go back",
      "go home",
      "home",
      "restart",
      "reset",
      "back to menu",
      "show menu",
    ],
  },
  {
    intent: "AFFIRMATIVE",
    keywords: [],
    phrases: ["yes", "yeah", "yep", "sure", "ok", "okay", "yes please", "absolutely", "definitely", "of course", "sounds good", "yup"],
  },
  {
    intent: "NEGATIVE",
    keywords: [],
    phrases: ["no", "nope", "no thanks", "not now", "i'm good", "im good", "no thank you", "nah"],
  },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function recognizeIntent(userInput: string): Intent {
  const normalized = normalize(userInput);

  // Exact / substring phrase match first (highest priority)
  for (const rule of INTENT_RULES) {
    for (const phrase of rule.phrases) {
      if (normalized === phrase || normalized.includes(phrase)) {
        return rule.intent;
      }
    }
  }

  // Keyword scoring
  const scores: Partial<Record<Intent, number>> = {};
  for (const rule of INTENT_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (normalized.includes(kw)) {
        score++;
      }
    }
    if (score > 0) {
      scores[rule.intent] = (scores[rule.intent] ?? 0) + score;
    }
  }

  if (Object.keys(scores).length > 0) {
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return best[0] as Intent;
  }

  return "UNKNOWN";
}
