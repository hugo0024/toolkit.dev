import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ToolkitDemoList } from "./toolkit-demo-list";
import { VStack } from "@/components/ui/stack";
import { MotionContainer } from "./motion-container";
import { AuthModal } from "../auth-modal";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative flex h-[200svh] items-center overflow-hidden border-b md:h-screen">
      <div className="container mx-auto flex h-full flex-col items-center pt-[53px] md:flex-row">
        <div className="w-full flex-1 p-2 md:w-1/2 md:p-16">
          <MotionContainer
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex h-full flex-col items-center justify-center gap-6 md:items-end"
          >
            <VStack className="items-center md:items-end">
              {/* <Badge variant="primary" className="text-lg">
                T3 Cloneathon Project
              </Badge> */}
              <h1 className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text text-center text-4xl leading-tight font-bold text-transparent md:text-right md:text-6xl">
                All In One
                <br />
                <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-center text-transparent md:text-right">
                  Generative AI Platform
                </span>
              </h1>
            </VStack>

            <p className="text-muted-foreground max-w-lg text-center text-lg leading-relaxed md:text-right md:text-xl">
              Access multiple AI models from leading providers in one unified interface. 
              Chat with Claude, GPT, Gemini, and more—all enhanced with powerful 
              toolkits for any task.
            </p>

            <div className="flex flex-col-reverse gap-4 sm:flex-row">
              <AuthModal>
                <Button
                  size="lg"
                  className="user-message text-base font-semibold"
                >
                  Try it Out
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </AuthModal>
            </div>
          </MotionContainer>
        </div>

        {/* Right Column - Toolkit Demo */}
        <div className="relative w-full flex-1 overflow-hidden md:h-full md:w-1/2">
          <MotionContainer
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex h-full flex-1 items-center justify-center"
          >
            <div className="size-full w-full overflow-y-hidden rounded-none p-2 pr-0 md:border-l md:py-16 md:pl-14">
              <ToolkitDemoList />
            </div>
          </MotionContainer>
        </div>
      </div>
    </section>
  );
};
