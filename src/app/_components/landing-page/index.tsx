import React from "react";
import { HeroSection } from "./hero";
import { ToolkitCreationSection } from "./toolkit-creation";
import { WorkbenchSection } from "./workbenches";
import { DependenciesSection } from "./dependencies";
import { Navbar } from "./navbar";

export const LandingPage: React.FC = () => {
  return (
    <div className="h-fit min-h-screen">
      <Navbar />
      <HeroSection />
      <ToolkitCreationSection />
      <WorkbenchSection />
      <DependenciesSection />
    </div>
  );
};

export default LandingPage;
