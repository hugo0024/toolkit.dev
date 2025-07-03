import { Logo } from "@/components/ui/logo";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { AccountButton } from "./account-button";
import { ColorModeToggle } from "./color-mode-toggle";
import { HStack } from "@/components/ui/stack";
import { auth } from "@/server/auth";

export const Navbar = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <HStack className="bg-background sticky top-0 z-10 justify-between p-2 md:hidden">
      <HStack>
        <SidebarTrigger />
        <Logo className="size-6" />
        <h1 className="overflow-hidden text-lg font-bold whitespace-nowrap">
          K-Chat.ai
        </h1>
      </HStack>
      <HStack>
        <AccountButton />
        <ColorModeToggle />
      </HStack>
    </HStack>
  );
};
