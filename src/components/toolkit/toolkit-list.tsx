import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Info } from "lucide-react";
import { HStack, VStack } from "@/components/ui/stack";
import { clientToolkits } from "@/toolkits/toolkits/client";
import type { ClientToolkit } from "@/toolkits/types";
import type { Toolkits } from "@/toolkits/toolkits/shared";
import { ClientToolkitConfigure } from "@/components/toolkit/toolkit-configure";
import type { SelectedToolkit } from "./types";
import { toolkitGroups } from "@/toolkits/toolkit-groups";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ToolkitListProps {
  selectedToolkits: SelectedToolkit[];
  onAddToolkit: (toolkit: SelectedToolkit) => void;
  onRemoveToolkit: (id: Toolkits) => void;
  isMobile?: boolean;
}

export const ToolkitList: React.FC<ToolkitListProps> = ({
  selectedToolkits,
  onAddToolkit,
  onRemoveToolkit,
  isMobile = false,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const updatedToolkits = Object.entries(clientToolkits).filter(([id]) => {
      return (
        searchParams.get(id) === "true" &&
        !selectedToolkits.some((t) => t.id === (id as Toolkits))
      );
    });

    if (updatedToolkits.length > 0) {
      updatedToolkits.forEach(([id, toolkit]) => {
        onAddToolkit({
          id: id as Toolkits,
          parameters: {},
          toolkit: toolkit as ClientToolkit,
        });
      });
      window.history.replaceState({}, "", pathname);
    }
  }, [searchParams, onAddToolkit, selectedToolkits, router, pathname]);

  return (
    <TooltipProvider>
      <VStack className={cn("w-full items-start", isMobile ? "gap-6" : "gap-4")}>
        {toolkitGroups.map((group) => {
          return (
            <VStack key={group.id} className="w-full items-start">
              <HStack className={cn("gap-2", isMobile && "mb-2")}>
                <group.icon className={cn(isMobile ? "size-5" : "size-4")} />
                <h3 className={cn("font-bold", isMobile ? "text-base" : "text-sm")}>
                  {group.name}
                </h3>
              </HStack>
              <div className="bg-muted/50 w-full rounded-md border">
                {Object.entries(clientToolkits)
                  .filter(([, toolkit]) => toolkit.type === group.id)
                  .map(([id, toolkit]) => {
                    return (
                      <ToolkitItem
                        key={id}
                        id={id as Toolkits}
                        toolkit={toolkit as ClientToolkit}
                        selectedToolkits={selectedToolkits}
                        onAddToolkit={onAddToolkit}
                        onRemoveToolkit={onRemoveToolkit}
                        isMobile={isMobile}
                      />
                    );
                  })}
              </div>
            </VStack>
          );
        })}
      </VStack>
    </TooltipProvider>
  );
};

interface ToolkitItemProps {
  id: Toolkits;
  toolkit: ClientToolkit;
  selectedToolkits: SelectedToolkit[];
  onAddToolkit: (toolkit: SelectedToolkit) => void;
  onRemoveToolkit: (id: Toolkits) => void;
  isMobile?: boolean;
}

const ToolkitItem = ({
  id,
  toolkit,
  selectedToolkits,
  onAddToolkit,
  onRemoveToolkit,
  isMobile = false,
}: ToolkitItemProps) => {
  const [configSheetOpen, setConfigSheetOpen] = useState(false);
  const isSelected = selectedToolkits.some((t) => t.id === id);
  const needsConfiguration = Object.keys(toolkit.parameters.shape).length > 0;

  const handleConfigurationComplete = (toolkitToAdd: SelectedToolkit) => {
    onAddToolkit(toolkitToAdd);
    setConfigSheetOpen(false);
  };

  const addToolkitButtons = isSelected ? (
    <Button
      size={isMobile ? "default" : "sm"}
      onClick={() => onRemoveToolkit(id)}
      className="user-message"
      type="button"
    >
      Active
    </Button>
  ) : needsConfiguration ? (
    isMobile ? (
      <>
        <Button
          variant="outline"
          size="default"
          className="bg-transparent"
          type="button"
          onClick={() => setConfigSheetOpen(true)}
        >
          Add
          <Plus className="size-4" />
        </Button>
        <Sheet open={configSheetOpen} onOpenChange={setConfigSheetOpen}>
          <SheetContent side="bottom" className="h-[80vh] p-0 flex flex-col">
            <SheetHeader className="p-4 border-b flex-shrink-0">
              <SheetTitle>Configure {toolkit.name}</SheetTitle>
              <SheetDescription>
                Set up this toolkit before adding it to your chat
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <ClientToolkitConfigure
                toolkit={toolkit}
                id={id}
                schema={toolkit.parameters}
                onAdd={handleConfigurationComplete}
              />
            </div>
          </SheetContent>
        </Sheet>
      </>
    ) : (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            type="button"
          >
            Add
            <Plus className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <ClientToolkitConfigure
            toolkit={toolkit}
            id={id}
            schema={toolkit.parameters}
            onAdd={onAddToolkit}
          />
        </PopoverContent>
      </Popover>
    )
  ) : (
    <Button
      variant="outline"
      size={isMobile ? "default" : "sm"}
      onClick={() => onAddToolkit({ id, toolkit, parameters: {} })}
      className="bg-transparent"
      type="button"
    >
      Add
      <Plus className="size-4" />
    </Button>
  );

  return (
    <div key={id} className={cn(
      "border-border/50 border-b last:border-b-0",
      isMobile ? "p-4" : "p-2"
    )}>
      <div className={cn(
        "flex items-start justify-between",
        isMobile ? "gap-4" : "gap-4"
      )}>
        <div className="flex flex-1 flex-col">
          <HStack className={cn(isMobile && "mb-2")}>
            <toolkit.icon className={cn(isMobile ? "size-5" : "size-4")} />
            <h3 className={cn("font-medium", isMobile ? "text-base" : "text-sm")}>
              {toolkit.name}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className={cn(
                  "text-muted-foreground cursor-pointer", 
                  isMobile ? "size-4" : "size-3"
                )} />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-64">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Available Tools</p>
                  <ul className="space-y-1">
                    {Object.entries(toolkit.tools).map(([name, tool]) => (
                      <li key={name} className="flex items-start gap-2">
                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
                        <p className="text-xs">{tool.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </HStack>
          <p className={cn(
            "text-muted-foreground", 
            isMobile ? "text-sm" : "text-xs"
          )}>
            {toolkit.description}
          </p>
        </div>

        <div className={cn(
          "flex justify-end gap-2",
          isMobile ? "w-auto" : "w-28"
        )}>
          {toolkit.addToolkitWrapper ? (
            <toolkit.addToolkitWrapper>
              {addToolkitButtons}
            </toolkit.addToolkitWrapper>
          ) : (
            addToolkitButtons
          )}
        </div>
      </div>
    </div>
  );
};
