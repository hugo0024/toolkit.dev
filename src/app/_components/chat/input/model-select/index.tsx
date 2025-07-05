"use client";

import { X, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelProviderIcon } from "@/components/ui/model-icon";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
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
  capabilityColors,
  capabilityIcons,
  capabilityLabels,
  modelProviderNames,
} from "./utils";
import { LanguageModelCapability } from "@/ai/types";

import { useModelSelect } from "./use-model-select";

import { useChatContext } from "@/app/_contexts/chat-context";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { NativeSearchToggle } from "./native-search-toggle";

export const ModelSelect: React.FC = () => {
  const { selectedChatModel, setSelectedChatModel } = useChatContext();
  const isMobile = useIsMobile();
  const [showProviders, setShowProviders] = useState(false);
  const [showCapabilities, setShowCapabilities] = useState(false);

  const {
    models,
    isOpen,
    setIsOpen,
    searchQuery,
    setSearchQuery,
    selectedCapabilities,
    selectedProviders,
    toggleCapability,
    toggleProvider,
    handleModelSelect,
  } = useModelSelect({ selectedChatModel, setSelectedChatModel });

  // Get unique providers from models
  const availableProviders = useMemo(() => 
    Array.from(new Set((models ?? []).map((model) => model.provider))),
    [models]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  const toggleProvidersCollapse = useCallback(() => {
    setShowProviders(prev => !prev);
  }, []);

  const toggleCapabilitiesCollapse = useCallback(() => {
    setShowCapabilities(prev => !prev);
  }, []);

  const TriggerButton = useMemo(() => (
    <Button
      variant="outline"
      className="w-fit justify-start bg-transparent md:w-auto"
      onClick={(event) => {
        const target = event.target as HTMLElement;
        const isNativeSearchToggle = target.closest(
          '[data-native-search-toggle="true"]',
        );
        if (!isNativeSearchToggle) {
          setIsOpen(!isOpen);
        }
      }}
    >
      {selectedChatModel ? (
        <>
          <ModelProviderIcon
            provider={selectedChatModel.provider}
            className="size-4"
          />
          <span className="hidden flex-1 truncate text-left md:block">
            {selectedChatModel.name}
          </span>
          <NativeSearchToggle />
        </>
      ) : (
        <>
          <X className="mr-2 size-4" />
          Select a model
        </>
      )}
    </Button>
  ), [selectedChatModel, setIsOpen, isOpen]);

  const ModelList = useMemo(() => (
    <div className={cn(
      "w-full overflow-x-hidden overflow-y-auto",
      isMobile ? "flex-1 min-h-0" : "h-0 flex-1"
    )}>
      <div className={cn(
        isMobile ? "space-y-0" : "grid grid-cols-1 gap-2 p-2"
      )}>
        {models?.map((model) => (
          <div
            key={model.modelId}
                          className={cn(
                "group relative cursor-pointer transition-all duration-200",
                isMobile 
                  ? "border-b border-border/50 last:border-b-0 p-3 hover:bg-accent/50"
                  : "rounded-lg border border-border/50 p-3 hover:border-primary/20 hover:bg-accent/30 hover:shadow-sm",
                selectedChatModel?.modelId === model.modelId && 
                  (isMobile ? "bg-accent" : "bg-primary/5 border-primary/30 shadow-sm"),
              )}
            onClick={() => handleModelSelect(model)}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "rounded-lg p-2 transition-colors",
                selectedChatModel?.modelId === model.modelId
                  ? "bg-primary/10"
                  : "bg-muted/50 group-hover:bg-muted"
              )}>
                <ModelProviderIcon
                  provider={model.provider}
                  className="size-4 flex-shrink-0"
                />
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm truncate">
                    {model.name}
                  </h3>
                  {model.isNew && (
                    <Badge variant="secondary" className="h-4 text-xs font-medium">
                      New
                    </Badge>
                  )}
                </div>
                
                {model.capabilities && model.capabilities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {model.capabilities.map((capability) => {
                      const Icon = capabilityIcons[capability];
                      return (
                        <Badge
                          key={capability}
                          variant="capability"
                          className={cn(
                            "h-5 gap-1 px-1.5 text-xs font-medium",
                            capabilityColors[capability]
                          )}
                        >
                          {Icon && <Icon className="size-3" />}
                          <span>{capabilityLabels[capability]}</span>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ), [models, isMobile, selectedChatModel, handleModelSelect]);

  const FilterSection = useMemo(() => (
    <div className={cn("border-b", isMobile ? "p-3" : "p-2")}>
      <div className="relative mb-3">
        <Search className="text-muted-foreground absolute top-2.5 left-2 size-4" />
        <Input
          placeholder="Search models..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>
      
      {isMobile ? (
        <div className="space-y-2">
          <div>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-2 h-auto"
              onClick={toggleProvidersCollapse}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Providers</span>
                {selectedProviders.length > 0 && (
                  <Badge variant="secondary" className="h-5 text-xs">
                    {selectedProviders.length}
                  </Badge>
                )}
              </div>
              {showProviders ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
            {showProviders && (
              <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                {availableProviders.map((provider) => (
                  <Badge
                    key={provider}
                    variant={
                      selectedProviders.includes(provider)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer gap-1.5 px-2.5 py-1.5 text-xs"
                    onClick={() => toggleProvider(provider)}
                  >
                    <ModelProviderIcon
                      provider={provider}
                      className="size-3"
                    />
                    {modelProviderNames[provider]}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-2 h-auto"
              onClick={toggleCapabilitiesCollapse}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Capabilities</span>
                {selectedCapabilities.length > 0 && (
                  <Badge variant="secondary" className="h-5 text-xs">
                    {selectedCapabilities.length}
                  </Badge>
                )}
              </div>
              {showCapabilities ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
            {showCapabilities && (
              <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                {Object.values(LanguageModelCapability).map((capability) => {
                  const Icon = capabilityIcons[capability];
                  return (
                    <Badge
                      key={capability}
                      variant={
                        selectedCapabilities.includes(capability)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer gap-1.5 px-2.5 py-1.5 text-xs"
                      onClick={() => toggleCapability(capability)}
                    >
                      {Icon && <Icon className="size-3" />}
                      {capabilityLabels[capability]}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <div className="text-muted-foreground mb-1.5 text-xs font-medium">
              Providers
            </div>
            <div className="flex flex-wrap gap-1">
              {availableProviders.map((provider) => (
                <Badge
                  key={provider}
                  variant={
                    selectedProviders.includes(provider)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer gap-1 px-1.5 py-0.5"
                  onClick={() => toggleProvider(provider)}
                >
                  <ModelProviderIcon
                    provider={provider}
                    className="size-3"
                  />
                  {modelProviderNames[provider]}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1.5 text-xs font-medium">
              Capabilities
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.values(LanguageModelCapability).map((capability) => {
                const Icon = capabilityIcons[capability];
                return (
                  <Badge
                    key={capability}
                    variant={
                      selectedCapabilities.includes(capability)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer gap-1 px-1.5 py-0.5"
                    onClick={() => toggleCapability(capability)}
                  >
                    {Icon && <Icon className="size-3" />}
                    {capabilityLabels[capability]}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  ), [
    isMobile, 
    searchQuery, 
    handleSearchChange, 
    showProviders, 
    showCapabilities, 
    selectedProviders, 
    selectedCapabilities, 
    availableProviders, 
    toggleProvidersCollapse, 
    toggleCapabilitiesCollapse, 
    toggleProvider, 
    toggleCapability
  ]);

  if (isMobile) {
    return (
      <>
        {TriggerButton}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="h-[90vh] p-0 flex flex-col">
            <SheetHeader className="p-4 border-b flex-shrink-0">
              <SheetTitle>Select Model</SheetTitle>
              <SheetDescription>
                Choose an AI model and configure its capabilities
              </SheetDescription>
            </SheetHeader>
            <div className="flex-shrink-0">
              {FilterSection}
            </div>
            {ModelList}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {TriggerButton}
        </DialogTrigger>
        <DialogContent className="flex max-h-[80vh] w-full max-w-2xl flex-col gap-4 overflow-hidden">
          <DialogHeader className="gap-0">
            <DialogTitle className="text-xl">Model Selector</DialogTitle>

          </DialogHeader>
          <div className="flex-shrink-0">
            {FilterSection}
          </div>
          {ModelList}
        </DialogContent>
      </Dialog>
    </>
  );
};
