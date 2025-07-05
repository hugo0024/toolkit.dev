// Removed unused imports since we're now using general public focused content
import { TravelPlanningCalling, TravelPlanningResult } from "./message/travel-planning";
import { BusinessResearchCalling, BusinessResearchResult } from "./message/business-research";
import { ProductivityCalling, ProductivityResult } from "./message/productivity";
import type { Message } from "./types";
import { Toolkits } from "@/toolkits/toolkits/shared";

export const demoSequence: Message[] = [
  {
    id: "1",
    type: "user",
    content: "I'm planning a vacation for next spring. Can you help me find some interesting destinations?",
  },
  {
    id: "2",
    type: "tool",
    callComponent: <TravelPlanningCalling />,
    resultComponent: <TravelPlanningResult />,
    toolkit: Toolkits.Exa,
  },
  {
    id: "3",
    type: "assistant",
    content:
      "Great options! Both Tokyo and Barcelona offer unique experiences. Tokyo is perfect for cherry blossom season, while Barcelona has amazing architecture and culture. Would you like me to help you plan activities for either destination?",
  },
  {
    id: "4",
    type: "user",
    content:
      "Actually, I'm also thinking about starting a sustainable fashion business. Can you research the market for me?",
  },
  {
    id: "5",
    type: "tool",
    callComponent: <BusinessResearchCalling />,
    resultComponent: <BusinessResearchResult />,
    toolkit: Toolkits.Exa,
  },
  {
    id: "6",
    type: "assistant",
    content:
      "The sustainable fashion market shows strong growth potential! With a 12.8% annual growth rate and strong demand from younger consumers, it's a great time to enter this space. The key opportunities include eco-friendly materials and direct-to-consumer models.",
  },
  {
    id: "7",
    type: "user",
    content:
      "That's exciting! I have a busy day ahead. Can you help me organize my schedule for maximum productivity?",
  },
  {
    id: "8",
    type: "tool",
    callComponent: <ProductivityCalling />,
    resultComponent: <ProductivityResult />,
    toolkit: Toolkits.Memory,
  },
  {
    id: "9",
    type: "assistant",
    content:
      "I've optimized your schedule for peak productivity! I've grouped similar tasks together and scheduled your most important work during your natural energy peaks. The focus time block will help you make significant progress on strategic planning without interruptions.",
  },
];
