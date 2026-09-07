import { useNavigate } from "@tanstack/react-router";

import { EllipsisVertical, LogOut, Settings, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getInitials } from "@/lib/utils";

import { COPILOT_ID, conversations, currentUser, navItems } from "./data";
import { useChat } from "./use-chat";

export function ChatSidebar() {
  const { state } = useSidebar();
  const [chat, setChat] = useChat();
  const navigate = useNavigate();
  const _isCollapsed = state === "collapsed";

  const firstHigh = conversations.find((c) => c.contact.tags.includes("high")) ?? conversations[0];

  function handleNav(id: string) {
    if (id === "copilot") {
      setChat({ selected: COPILOT_ID });
    } else if (id === "flagged") {
      setChat({ selected: firstHigh.id });
    } else if (id === "threads") {
      setChat({ selected: conversations[0].id });
    } else {
      void navigate({
        to: "/dashboard/works",
        search: { lens: "needs-review", state: "", district: "", type: "", q: "" },
      });
    }
  }

  function isNavActive(id: string): boolean {
    if (id === "copilot") {
      return chat.selected === COPILOT_ID;
    }
    if (id === "flagged") {
      return chat.selected === firstHigh.id;
    }
    return false;
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! **:data-[sidebar=sidebar]:bg-background"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  className="[&_svg]:size-3.5"
                  size="sm"
                  isActive={isNavActive(item.id)}
                  tooltip={item.title}
                  onClick={() => handleNav(item.id)}
                >
                  <item.icon />
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
                {item.label && <SidebarMenuBadge className="font-medium">{item.label}</SidebarMenuBadge>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar>
                  <AvatarFallback className="text-xs">{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{currentUser.name}</span>
                  <span className="truncate text-muted-foreground text-xs">{currentUser.email}</span>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56" side="top">
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar>
                      <AvatarFallback className="text-xs">{getInitials(currentUser.name)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{currentUser.name}</span>
                      <span className="truncate text-muted-foreground text-xs">{currentUser.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserRound />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
