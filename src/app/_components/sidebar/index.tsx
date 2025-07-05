import * as React from "react";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavMain } from "./main";
import { NavChats } from "./chats";
import { NavUser } from "./user";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { HStack } from "@/components/ui/stack";
import { WorkbenchSelect } from "./workbench-select";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [session] = await Promise.all([auth()]);

  if (!session) {
    return null;
  }

  if (session?.user) {
    void api.workbenches.getWorkbenches.prefetchInfinite({
      limit: 10,
    });
  }

  return (
    <HydrateClient>
      <Sidebar collapsible="icon" className="relative" {...props}>
        <SidebarHeader className="border-sidebar-border border-b p-3 group-data-[collapsible=icon]:p-2">
          <Link
            href="/"
            className="hover:bg-sidebar-accent/50 rounded-lg p-2 transition-colors group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
          >
            <HStack className="items-center group-data-[collapsible=icon]:justify-center">
              <Logo className="size-6 group-data-[collapsible=icon]:mx-auto" />
              <h1 className="shimmer-text overflow-hidden text-xl font-bold whitespace-nowrap group-data-[collapsible=icon]:hidden">
                K-Chat.ai
              </h1>
            </HStack>
          </Link>
          <div className="mt-2 group-data-[collapsible=icon]:mt-1">
            <WorkbenchSelect />
          </div>
        </SidebarHeader>
        <SidebarContent className="gap-0 pt-2">
          <NavMain />
          <NavChats />
        </SidebarContent>
        <SidebarFooter className="flex flex-col gap-2 p-3 group-data-[collapsible=icon]:p-2">
          <SidebarMenuButton
            asChild
            className="hover:bg-sidebar-accent/50 h-fit w-full rounded-lg p-2 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
          >
            
          </SidebarMenuButton>
          <NavUser
            user={{
              name: session.user.name ?? "User",
              email: session.user.email ?? "",
              avatar: session.user.image ?? "",
            }}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </HydrateClient>
  );
}
