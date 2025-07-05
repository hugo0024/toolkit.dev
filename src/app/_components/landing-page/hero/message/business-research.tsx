import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";

export const BusinessResearchCalling: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      <span>Analyzing market trends...</span>
    </div>
  );
};

export const BusinessResearchResult: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sustainable Fashion Market
          </CardTitle>
          <CardDescription>Market analysis and opportunities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">Market Size</span>
              </div>
              <div className="text-2xl font-bold">$15.2B</div>
              <div className="text-sm text-muted-foreground">Expected by 2027</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Target Audience</span>
              </div>
              <div className="text-2xl font-bold">68%</div>
              <div className="text-sm text-muted-foreground">Millennials & Gen Z</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Growth Rate</span>
              <span className="text-sm font-semibold text-green-600">+12.8% annually</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Key Opportunities</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">Eco-friendly materials</Badge>
              <Badge variant="secondary">Circular economy</Badge>
              <Badge variant="secondary">Direct-to-consumer</Badge>
              <Badge variant="secondary">Tech integration</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 