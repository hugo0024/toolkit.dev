import { memo, useState, useEffect } from "react";

import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  Globe,
  Lock,
  MoreHorizontal,
  Share,
  Trash,
  GitBranch,
  Loader2,
} from "lucide-react";
import { useUpdateChatVisibility } from "@/app/_hooks/use-chat-visibility";

import type { Chat } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const PureChatItem = ({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
}) => {
  const updateChatVisibility = useUpdateChatVisibility();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const targetHref = `${
    chat.workbenchId ? `/workbench/${chat.workbenchId}` : ""
  }/${chat.id}`;

  // Reset loading state when navigation is complete
  useEffect(() => {
    if (isNavigating && targetPath && pathname === targetPath) {
      setIsNavigating(false);
      setTargetPath(null);
    }
  }, [pathname, targetPath, isNavigating]);

  const handleNavigation = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isMobile) {
      // On mobile: Close sidebar first, then start loading state
      setOpenMobile(false);
      
      // Small delay to let sidebar closing animation start smoothly
      setTimeout(async () => {
        setIsNavigating(true);
        setTargetPath(targetHref);
        try {
          await router.push(targetHref);
        } catch (error) {
          console.error('Navigation error:', error);
          setIsNavigating(false);
          setTargetPath(null);
        }
      }, 100);
    } else {
      // On desktop: Normal flow
      setIsNavigating(true);
      setTargetPath(targetHref);
      
      try {
        await router.push(targetHref);
      } catch (error) {
        console.error('Navigation error:', error);
        setIsNavigating(false);
        setTargetPath(null);
      }
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        className={cn(
          "transition-opacity duration-200",
          isNavigating && "opacity-60"
        )}
      >
        <Link
          href={targetHref}
          onClick={handleNavigation}
          className={cn(
            "cursor-pointer transition-all duration-200",
            isNavigating && "pointer-events-none"
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            {isNavigating ? (
              <Loader2 className="size-3 shrink-0 animate-spin text-muted-foreground" />
            ) : chat.parentChatId ? (
              <GitBranch className="text-muted-foreground size-3 shrink-0" />
            ) : null}
            <span className={cn(
              "truncate transition-opacity duration-200",
              isNavigating && "opacity-70"
            )}>
              {chat.title}
            </span>
          </div>
        </Link>
      </SidebarMenuButton>

      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
            showOnHover={!isActive}
            disabled={isNavigating}
          >
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex cursor-pointer items-center gap-2">
              <Share className="size-4" />
              <span>Share</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={8}>
                <DropdownMenuItem
                  className="cursor-pointer flex-row justify-between"
                  onClick={() => {
                    updateChatVisibility.mutate({
                      id: chat.id,
                      visibility: "private",
                    });
                  }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <Lock size={12} />
                    <span>Private</span>
                  </div>
                  {chat.visibility === "private" ? (
                    <Check className="size-4" />
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer flex-row justify-between"
                  onClick={() => {
                    updateChatVisibility.mutate({
                      id: chat.id,
                      visibility: "public",
                    });
                  }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <Globe />
                    <span>Public</span>
                  </div>
                  {chat.visibility === "public" ? (
                    <Check className="size-4" />
                  ) : null}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/15 focus:text-destructive cursor-pointer"
            onSelect={() => onDelete(chat.id)}
          >
            <Trash className="text-destructive size-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});
