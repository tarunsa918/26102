import { type CSSProperties, useEffect, useState } from "react";

import { cn } from "cn";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useIsLg } from "@/hooks/use-lg";
import { useIsMobile } from "@/hooks/use-mobile";

import { ChatConversationList } from "./chat-conversation-list";
import { ChatProfileDetails } from "./chat-profile-details";
import { ChatThread } from "./chat-thread";
import { answerCopilot } from "./copilot-brain";
import { COPILOT_ID, type Conversation, type Message } from "./data";
import { useChat } from "./use-chat";

interface ChatProps {
  conversations: Conversation[];
}

const COPILOT_STORAGE_KEY = "mplads-copilot-v1";

const MAX_COPILOT_STORED = 50;

function isStoredMessage(item: unknown): item is Message {
  if (typeof item !== "object" || item === null) {
    return false;
  }
  const record = item as Record<string, unknown>;
  return (
    typeof record.id === "number" &&
    (record.align === "start" || record.align === "end") &&
    typeof record.text === "string" &&
    typeof record.time === "string"
  );
}

function readCopilotStored(): Message[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(COPILOT_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return (parsed as unknown[]).filter(isStoredMessage);
  } catch {
    return [];
  }
}

export function Chat({ conversations }: ChatProps) {
  const [chat] = useChat();
  const [showContact, setShowContact] = useState(false);
  const [showThread, setShowThread] = useState(false);
  const [copilotExtra, setCopilotExtra] = useState<Message[]>(readCopilotStored);
  const isLg = useIsLg();
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      window.localStorage.setItem(COPILOT_STORAGE_KEY, JSON.stringify(copilotExtra.slice(-MAX_COPILOT_STORED)));
    } catch {
      // Private mode: copilot chat simply does not persist this session.
    }
  }, [copilotExtra]);

  const activeConversation = conversations.find((c) => c.id === chat.selected) ?? conversations[0];
  const isCopilot = activeConversation.id === COPILOT_ID;
  const visibleMessages = isCopilot ? [...activeConversation.messages, ...copilotExtra] : activeConversation.messages;

  function handleSend(text: string) {
    if (!isCopilot) {
      return;
    }
    const stamp = Date.now();
    setCopilotExtra((current) => [
      ...current,
      { id: stamp, align: "end", text, time: "now" },
      { id: stamp + 1, align: "start", text: answerCopilot(text), time: "now" },
    ]);
  }

  return (
    <>
      <div
        className="grid h-[calc(100svh-var(--header-height))] min-h-0 min-w-0 flex-1 grid-cols-1 overflow-hidden shadow-sm transition-[grid-template-columns] duration-300 ease-out *:min-h-0 *:min-w-0 md:grid-cols-[22.5rem_minmax(0,1fr)] md:*:first:border-r lg:grid-cols-[22.5rem_minmax(0,1fr)_var(--profile-width)]"
        style={
          {
            "--profile-width": showContact ? "20rem" : "0rem",
          } as CSSProperties
        }
      >
        <ChatConversationList
          conversations={conversations}
          className={cn(
            "transition-transform duration-300 ease-out will-change-transform max-md:col-start-1 max-md:row-start-1",
            showThread && "max-md:pointer-events-none max-md:-translate-x-full",
          )}
          onSelectConversation={() => setShowThread(true)}
        />
        <ChatThread
          contact={activeConversation.contact}
          messages={visibleMessages}
          onSendMessage={isCopilot ? handleSend : undefined}
          showBackButton={isMobile}
          onBack={() => setShowThread(false)}
          onOpenContact={() => setShowContact(true)}
          className={cn(
            "transition-transform duration-300 ease-out will-change-transform max-md:col-start-1 max-md:row-start-1",
            showThread ? "max-md:translate-x-0" : "max-md:pointer-events-none max-md:translate-x-full",
          )}
        />
        <div
          aria-hidden={!showContact}
          className={cn(
            "hidden overflow-hidden border-l transition-colors duration-300 lg:block",
            !showContact && "pointer-events-none border-l-transparent",
          )}
        >
          <div
            className={cn(
              "h-full w-80 transition-[opacity,transform] duration-300 ease-out",
              showContact ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
            )}
          >
            <ChatProfileDetails contact={activeConversation.contact} onClose={() => setShowContact(false)} />
          </div>
        </div>
      </div>

      {/* Tablet/Mobile: Sheet */}
      {!isLg && (
        <Sheet open={showContact} onOpenChange={setShowContact}>
          <SheetContent side="right" className="w-80 p-0" showCloseButton={false}>
            <SheetTitle className="sr-only">Contact profile</SheetTitle>
            <SheetDescription className="sr-only">View contact details and activity</SheetDescription>
            <ChatProfileDetails contact={activeConversation.contact} onClose={() => setShowContact(false)} />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
