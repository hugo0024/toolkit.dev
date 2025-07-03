"use client";

import * as React from "react";
import { Anvil, ChevronsUpDown, Plus, Loader2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { api } from "@/trpc/react";
import { usePathname, useRouter } from "next/navigation";
import { ToolkitIcons } from "@/components/toolkit/toolkit-icons";
import type { Toolkits } from "@/toolkits/toolkits/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function WorkbenchSelect() {
  const { isMobile, open, setOpenMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const isMobileDevice = useIsMobile();
  const [navigatingTo, setNavigatingTo] = React.useState<string | null>(null);
  const [targetPath, setTargetPath] = React.useState<string | null>(null);

  const workbenchId = pathname.split("/")[2];

  const [
    workbenches,
    { isLoading, fetchNextPage, hasNextPage, isFetchingNextPage },
  ] = api.workbenches.getWorkbenches.useSuspenseInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextCursor : undefined,
    },
  );

  const isWorkbench =
    pathname.startsWith("/workbench/") && workbenchId !== "new";
  const workbench = workbenches.pages[0]?.items.find(
    (workbench) => workbench.id === workbenchId,
  );

  // Reset loading state when navigation is complete
  React.useEffect(() => {
    if (navigatingTo && targetPath && pathname === targetPath) {
      setNavigatingTo(null);
      setTargetPath(null);
    }
  }, [pathname, targetPath, navigatingTo]);

  const handleWorkbenchNavigation = async (href: string, workbenchName: string) => {
    if (isMobileDevice) {
      // On mobile: Close sidebar first, then start loading state
      setOpenMobile(false);
      
      // Small delay to let sidebar closing animation start smoothly
      setTimeout(async () => {
        setNavigatingTo(workbenchName);
        setTargetPath(href);
        try {
          await router.push(href);
        } catch (error) {
          console.error('Navigation error:', error);
          setNavigatingTo(null);
          setTargetPath(null);
        }
      }, 100);
    } else {
      // On desktop: Normal flow
      setNavigatingTo(workbenchName);
      setTargetPath(href);
      
      try {
        await router.push(href);
      } catch (error) {
        console.error('Navigation error:', error);
        setNavigatingTo(null);
        setTargetPath(null);
      }
    }
  };

  return (
    <SidebarGroup className="p-0">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className={cn(
                  "bg-sidebar-accent text-sidebar-accent-foreground cursor-pointer transition-all duration-200 ease-in-out",
                  open
                    ? "justify-between"
                    : "min-h-[2.5rem] justify-center px-2",
                )}
              >
                {open ? (
                  <>
                    <HStack className="min-w-0 flex-1 gap-2">
                      <Anvil className="size-4 flex-shrink-0" />
                      <span className="truncate">
                        {isWorkbench
                          ? isLoading
                            ? "Loading..."
                            : workbench?.name
                          : "Default Workbench"}
                      </span>
                    </HStack>
                    <ChevronsUpDown className="ml-auto size-4 flex-shrink-0" />
                  </>
                ) : (
                  <Anvil className="size-4" />
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Workbenches
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className={cn(
                  "gap-2 p-2 cursor-pointer transition-opacity duration-200",
                  navigatingTo === "Default Workbench" && "opacity-60"
                )} 
                onSelect={(e) => {
                  e.preventDefault();
                  handleWorkbenchNavigation("/", "Default Workbench");
                }}
              >
                <div className="flex items-center gap-2 w-full">
                  {navigatingTo === "Default Workbench" && (
                    <Loader2 className="size-3 animate-spin text-muted-foreground" />
                  )}
                  <span className={cn(
                    "truncate font-medium transition-opacity duration-200",
                    navigatingTo === "Default Workbench" && "opacity-70"
                  )}>
                    Default Workbench
                  </span>
                </div>
              </DropdownMenuItem>
              {workbenches.pages
                .flatMap((page) => page.items)
                .map((workbench) => (
                  <DropdownMenuItem
                    key={workbench.id}
                    className={cn(
                      "justify-between gap-2 p-2 cursor-pointer transition-opacity duration-200",
                      navigatingTo === workbench.name && "opacity-60"
                    )}
                    onSelect={(e) => {
                      e.preventDefault();
                      handleWorkbenchNavigation(`/workbench/${workbench.id}`, workbench.name);
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {navigatingTo === workbench.name && (
                        <Loader2 className="size-3 animate-spin text-muted-foreground" />
                      )}
                      <span className={cn(
                        "truncate font-medium transition-opacity duration-200",
                        navigatingTo === workbench.name && "opacity-70"
                      )}>
                        {workbench.name}
                      </span>
                    </div>
                    <ToolkitIcons
                      toolkits={workbench.toolkitIds as Toolkits[]}
                      iconClassName="size-3"
                      iconContainerClassName="p-1"
                    />
                  </DropdownMenuItem>
                ))}
              {hasNextPage && (
                <DropdownMenuItem className="gap-2 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                  </Button>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className={cn(
                  "gap-2 p-2 cursor-pointer transition-opacity duration-200",
                  navigatingTo === "New Workbench" && "opacity-60"
                )}
                onSelect={(e) => {
                  e.preventDefault();
                  handleWorkbenchNavigation("/workbench/new", "New Workbench");
                }}
              >
                <div className="flex items-center gap-2">
                  {navigatingTo === "New Workbench" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  <div className={cn(
                    "text-muted-foreground font-medium transition-opacity duration-200",
                    navigatingTo === "New Workbench" && "opacity-70"
                  )}>
                    New Workbench
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
