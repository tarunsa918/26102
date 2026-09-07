import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { SidebarProvider } from "@/components/ui/sidebar";

import { Chat } from "./-components/chat";
import { ChatHeader } from "./-components/chat-header";
import { ChatSidebar } from "./-components/chat-sidebar";
import { conversations } from "./-components/data";

export const Route = createFileRoute("/(main)/chat")({
  component: Page,
});

function Page() {
  const [query, setQuery] = useState("");
  const visible = conversations.filter((conversation) => {
    const haystack = `${conversation.name} ${conversation.subject} ${conversation.preview}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <ChatHeader query={query} onQueryChange={setQuery} />
        <div className="flex flex-1">
          <ChatSidebar />
          <Chat conversations={visible} />
        </div>
      </SidebarProvider>
    </div>
  );
}
