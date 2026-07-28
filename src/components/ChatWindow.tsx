import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { QuickActions } from "./QuickActions";
import { TypingIndicator } from "./TypingIndicator";
import {
  BotMessage,
  getWelcomeMessages,
  processUserInput,
} from "../chatbot/responseGenerator";
import {
  ConversationContext,
  createInitialContext,
} from "../chatbot/conversationEngine";

export interface ChatWindowHandle {
  sendMessage: (text: string) => void;
}

export const ChatWindow = forwardRef<ChatWindowHandle, object>(
  (_props, ref) => {
    const [messages, setMessages] = useState<BotMessage[]>([]);
    const [context, setContext] = useState<ConversationContext>(
      createInitialContext()
    );
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isProcessing = useRef(false);
    const contextRef = useRef<ConversationContext>(context);

    // Keep contextRef in sync
    useEffect(() => {
      contextRef.current = context;
    }, [context]);

    // Initialize with welcome messages (guarded so it can never duplicate
    // the greeting even if this effect were ever invoked more than once)
    useEffect(() => {
      setMessages((prev) => (prev.length > 0 ? prev : getWelcomeMessages()));
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const deliverBotMessages = useCallback(
      async (botMessages: BotMessage[], newContext: ConversationContext) => {
        for (let i = 0; i < botMessages.length; i++) {
          setIsTyping(true);
          const delay = Math.min(
            1400,
            Math.max(600, botMessages[i].text.length * 8)
          );
          await new Promise((r) => setTimeout(r, delay));
          setIsTyping(false);
          setMessages((prev) => [...prev, botMessages[i]]);
          if (i < botMessages.length - 1) {
            await new Promise((r) => setTimeout(r, 150));
          }
        }
        setContext(newContext);
        isProcessing.current = false;
      },
      []
    );

    const handleUserMessage = useCallback(
      (text: string, displayText?: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;

        // Determine if this is an internal command (no user bubble)
        const isMainMenuCmd = text === "__MAIN_MENU__";
        const isContinueCmd = text === "__CONTINUE_CHATBOT__";
        const isTryAgainCmd = text === "__TRY_ORDER_AGAIN__";
        const isReturnsLink = text === "__RETURNS_LINK__";
        const isProductCat = text.startsWith("__PRODUCT_CAT__");
        const isCondition = text.startsWith("__CONDITION__");

        const showUserBubble =
          !isMainMenuCmd &&
          !isContinueCmd &&
          !isTryAgainCmd &&
          !isReturnsLink;

        // For product/condition buttons, show display text
        const bubbleText =
          isProductCat || isCondition
            ? displayText ?? text
            : displayText ?? text;

        if (showUserBubble) {
          const userMsg: BotMessage = {
            id: `user-${Date.now()}-${Math.random()}`,
            role: "user",
            text: bubbleText,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, userMsg]);
        }

        const { messages: botMessages, newContext } = processUserInput(
          text,
          contextRef.current
        );
        deliverBotMessages(botMessages, newContext);
      },
      [deliverBotMessages]
    );

    const handleButtonClick = useCallback(
      (value: string, label: string) => {
        handleUserMessage(value, label);
      },
      [handleUserMessage]
    );

    const handleReset = useCallback(() => {
      isProcessing.current = false;
      setIsTyping(false);
      const newCtx = createInitialContext();
      setContext(newCtx);
      contextRef.current = newCtx;
      const welcome = getWelcomeMessages();
      setMessages(welcome);
    }, []);

    const handleMainMenu = useCallback(() => {
      handleUserMessage("__MAIN_MENU__", "🏠 Main Menu");
    }, [handleUserMessage]);

    // Expose sendMessage for external callers (e.g., example panel)
    useImperativeHandle(ref, () => ({
      sendMessage: (text: string) => {
        handleUserMessage(text);
      },
    }));

    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <ChatHeader
          isLiveAgent={context.isLiveAgent}
          onReset={handleReset}
          onMainMenu={handleMainMenu}
        />

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-slate-50 to-gray-50">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onButtonClick={handleButtonClick}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions bar */}
        <QuickActions onAction={handleButtonClick} />

        {/* Input */}
        <ChatInput
          onSend={handleUserMessage}
          placeholder={
            context.state === "WAITING_FOR_ORDER_NUMBER"
              ? "Enter your order number (e.g. 111, 222, 333)..."
              : "Type a message or choose an option above..."
          }
        />
      </div>
    );
  }
);

ChatWindow.displayName = "ChatWindow";
