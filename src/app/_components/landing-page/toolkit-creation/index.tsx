"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { HStack, VStack } from "@/components/ui/stack";
import { toolkitCreationSteps } from "./data";
import { Button } from "@/components/ui/button";

export const ToolkitCreationSection: React.FC = () => {
  return (
    <section
      className="from-background to-muted/20 bg-gradient-to-b py-24"
      id="toolkit-creation"
    >
      <div className="container mx-auto px-2 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Customize Your AI Experience
            <span className="text-primary block">Simple. Powerful. Personal.</span>
          </h2>
          <p className="text-muted-foreground mx-auto mb-4 max-w-2xl text-lg">
            Add the tools you need, when you need them. From business analytics to creative projects, 
            customize your AI assistant to work exactly how you want.
          </p>
          <Link href="/login">
            <Button className="user-message">
              <ArrowRight className="size-4" />
              Get Started Free
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {toolkitCreationSteps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StepCard: React.FC<{
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  highlight: string;
  delay: number;
}> = ({ icon: Icon, title, description, features, highlight, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
  >
    <Card className="h-full">
      <CardHeader>
        <div className="bg-primary/10 rounded-lg p-3 w-fit">
          <Icon className="size-8 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="bg-primary/5 rounded-lg p-3">
          <p className="text-sm font-medium text-primary">{highlight}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
