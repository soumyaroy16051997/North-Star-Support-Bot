export type ConversationState =
  | "MAIN_MENU"
  | "WAITING_FOR_ORDER_NUMBER"
  | "ORDER_RESULT"
  | "RETURNS"
  | "PRODUCT_RECOMMENDATION_Q1"
  | "PRODUCT_RECOMMENDATION_Q2"
  | "PRODUCT_RECOMMENDATION_RESULT"
  | "SHIPPING"
  | "LIVE_AGENT"
  | "FALLBACK";

export interface ConversationContext {
  state: ConversationState;
  selectedProductCategory: string | null;
  selectedCondition: string | null;
  lastOrderNumber: string | null;
  isLiveAgent: boolean;
}

export function createInitialContext(): ConversationContext {
  return {
    state: "MAIN_MENU",
    selectedProductCategory: null,
    selectedCondition: null,
    lastOrderNumber: null,
    isLiveAgent: false,
  };
}

export function transitionState(
  ctx: ConversationContext,
  nextState: ConversationState
): ConversationContext {
  return {
    ...ctx,
    state: nextState,
    isLiveAgent: nextState === "LIVE_AGENT",
  };
}
