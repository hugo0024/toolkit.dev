import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Loader2, Save, Wrench } from "lucide-react";
import { useChatContext } from "@/app/_contexts/chat-context";
import { useEffect, useState } from "react";
import { ToolkitList } from "@/components/toolkit/toolkit-list";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { ToolkitIcons } from "@/components/toolkit/toolkit-icons";
import { clientToolkits } from "@/toolkits/toolkits/client";
import { LanguageModelCapability } from "@/ai/types";
import { useIsMobile } from "@/hooks/use-mobile";

export const ToolsSelect = () => {
  const { toolkits, addToolkit, removeToolkit, workbench, selectedChatModel } =
    useChatContext();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState(
    Object.keys(clientToolkits).some((toolkit) => searchParams.get(toolkit)),
  );
  const router = useRouter();

  useEffect(() => {
    if (
      !isOpen &&
      Object.keys(clientToolkits).some((toolkit) => searchParams.get(toolkit))
    ) {
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutate: updateWorkbench, isPending } =
    api.workbenches.updateWorkbench.useMutation({
      onSuccess: () => {
        toast.success("Workbench updated successfully");
        router.refresh();
        setIsOpen(false);
      },
    });

  const handleSave = () => {
    if (workbench) {
      updateWorkbench({
        id: workbench.id,
        name: workbench.name,
        systemPrompt: workbench.systemPrompt,
        toolkitIds: toolkits.map((toolkit) => toolkit.id),
      });
    }
  };

  const TriggerButton = (
    <Button
      variant={"outline"}
      className="w-fit justify-start bg-transparent md:w-auto md:px-2"
      disabled={
        !selectedChatModel?.capabilities?.includes(
          LanguageModelCapability.ToolCalling,
        )
      }
    >
      {toolkits.length > 0 ? (
        <ToolkitIcons toolkits={toolkits.map((toolkit) => toolkit.id)} />
      ) : (
        <Wrench />
      )}
      <span className="hidden md:block">
        {toolkits.length > 0
          ? `${toolkits.length} Toolkit${toolkits.length > 1 ? "s" : ""}`
          : "Add Toolkits"}
      </span>
    </Button>
  );

  const SaveButton = workbench !== undefined && (
    <Button
      variant={"outline"}
      className="bg-transparent"
      onClick={handleSave}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="animate-spin" /> : <Save />}
      Save
    </Button>
  );

  if (
    selectedChatModel &&
    !selectedChatModel.capabilities?.includes(
      LanguageModelCapability.ToolCalling,
    )
  ) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"outline"}
              className="w-fit cursor-not-allowed justify-start bg-transparent opacity-50 md:w-auto md:px-2"
            >
              <Wrench />
              <span className="hidden md:block">Add Toolkits</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This model does not support tool calling</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (isMobile) {
    return (
      <TooltipProvider>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <Button
            variant={"outline"}
            className="w-fit justify-start bg-transparent md:w-auto md:px-2"
            disabled={
              !selectedChatModel?.capabilities?.includes(
                LanguageModelCapability.ToolCalling,
              )
            }
            onClick={() => setIsOpen(true)}
          >
            {toolkits.length > 0 ? (
              <ToolkitIcons toolkits={toolkits.map((toolkit) => toolkit.id)} />
            ) : (
              <Wrench />
            )}
            <span className="hidden md:block">
              {toolkits.length > 0
                ? `${toolkits.length} Toolkit${toolkits.length > 1 ? "s" : ""}`
                : "Add Toolkits"}
            </span>
          </Button>

          <SheetContent side="bottom" className="h-[90vh] p-0 flex flex-col">
            <SheetHeader className="p-4 border-b flex-shrink-0">
              <SheetTitle>Manage Toolkits</SheetTitle>
              <SheetDescription>
                Add or remove tools to enhance your chat experience
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <ToolkitList
                selectedToolkits={toolkits}
                onAddToolkit={addToolkit}
                onRemoveToolkit={removeToolkit}
                isMobile={isMobile}
              />
            </div>
            {SaveButton && (
              <div className="flex-shrink-0 p-4 border-t">
                {SaveButton}
              </div>
            )}
          </SheetContent>
        </Sheet>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {TriggerButton}
        </DialogTrigger>

        <DialogContent className="flex max-h-[80vh] w-full max-w-2xl flex-col gap-4 overflow-hidden">
          <DialogHeader className="gap-0">
            <DialogTitle className="text-xl">Manage Toolkits</DialogTitle>
            <DialogDescription>
              Add or remove tools to enhance your chat experience
            </DialogDescription>
          </DialogHeader>
          <div className="h-0 flex-1 overflow-y-auto">
            <ToolkitList
              selectedToolkits={toolkits}
              onAddToolkit={addToolkit}
              onRemoveToolkit={removeToolkit}
            />
          </div>
          {SaveButton}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};
