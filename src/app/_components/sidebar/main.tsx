"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { Edit, Loader2 } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const NavMain = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const workbenchId =
    pathname.split("/")[2] === "new" ? undefined : pathname.split("/")[2];

  const targetHref = workbenchId ? `/workbench/${workbenchId}` : "/";

  // Reset loading state when navigation is complete
  useEffect(() => {
    if (isNavigating && targetPath && pathname === targetPath) {
      setIsNavigating(false);
      setTargetPath(null);
    }
  }, [pathname, targetPath, isNavigating]);

  const handleNewChatNavigation = async (e: React.MouseEvent) => {
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

  const items = [
    {
      title: "New Chat",
      url: targetHref,
      icon: Edit,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              key={item.title} 
              tooltip={item.title} 
              asChild
              className={cn(
                "transition-opacity duration-200",
                isNavigating && "opacity-60"
              )}
            >
              <Link 
                href={item.url}
                onClick={handleNewChatNavigation}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  isNavigating && "pointer-events-none"
                )}
              >
                {isNavigating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  item.icon && <item.icon />
                )}
                <span className={cn(
                  "transition-opacity duration-200",
                  isNavigating && "opacity-70"
                )}>
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
