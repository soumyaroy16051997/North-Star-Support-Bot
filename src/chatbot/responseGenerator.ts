import { recognizeIntent } from "./intents";
import {
  ConversationContext,
  createInitialContext,
  transitionState,
} from "./conversationEngine";
import { lookupOrder } from "../data/orders";
import {
  RETURN_POLICY,
  SHIPPING_INFO,
  PRODUCT_CATEGORIES,
  CONDITIONS,
} from "../data/supportInfo";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MessageRole = "bot" | "user";

export interface QuickButton {
  label: string;
  value: string;
  variant?: "primary" | "secondary" | "success" | "danger";
}

export interface BotMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  buttons?: QuickButton[];
  isLink?: { href: string; label: string };
  isLiveAgentIndicator?: boolean;
}

export interface EngineResponse {
  messages: BotMessage[];
  newContext: ConversationContext;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _msgCounter = 0;
function uid(): string {
  return `msg-${Date.now()}-${_msgCounter++}`;
}

function bot(
  text: string,
  buttons?: QuickButton[],
  extra?: Partial<BotMessage>
): BotMessage {
  return {
    id: uid(),
    role: "bot",
    text,
    timestamp: new Date(),
    buttons,
    ...extra,
  };
}

const MAIN_MENU_BUTTONS: QuickButton[] = [
  { label: "📦 Track My Order", value: "Track my order", variant: "primary" },
  { label: "🔄 Returns & Exchanges", value: "Returns & Exchanges", variant: "primary" },
  { label: "🎒 Product Recommendations", value: "Product Recommendations", variant: "primary" },
  { label: "🚚 Shipping Information", value: "Shipping Information", variant: "primary" },
  { label: "👤 Talk to a Live Agent", value: "Talk to a live agent", variant: "secondary" },
];

const BACK_AND_AGENT_BUTTONS: QuickButton[] = [
  { label: "🏠 Main Menu", value: "__MAIN_MENU__", variant: "secondary" },
  { label: "👤 Talk to a Live Agent", value: "Talk to a live agent", variant: "secondary" },
];

// ─── Welcome / Main Menu ──────────────────────────────────────────────────────

export function getWelcomeMessages(): BotMessage[] {
  return [
    bot(
      "Hey there! 🏕️ Welcome to **North Star Support Bot** — your outdoor adventure support companion!",
      undefined
    ),
    bot(
      "I can help you with:\n• 📦 Order tracking\n• 🔄 Returns & exchanges\n• 🎒 Product recommendations\n• 🚚 Shipping information\n• 👤 Live agent support\n\nWhat can I help you with today?",
      MAIN_MENU_BUTTONS
    ),
  ];
}

function getMainMenuResponse(_ctx: ConversationContext): EngineResponse {
  const newCtx = {
    ...createInitialContext(),
    isLiveAgent: false,
  };
  return {
    messages: [
      bot(
        "Of course! Here's the main menu. What can I help you with? 😊",
        MAIN_MENU_BUTTONS
      ),
    ],
    newContext: newCtx,
  };
}

// ─── Order Tracking ───────────────────────────────────────────────────────────

function startOrderTracking(ctx: ConversationContext): EngineResponse {
  return {
    messages: [
      bot("Sure! Please enter your order number (e.g. 111, 222, 333)."),
    ],
    newContext: transitionState(ctx, "WAITING_FOR_ORDER_NUMBER"),
  };
}

function handleOrderNumber(
  input: string,
  ctx: ConversationContext
): EngineResponse {
  const order = lookupOrder(input);

  if (!order) {
    return {
      messages: [
        bot(
          "I couldn't find that order number in our system. Please double-check the number and try again, or choose an option below.",
          [
            { label: "🔍 Try Again", value: "__TRY_ORDER_AGAIN__", variant: "primary" },
            ...BACK_AND_AGENT_BUTTONS,
          ]
        ),
      ],
      newContext: transitionState(ctx, "WAITING_FOR_ORDER_NUMBER"),
    };
  }

  const newCtx: ConversationContext = {
    ...transitionState(ctx, "ORDER_RESULT"),
    lastOrderNumber: order.orderNumber,
  };

  if (order.isDelivered) {
    return {
      messages: [
        bot(
          `📦 Order **#${order.orderNumber}** Status: **${order.statusDetail}**\n\nYour order has been delivered! 🎉 If you have an issue with a missing package, damaged item, or need further assistance, I can connect you with a live agent.`,
          [
            { label: "👤 Talk to a Live Agent", value: "Talk to a live agent", variant: "primary" },
            { label: "🔍 Track Another Order", value: "Track my order", variant: "secondary" },
            { label: "🏠 Main Menu", value: "__MAIN_MENU__", variant: "secondary" },
          ]
        ),
      ],
      newContext: newCtx,
    };
  }

  return {
    messages: [
      bot(
        `📦 Order **#${order.orderNumber}** Status: **${order.statusDetail}**`,
        [
          { label: "🔍 Track Another Order", value: "Track my order", variant: "primary" },
          { label: "🏠 Main Menu", value: "__MAIN_MENU__", variant: "secondary" },
          { label: "👤 Talk to a Live Agent", value: "Talk to a live agent", variant: "secondary" },
        ]
      ),
    ],
    newContext: newCtx,
  };
}

// ─── Returns & Exchanges ──────────────────────────────────────────────────────

function handleReturns(ctx: ConversationContext): EngineResponse {
  return {
    messages: [
      bot(
        `🔄 **Return Policy**\n\n${RETURN_POLICY.summary}\n\n**Policy Details:**\n• ✅ 30-day return window from date of purchase\n• ✅ Items must be unused\n• ✅ Original packaging required\n\nIf you're unsure whether your item qualifies, a live agent can help review your specific situation.`,
        [
          { label: "📄 View Return Policy", value: "__RETURNS_LINK__", variant: "success" },
          ...BACK_AND_AGENT_BUTTONS,
        ],
        { isLink: { href: "#returns", label: "View Return Policy" } }
      ),
    ],
    newContext: transitionState(ctx, "RETURNS"),
  };
}

// ─── Shipping Info ────────────────────────────────────────────────────────────

function handleShipping(ctx: ConversationContext): EngineResponse {
  return {
    messages: [
      bot(
        `🚚 **Shipping Information**\n\n**${SHIPPING_INFO.standard.label}:** ${SHIPPING_INFO.standard.days}\n**${SHIPPING_INFO.expedited.label}:** ${SHIPPING_INFO.expedited.days}\n\nShipping times are estimated and may vary during peak seasons. We don't currently have specific information on international shipping, carriers, or guaranteed delivery dates.`,
        [
          { label: "📦 Track My Order", value: "Track my order", variant: "primary" },
          { label: "🏠 Main Menu", value: "__MAIN_MENU__", variant: "secondary" },
          { label: "👤 Talk to a Live Agent", value: "Talk to a live agent", variant: "secondary" },
        ]
      ),
    ],
    newContext: transitionState(ctx, "SHIPPING"),
  };
}

// ─── Product Recommendations ──────────────────────────────────────────────────

function startProductRecommendation(ctx: ConversationContext): EngineResponse {
  return {
    messages: [
      bot(
        "🎒 I'd be happy to help you find the right gear! First, what are you primarily shopping for?",
        PRODUCT_CATEGORIES.map((c) => ({
          label: c.label,
          value: `__PRODUCT_CAT__${c.id}`,
          variant: "primary" as const,
        }))
      ),
    ],
    newContext: transitionState(ctx, "PRODUCT_RECOMMENDATION_Q1"),
  };
}

function handleProductQ1(
  categoryId: string,
  ctx: ConversationContext
): EngineResponse {
  const category = PRODUCT_CATEGORIES.find((c) => c.id === categoryId);
  const label = category ? category.label : categoryId;

  const newCtx: ConversationContext = {
    ...transitionState(ctx, "PRODUCT_RECOMMENDATION_Q2"),
    selectedProductCategory: categoryId,
  };

  return {
    messages: [
      bot(
        `Great choice — **${label}**! 🙌\n\nOne more question: What conditions will you mainly be using your gear in?`,
        CONDITIONS.map((c) => ({
          label: c.label,
          value: `__CONDITION__${c.id}`,
          variant: "primary" as const,
        }))
      ),
    ],
    newContext: newCtx,
  };
}

function handleInvalidProductActivity(
  ctx: ConversationContext
): EngineResponse {
  return {
    messages: [
      bot(
        "Hmm, I didn't recognize that activity. 🤔 Please choose one of the options below, or describe what you're shopping for (e.g. hiking, camping, cold weather, everyday use).",
        PRODUCT_CATEGORIES.map((c) => ({
          label: c.label,
          value: `__PRODUCT_CAT__${c.id}`,
          variant: "primary" as const,
        }))
      ),
    ],
    // Stay on the activity-selection step instead of resetting.
    newContext: transitionState(ctx, "PRODUCT_RECOMMENDATION_Q1"),
  };
}

function handleInvalidProductCondition(
  ctx: ConversationContext
): EngineResponse {
  return {
    messages: [
      bot(
        "Hmm, I didn't recognize that condition. 🤔 Please choose one of the options below, or describe the conditions (e.g. warm, cold, rainy, mixed).",
        CONDITIONS.map((c) => ({
          label: c.label,
          value: `__CONDITION__${c.id}`,
          variant: "primary" as const,
        }))
      ),
    ],
    // Stay on the conditions-selection step instead of resetting.
    newContext: transitionState(ctx, "PRODUCT_RECOMMENDATION_Q2"),
  };
}

function handleProductQ2(
  conditionId: string,
  ctx: ConversationContext
): EngineResponse {
  const category = PRODUCT_CATEGORIES.find(
    (c) => c.id === ctx.selectedProductCategory
  );
  const condition = CONDITIONS.find((c) => c.id === conditionId);

  const gearPhrase = category?.gearPhrase ?? category?.description ?? "outdoor gear";
  const conditionAdjective = condition?.adjective ?? "versatile";

  const newCtx: ConversationContext = {
    ...transitionState(ctx, "PRODUCT_RECOMMENDATION_RESULT"),
    selectedCondition: conditionId,
  };

  // Category-level recommendation only — deterministically combines the
  // user's two selections (product category + conditions) without
  // inventing specific products, prices, brands, discounts, inventory,
  // or links.
  const rec =
    `Great choice! Based on your needs, I'd recommend looking at ${conditionAdjective} outdoor apparel and ${gearPhrase}.\n\n` +
    `Would you like to explore another product category, return to the main menu, or speak with a live agent?`;

  return {
    messages: [
      bot(rec, [
        { label: "🔄 Start New Recommendation", value: "Product Recommendations", variant: "primary" },
        { label: "🏠 Main Menu", value: "__MAIN_MENU__", variant: "secondary" },
        { label: "👤 Talk to a Live Agent", value: "Talk to a live agent", variant: "secondary" },
      ]),
    ],
    newContext: newCtx,
  };
}

// ─── Human Handoff ────────────────────────────────────────────────────────────

function handleLiveAgent(ctx: ConversationContext): EngineResponse {
  return {
    messages: [
      bot(
        "Absolutely! I'll connect you with a live agent right away. 🙌",
        undefined
      ),
      bot(
        "🟢 **Live Agent Mode**\n\nYou are now in our simulated Live Agent state. In a real deployment, a support representative would join this chat to assist you directly.\n\nThank you for your patience! A representative would typically respond within 2–5 minutes during business hours (Mon–Fri, 8 AM–6 PM MT).",
        [
          { label: "🏠 Return to Main Menu", value: "__MAIN_MENU__", variant: "primary" },
          { label: "💬 Continue with Chatbot", value: "__CONTINUE_CHATBOT__", variant: "secondary" },
        ],
        { isLiveAgentIndicator: true }
      ),
    ],
    newContext: transitionState(ctx, "LIVE_AGENT"),
  };
}

function handleLiveAgentContinue(_ctx: ConversationContext): EngineResponse {
  return {
    messages: [
      bot(
        "No problem! I'm still here to help. 😊 What else can I assist you with?",
        MAIN_MENU_BUTTONS
      ),
    ],
    newContext: {
      ...createInitialContext(),
      isLiveAgent: false,
    },
  };
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

function handleFallback(ctx: ConversationContext): EngineResponse {
  return {
    messages: [
      bot(
        "Sorry, I didn't quite understand that. 🤔 I'm best at helping with:\n\n• 📦 Order tracking\n• 🔄 Returns & exchanges\n• 🎒 Product recommendations\n• 🚚 Shipping information\n• 👤 Connecting you with a live agent\n\nWould you like to choose one of the options below?",
        [
          { label: "📦 Track an Order", value: "Track my order", variant: "primary" },
          { label: "🔄 Returns & Exchanges", value: "Returns & Exchanges", variant: "primary" },
          { label: "🎒 Find a Product", value: "Product Recommendations", variant: "primary" },
          { label: "🚚 Shipping", value: "Shipping Information", variant: "primary" },
          { label: "👤 Talk to a Live Agent", value: "Talk to a live agent", variant: "secondary" },
          { label: "🏠 Main Menu", value: "__MAIN_MENU__", variant: "secondary" },
        ]
      ),
    ],
    newContext: transitionState(ctx, "FALLBACK"),
  };
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export function processUserInput(
  rawInput: string,
  ctx: ConversationContext
): EngineResponse {
  const trimmed = rawInput.trim();

  // ── Special internal button values ──────────────────────────────────────────
  if (trimmed === "__MAIN_MENU__") return getMainMenuResponse(ctx);
  if (trimmed === "__CONTINUE_CHATBOT__") return handleLiveAgentContinue(ctx);
  if (trimmed === "__TRY_ORDER_AGAIN__") return startOrderTracking(ctx);
  if (trimmed === "__RETURNS_LINK__") {
    // Simulate navigating to return policy link
    return {
      messages: [
        bot(
          "📄 In a live deployment, clicking \"View Return Policy\" would open our full returns portal. Here's a summary of our policy:\n\n• **30-day return window**\n• Items must be **unused**\n• **Original packaging** required\n\nFor specific questions about your return, a live agent can help!",
          BACK_AND_AGENT_BUTTONS
        ),
      ],
      newContext: ctx,
    };
  }

  // ── Product category selection (Q1) ─────────────────────────────────────────
  if (trimmed.startsWith("__PRODUCT_CAT__")) {
    const categoryId = trimmed.replace("__PRODUCT_CAT__", "");
    return handleProductQ1(categoryId, ctx);
  }

  // ── Condition selection (Q2) ─────────────────────────────────────────────────
  if (trimmed.startsWith("__CONDITION__")) {
    const conditionId = trimmed.replace("__CONDITION__", "");
    return handleProductQ2(conditionId, ctx);
  }

  // ── State-specific handling ──────────────────────────────────────────────────
  if (ctx.state === "WAITING_FOR_ORDER_NUMBER") {
    // Check if user wants to go somewhere else instead
    const intent = recognizeIntent(trimmed);
    if (intent === "MAIN_MENU") return getMainMenuResponse(ctx);
    if (intent === "HUMAN_HANDOFF") return handleLiveAgent(ctx);
    // Otherwise treat as order number input
    return handleOrderNumber(trimmed, ctx);
  }

  if (ctx.state === "PRODUCT_RECOMMENDATION_Q1") {
    // Allow natural language to match a category
    const lc = trimmed.toLowerCase();
    if (lc.includes("hiking") || lc.includes("hike") || lc.includes("trail")) {
      return handleProductQ1("hiking", ctx);
    }
    if (lc.includes("camp")) return handleProductQ1("camping", ctx);
    if (lc.includes("cold") || lc.includes("winter") || lc.includes("snow")) {
      return handleProductQ1("cold-weather", ctx);
    }
    if (lc.includes("every") || lc.includes("daily") || lc.includes("casual")) {
      return handleProductQ1("everyday", ctx);
    }
    // Unrecognized activity: allow explicit navigation away (main menu /
    // live agent), otherwise stay in this step and ask again instead of
    // falling through to the generic global fallback.
    const q1Intent = recognizeIntent(trimmed);
    if (q1Intent === "MAIN_MENU") return getMainMenuResponse(ctx);
    if (q1Intent === "HUMAN_HANDOFF") return handleLiveAgent(ctx);
    return handleInvalidProductActivity(ctx);
  }

  if (ctx.state === "PRODUCT_RECOMMENDATION_Q2") {
    const lc = trimmed.toLowerCase();
    if (lc.includes("warm") || lc.includes("hot") || lc.includes("summer")) {
      return handleProductQ2("warm", ctx);
    }
    if (lc.includes("cold") || lc.includes("winter") || lc.includes("snow") || lc.includes("freez")) {
      return handleProductQ2("cold", ctx);
    }
    if (lc.includes("rain") || lc.includes("wet") || lc.includes("drizzle")) {
      return handleProductQ2("rainy", ctx);
    }
    if (lc.includes("mix") || lc.includes("vary") || lc.includes("all")) {
      return handleProductQ2("mixed", ctx);
    }
    // Unrecognized condition: allow explicit navigation away (main menu /
    // live agent), otherwise stay in this step and ask again instead of
    // falling through to the generic global fallback.
    const q2Intent = recognizeIntent(trimmed);
    if (q2Intent === "MAIN_MENU") return getMainMenuResponse(ctx);
    if (q2Intent === "HUMAN_HANDOFF") return handleLiveAgent(ctx);
    return handleInvalidProductCondition(ctx);
  }

  if (ctx.state === "LIVE_AGENT") {
    const intent = recognizeIntent(trimmed);
    if (intent === "MAIN_MENU") return getMainMenuResponse(ctx);
    // In live agent mode, gently remind user they're in simulated handoff
    return {
      messages: [
        bot(
          "You're currently in **Live Agent Mode** (simulated). A live agent would respond here. Would you like to return to the main menu or continue with the chatbot?",
          [
            { label: "🏠 Return to Main Menu", value: "__MAIN_MENU__", variant: "primary" },
            { label: "💬 Continue with Chatbot", value: "__CONTINUE_CHATBOT__", variant: "secondary" },
          ]
        ),
      ],
      newContext: ctx,
    };
  }

  // ── Global intent recognition ────────────────────────────────────────────────
  const intent = recognizeIntent(trimmed);

  switch (intent) {
    case "ORDER_TRACKING":
      return startOrderTracking(ctx);
    case "RETURNS":
      return handleReturns(ctx);
    case "PRODUCT_RECOMMENDATION":
      return startProductRecommendation(ctx);
    case "SHIPPING":
      return handleShipping(ctx);
    case "HUMAN_HANDOFF":
      return handleLiveAgent(ctx);
    case "MAIN_MENU":
      return getMainMenuResponse(ctx);
    default:
      return handleFallback(ctx);
  }
}
