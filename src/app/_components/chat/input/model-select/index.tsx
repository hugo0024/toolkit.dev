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
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  ), [selectedChatModel]);

  const ModelList = useMemo(() => (
    <div className="w-full overflow-x-hidden overflow-y-auto">
      {models?.map((model) => (
        <div
          key={model.modelId}
          className={cn(
            "hover:bg-accent/50 flex w-full max-w-full cursor-pointer items-start gap-3 rounded-md p-3 transition-colors",
            selectedChatModel?.modelId === model.modelId && "bg-accent",
          )}
          onClick={() => handleModelSelect(model)}
        >
          <ModelProviderIcon
            provider={model.provider}
            className="size-5 flex-shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">
                {model.name}
              </span>
              {model.isNew && (
                <Badge variant="secondary" className="h-5 text-xs">
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
                        "h-5 gap-1 px-1.5 text-xs",
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
      ))}
    </div>
  ), [models, selectedChatModel, handleModelSelect]);

  const FilterSection = useMemo(() => (
    <div className="border-b p-3">
      <div className="relative mb-3">
        <Search className="text-muted-foreground absolute top-2.5 left-2 size-4" />
        <Input
          placeholder="Search models..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>
      
      <div className="space-y-3">
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
    </div>
  ), [
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] w-full max-w-2xl flex-col gap-4 overflow-hidden">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-xl">Select Model</DialogTitle>
          <DialogDescription>
            Choose an AI model and configure its capabilities
          </DialogDescription>
        </DialogHeader>
        <div className="flex-shrink-0">
          {FilterSection}
        </div>
        <div className="h-0 flex-1 overflow-y-auto">
          {ModelList}
        </div>
      </DialogContent>
    </Dialog>
  );
};
